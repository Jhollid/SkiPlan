from app.models.domain import GraphEdge, LiftStatus
from app.services.lift_status.service import resolve_edge_open_state


def test_unknown_lift_status_defaults_to_open() -> None:
    edge = GraphEdge(
        resort_id=1,
        edge_key="lift-a",
        from_node_key="a",
        to_node_key="b",
        name="Lift A",
        edge_type="lift",
        lift_type="gondola",
        difficulty=None,
        is_open=None,
        base_cost=1,
        vertical_drop=0,
        geometry_json={},
        metadata_json={},
    )

    assert resolve_edge_open_state(edge, {}) is True


def test_closed_lift_status_marks_lift_closed() -> None:
    edge = GraphEdge(
        resort_id=1,
        edge_key="lift-a",
        from_node_key="a",
        to_node_key="b",
        name="Lift A",
        edge_type="lift",
        lift_type="gondola",
        difficulty=None,
        is_open=None,
        base_cost=1,
        vertical_drop=0,
        geometry_json={},
        metadata_json={},
    )

    status = LiftStatus(resort_id=1, lift_edge_key="lift-a", status="closed", source="test")
    assert resolve_edge_open_state(edge, {"lift-a": status}) is False
