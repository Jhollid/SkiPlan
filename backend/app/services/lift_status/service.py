from app.models.domain import GraphEdge, LiftStatus


def resolve_edge_open_state(edge: GraphEdge, indexed_status: dict[str, LiftStatus]) -> bool:
    if edge.edge_type != "lift":
        return True

    status = indexed_status.get(edge.edge_key)
    if status is None:
        return True
    return status.status != "closed"
