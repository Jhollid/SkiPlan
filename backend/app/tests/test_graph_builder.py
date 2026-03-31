from app.services.ingestion.graph_builder import map_lift_type, map_osm_difficulty, normalize_elements


def test_difficulty_mapping() -> None:
    assert map_osm_difficulty({"piste:difficulty": "intermediate"}) == "blue"
    assert map_osm_difficulty({"piste:difficulty": "advanced"}) == "red"


def test_lift_mapping() -> None:
    assert map_lift_type({"aerialway": "chair_lift"}) == "chair-lift"
    assert map_lift_type({"aerialway": "gondola"}) == "gondola"


def test_normalize_elements_extracts_nodes_and_edges() -> None:
    normalized = normalize_elements(
        [
            {"type": "node", "id": 1, "lat": 46.8, "lon": 9.2, "tags": {"place": "village", "name": "Laax"}},
            {
                "type": "way",
                "id": 2,
                "nodes": [1, 2],
                "tags": {"piste:type": "downhill", "piste:difficulty": "intermediate", "name": "Blue Run"},
            },
        ]
    )

    assert normalized["nodes"][0]["node_key"] == "osm-node-1"
    assert normalized["edges"][0]["difficulty"] == "blue"


def test_unknown_difficulty_maps_to_none() -> None:
    assert map_osm_difficulty({"piste:difficulty": "extreme"}) is None
