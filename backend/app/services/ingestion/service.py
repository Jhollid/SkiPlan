from sqlalchemy.orm import Session

from app.models.domain import GraphEdge, GraphNode, Resort
from app.services.ingestion.fixtures import FLIMS_LAAX_FIXTURE


def ingest_flims_laax_fixture(db: Session) -> None:
    resort = db.query(Resort).filter(Resort.slug == FLIMS_LAAX_FIXTURE["resort"]["slug"]).first()
    if resort is None:
        resort = Resort(**FLIMS_LAAX_FIXTURE["resort"], supports_lift_status=False, metadata_json={})
        db.add(resort)
        db.commit()
        db.refresh(resort)

    has_existing_graph = db.query(GraphNode.id).filter(GraphNode.resort_id == resort.id).first() is not None
    if has_existing_graph:
        return

    db.query(GraphNode).filter(GraphNode.resort_id == resort.id).delete()
    db.query(GraphEdge).filter(GraphEdge.resort_id == resort.id).delete()
    db.commit()

    for node in FLIMS_LAAX_FIXTURE["nodes"]:
        db.add(GraphNode(resort_id=resort.id, **node))

    for edge in FLIMS_LAAX_FIXTURE["edges"]:
        db.add(GraphEdge(resort_id=resort.id, is_open=None, **edge))

    db.commit()


def build_graph_snapshot(db: Session, resort_slug: str) -> tuple[list[GraphNode], list[GraphEdge]]:
    resort = db.query(Resort).filter(Resort.slug == resort_slug).first()
    if resort is None:
        raise ValueError(f"Unknown resort '{resort_slug}'.")

    nodes = db.query(GraphNode).filter(GraphNode.resort_id == resort.id).all()
    edges = db.query(GraphEdge).filter(GraphEdge.resort_id == resort.id).all()
    return nodes, edges
