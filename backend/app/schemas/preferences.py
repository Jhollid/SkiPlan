from typing import Literal

from pydantic import BaseModel, Field


class PreferenceProfile(BaseModel):
    max_difficulty: Literal["green", "blue", "red", "black"] = Field(default="blue")
    excluded_lift_types: list[str] = Field(default_factory=list)
    routing_style: Literal["fastest", "enjoyable"] = Field(default="fastest")
    avoid_repeats: bool = True
    favorite_runs: list[str] = Field(default_factory=list)
