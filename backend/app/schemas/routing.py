from pydantic import BaseModel, Field

from app.schemas.preferences import PreferenceProfile


class RoutePlanRequest(BaseModel):
    resort_slug: str
    start_node_key: str
    end_node_key: str
    preferences: PreferenceProfile = Field(default_factory=PreferenceProfile)


class RouteStep(BaseModel):
    step_number: int
    edge_key: str
    name: str
    edge_type: str
    from_node_key: str
    to_node_key: str
    difficulty: str | None = None
    lift_type: str | None = None
    vertical_drop: float = 0.0


class RouteSummary(BaseModel):
    total_steps: int
    total_runs: int
    total_lifts: int
    estimated_vertical: float
    warnings: list[str] = Field(default_factory=list)


class RoutePlanResponse(BaseModel):
    route_id: str
    summary: RouteSummary
    steps: list[RouteStep]
