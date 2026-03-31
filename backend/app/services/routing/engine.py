from __future__ import annotations

from dataclasses import dataclass
import heapq
from math import inf
from uuid import uuid4

from app.models.domain import GraphEdge, GraphNode, LiftStatus
from app.schemas.preferences import PreferenceProfile
from app.schemas.routing import RoutePlanResponse, RouteStep, RouteSummary
from app.services.lift_status.service import resolve_edge_open_state

DIFFICULTY_ORDER = {"green": 0, "blue": 1, "red": 2, "black": 3}


@dataclass(slots=True)
class GraphState:
    nodes: dict[str, GraphNode]
    outgoing_edges: dict[str, list[GraphEdge]]
    lift_status_by_edge: dict[str, LiftStatus]


class RoutePlanningError(ValueError):
    pass


def build_graph_state(nodes: list[GraphNode], edges: list[GraphEdge], statuses: list[LiftStatus]) -> GraphState:
    indexed_nodes = {node.node_key: node for node in nodes}
    outgoing: dict[str, list[GraphEdge]] = {}
    for edge in edges:
        outgoing.setdefault(edge.from_node_key, []).append(edge)

    return GraphState(
        nodes=indexed_nodes,
        outgoing_edges=outgoing,
        lift_status_by_edge={status.lift_edge_key: status for status in statuses},
    )


def _difficulty_allowed(edge: GraphEdge, profile: PreferenceProfile) -> bool:
    if edge.edge_type != "piste" or edge.difficulty is None:
        return True
    difficulty_rank = DIFFICULTY_ORDER.get(edge.difficulty)
    if difficulty_rank is None:
        return False
    return difficulty_rank <= DIFFICULTY_ORDER[profile.max_difficulty]


def _edge_weight(edge: GraphEdge, profile: PreferenceProfile, repeat_count: int, is_open: bool) -> float:
    if not _difficulty_allowed(edge, profile):
        return inf
    if edge.edge_type == "lift" and edge.lift_type in profile.excluded_lift_types:
        return inf
    if edge.edge_type == "lift" and not is_open:
        return inf

    weight = edge.base_cost

    if profile.routing_style == "enjoyable":
        if edge.edge_type == "piste":
            weight *= 0.85
        if edge.vertical_drop > 250:
            weight *= 0.8

    if edge.name in profile.favorite_runs:
        weight *= 0.7

    if profile.avoid_repeats and repeat_count > 0:
        weight += repeat_count * 2.0

    return weight


def plan_route(
    graph: GraphState,
    start_node_key: str,
    end_node_key: str,
    preferences: PreferenceProfile,
) -> RoutePlanResponse:
    if start_node_key not in graph.nodes:
        raise RoutePlanningError(f"Unknown start node '{start_node_key}'.")
    if end_node_key not in graph.nodes:
        raise RoutePlanningError(f"Unknown destination node '{end_node_key}'.")

    queue: list[tuple[float, str]] = [(0.0, start_node_key)]
    distances = {start_node_key: 0.0}
    previous: dict[str, tuple[str, GraphEdge]] = {}
    path_edge_counts: dict[str, dict[str, int]] = {start_node_key: {}}

    while queue:
        current_cost, node_key = heapq.heappop(queue)
        if node_key == end_node_key:
            break
        if current_cost > distances.get(node_key, inf):
            continue

        for edge in graph.outgoing_edges.get(node_key, []):
            current_edge_counts = path_edge_counts.get(node_key, {})
            repeat_count = current_edge_counts.get(edge.edge_key, 0)
            is_open = resolve_edge_open_state(edge, graph.lift_status_by_edge)
            weight = _edge_weight(edge, preferences, repeat_count, is_open)
            if weight == inf:
                continue

            next_cost = current_cost + weight
            if next_cost < distances.get(edge.to_node_key, inf):
                distances[edge.to_node_key] = next_cost
                previous[edge.to_node_key] = (node_key, edge)
                next_edge_counts = dict(current_edge_counts)
                next_edge_counts[edge.edge_key] = repeat_count + 1
                path_edge_counts[edge.to_node_key] = next_edge_counts
                heapq.heappush(queue, (next_cost, edge.to_node_key))

    if end_node_key not in previous and start_node_key != end_node_key:
        return RoutePlanResponse(
            route_id=str(uuid4()),
            summary=RouteSummary(
                total_steps=0,
                total_runs=0,
                total_lifts=0,
                estimated_vertical=0.0,
                warnings=["No valid route found with the selected preferences."],
            ),
            steps=[],
        )

    ordered_edges: list[GraphEdge] = []
    cursor = end_node_key
    while cursor != start_node_key:
        prior_node_key, edge = previous[cursor]
        ordered_edges.append(edge)
        cursor = prior_node_key
    ordered_edges.reverse()

    steps = [
        RouteStep(
            step_number=index + 1,
            edge_key=edge.edge_key,
            name=edge.name,
            edge_type=edge.edge_type,
            from_node_key=edge.from_node_key,
            to_node_key=edge.to_node_key,
            difficulty=edge.difficulty,
            lift_type=edge.lift_type,
            vertical_drop=edge.vertical_drop,
        )
        for index, edge in enumerate(ordered_edges)
    ]

    return RoutePlanResponse(
        route_id=str(uuid4()),
        summary=RouteSummary(
            total_steps=len(steps),
            total_runs=sum(1 for edge in ordered_edges if edge.edge_type == "piste"),
            total_lifts=sum(1 for edge in ordered_edges if edge.edge_type == "lift"),
            estimated_vertical=sum(edge.vertical_drop for edge in ordered_edges),
            warnings=[],
        ),
        steps=steps,
    )
