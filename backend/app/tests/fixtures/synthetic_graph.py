from app.models.domain import GraphEdge, GraphNode, LiftStatus


def synthetic_graph():
    nodes = [
        GraphNode(node_key="start", name="Start", node_type="village", latitude=0, longitude=0, resort_id=1),
        GraphNode(node_key="mid_blue", name="Mid Blue", node_type="junction", latitude=0, longitude=1, resort_id=1),
        GraphNode(node_key="mid_red", name="Mid Red", node_type="junction", latitude=1, longitude=1, resort_id=1),
        GraphNode(node_key="end", name="End", node_type="village", latitude=2, longitude=2, resort_id=1),
    ]
    edges = [
        GraphEdge(
            resort_id=1,
            edge_key="lift_open",
            from_node_key="start",
            to_node_key="mid_blue",
            name="Main Gondola",
            edge_type="lift",
            lift_type="gondola",
            difficulty=None,
            is_open=None,
            base_cost=2,
            vertical_drop=0,
            geometry_json={},
            metadata_json={},
        ),
        GraphEdge(
            resort_id=1,
            edge_key="blue_run",
            from_node_key="mid_blue",
            to_node_key="end",
            name="Blue Cruise",
            edge_type="piste",
            lift_type=None,
            difficulty="blue",
            is_open=None,
            base_cost=3,
            vertical_drop=400,
            geometry_json={},
            metadata_json={},
        ),
        GraphEdge(
            resort_id=1,
            edge_key="tbar",
            from_node_key="start",
            to_node_key="mid_red",
            name="Short T-Bar",
            edge_type="lift",
            lift_type="t-bar",
            difficulty=None,
            is_open=None,
            base_cost=1,
            vertical_drop=0,
            geometry_json={},
            metadata_json={},
        ),
        GraphEdge(
            resort_id=1,
            edge_key="red_run",
            from_node_key="mid_red",
            to_node_key="end",
            name="Red Direct",
            edge_type="piste",
            lift_type=None,
            difficulty="red",
            is_open=None,
            base_cost=1,
            vertical_drop=450,
            geometry_json={},
            metadata_json={},
        ),
    ]
    statuses = [LiftStatus(resort_id=1, lift_edge_key="lift_open", status="open", source="test")]
    return nodes, edges, statuses
