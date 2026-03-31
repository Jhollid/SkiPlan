from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.domain import GraphEdge, GraphNode, Resort
from app.schemas.resorts import ResortMapMetadata, ResortSummary

router = APIRouter(prefix="/resorts", tags=["resorts"])


@router.get("", response_model=list[ResortSummary])
def list_resorts(db: Session = Depends(get_db)) -> list[ResortSummary]:
    resorts = db.query(Resort).filter(Resort.is_active.is_(True)).all()
    return [
        ResortSummary(
            id=resort.id,
            slug=resort.slug,
            name=resort.name,
            country_code=resort.country_code,
            center_lat=resort.center_lat,
            center_lng=resort.center_lng,
            supports_lift_status=resort.supports_lift_status,
        )
        for resort in resorts
    ]


@router.get("/{resort_slug}/map-metadata", response_model=ResortMapMetadata)
def map_metadata(resort_slug: str, db: Session = Depends(get_db)) -> ResortMapMetadata:
    resort = db.query(Resort).filter(Resort.slug == resort_slug).first()
    if resort is None:
        raise HTTPException(status_code=404, detail="Resort not found.")

    nodes = db.query(GraphNode).filter(GraphNode.resort_id == resort.id).all()
    edges = db.query(GraphEdge).filter(GraphEdge.resort_id == resort.id).all()

    return ResortMapMetadata(
        resort=ResortSummary(
            id=resort.id,
            slug=resort.slug,
            name=resort.name,
            country_code=resort.country_code,
            center_lat=resort.center_lat,
            center_lng=resort.center_lng,
            supports_lift_status=resort.supports_lift_status,
        ),
        bbox=resort.bbox,
        nodes=[
            {
                "node_key": node.node_key,
                "name": node.name,
                "node_type": node.node_type,
                "latitude": node.latitude,
                "longitude": node.longitude,
            }
            for node in nodes
        ],
        edges=[
            {
                "edge_key": edge.edge_key,
                "from_node_key": edge.from_node_key,
                "to_node_key": edge.to_node_key,
                "name": edge.name,
                "edge_type": edge.edge_type,
                "difficulty": edge.difficulty,
                "lift_type": edge.lift_type,
                "is_open": edge.is_open,
                "geometry_json": edge.geometry_json,
            }
            for edge in edges
        ],
    )
