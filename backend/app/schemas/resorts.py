from pydantic import BaseModel


class ResortSummary(BaseModel):
    id: int
    slug: str
    name: str
    country_code: str
    center_lat: float
    center_lng: float
    supports_lift_status: bool


class ResortMapMetadata(BaseModel):
    resort: ResortSummary
    bbox: dict
    nodes: list[dict]
    edges: list[dict]
