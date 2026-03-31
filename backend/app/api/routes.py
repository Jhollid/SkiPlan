from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.domain import LiftStatus, Resort, RoutePlan
from app.schemas.routing import RoutePlanRequest, RoutePlanResponse
from app.services.ingestion.service import build_graph_snapshot
from app.services.routing.engine import RoutePlanningError, build_graph_state, plan_route

router = APIRouter(prefix="/routes", tags=["routes"])


@router.post("/plan", response_model=RoutePlanResponse)
def create_route_plan(payload: RoutePlanRequest, db: Session = Depends(get_db)) -> RoutePlanResponse:
    resort = db.query(Resort).filter(Resort.slug == payload.resort_slug).first()
    if resort is None:
        raise HTTPException(status_code=404, detail="Resort not found.")

    nodes, edges = build_graph_snapshot(db, payload.resort_slug)
    statuses = db.query(LiftStatus).filter(LiftStatus.resort_id == resort.id).all()
    try:
        route = plan_route(
            graph=build_graph_state(nodes, edges, statuses),
            start_node_key=payload.start_node_key,
            end_node_key=payload.end_node_key,
            preferences=payload.preferences,
        )
    except RoutePlanningError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    db.add(
        RoutePlan(
            resort_id=resort.id,
            user_id=None,
            start_node_key=payload.start_node_key,
            end_node_key=payload.end_node_key,
            summary_json=route.summary.model_dump(),
            steps_json=[step.model_dump() for step in route.steps],
        )
    )
    db.commit()
    return route
