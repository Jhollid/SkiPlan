from collections.abc import Iterable


def map_osm_difficulty(tags: dict) -> str | None:
    raw = tags.get("piste:difficulty") or tags.get("difficulty")
    if raw in {"novice", "easy"}:
        return "green"
    if raw in {"intermediate", "blue"}:
        return "blue"
    if raw in {"advanced", "red"}:
        return "red"
    if raw in {"expert", "black"}:
        return "black"
    return None


def map_lift_type(tags: dict) -> str | None:
    aerialway = tags.get("aerialway")
    if aerialway in {"gondola", "cable_car", "mixed_lift"}:
        return "gondola"
    if aerialway in {"chair_lift", "drag_lift", "t-bar", "j-bar", "platter"}:
        return aerialway.replace("_", "-")
    return aerialway


def normalize_elements(elements: Iterable[dict]) -> dict[str, list[dict]]:
    nodes = []
    edges = []

    for element in elements:
        tags = element.get("tags", {})
        if element["type"] == "node" and tags.get("place") == "village":
            nodes.append(
                {
                    "node_key": f"osm-node-{element['id']}",
                    "name": tags.get("name", f"Village {element['id']}"),
                    "node_type": "village",
                    "latitude": element["lat"],
                    "longitude": element["lon"],
                    "metadata_json": {"source": "overpass"},
                }
            )
        elif element["type"] == "way" and ("piste:type" in tags or "aerialway" in tags):
            edge_type = "lift" if "aerialway" in tags else "piste"
            way_nodes = element.get("nodes", [])
            if len(way_nodes) < 2:
                continue

            edges.append(
                {
                    "edge_key": f"osm-way-{element['id']}",
                    "from_node_key": f"osm-node-{way_nodes[0]}",
                    "to_node_key": f"osm-node-{way_nodes[-1]}",
                    "name": tags.get("name", f"Segment {element['id']}"),
                    "edge_type": edge_type,
                    "difficulty": map_osm_difficulty(tags),
                    "lift_type": map_lift_type(tags),
                    "base_cost": 1.0,
                    "vertical_drop": 0.0,
                    "geometry_json": {"type": "LineString", "coordinates": []},
                    "metadata_json": {"source": "overpass", "tags": tags},
                }
            )

    return {"nodes": nodes, "edges": edges}
