from app.schemas.preferences import PreferenceProfile
from app.services.routing.engine import build_graph_state, plan_route
from app.tests.fixtures.synthetic_graph import synthetic_graph


def test_routes_respect_difficulty_limit() -> None:
    nodes, edges, statuses = synthetic_graph()
    result = plan_route(
        graph=build_graph_state(nodes, edges, statuses),
        start_node_key="start",
        end_node_key="end",
        preferences=PreferenceProfile(max_difficulty="blue", excluded_lift_types=["t-bar"]),
    )

    assert [step.edge_key for step in result.steps] == ["lift_open", "blue_run"]


def test_closed_lifts_are_excluded() -> None:
    nodes, edges, statuses = synthetic_graph()
    statuses[0].status = "closed"

    result = plan_route(
        graph=build_graph_state(nodes, edges, statuses),
        start_node_key="start",
        end_node_key="end",
        preferences=PreferenceProfile(max_difficulty="red"),
    )

    assert [step.edge_key for step in result.steps] == ["tbar", "red_run"]


def test_enjoyable_mode_prefers_vertical_and_favorites() -> None:
    nodes, edges, statuses = synthetic_graph()
    result = plan_route(
        graph=build_graph_state(nodes, edges, statuses),
        start_node_key="start",
        end_node_key="end",
        preferences=PreferenceProfile(
            max_difficulty="red",
            routing_style="enjoyable",
            favorite_runs=["Blue Cruise"],
        ),
    )

    assert [step.edge_key for step in result.steps] == ["lift_open", "blue_run"]


def test_returns_warning_when_no_valid_route_exists() -> None:
    nodes, edges, statuses = synthetic_graph()
    statuses[0].status = "closed"

    result = plan_route(
        graph=build_graph_state(nodes, edges, statuses),
        start_node_key="start",
        end_node_key="end",
        preferences=PreferenceProfile(max_difficulty="blue", excluded_lift_types=["t-bar"]),
    )

    assert result.steps == []
    assert result.summary.warnings == ["No valid route found with the selected preferences."]


def test_unknown_start_or_end_node_is_rejected() -> None:
    nodes, edges, statuses = synthetic_graph()

    try:
        plan_route(
            graph=build_graph_state(nodes, edges, statuses),
            start_node_key="missing",
            end_node_key="end",
            preferences=PreferenceProfile(max_difficulty="blue"),
        )
    except ValueError as exc:
        assert "Unknown start node" in str(exc)
    else:
        raise AssertionError("Expected missing start node to raise an error.")
