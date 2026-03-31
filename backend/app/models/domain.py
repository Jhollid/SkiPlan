from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    preference_profile: Mapped["UserPreference | None"] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    max_difficulty: Mapped[str] = mapped_column(String(16), default="blue")
    excluded_lift_types: Mapped[list[str]] = mapped_column(JSONB, default=list)
    routing_style: Mapped[str] = mapped_column(String(32), default="fastest")
    avoid_repeats: Mapped[bool] = mapped_column(Boolean, default=True)
    favorite_runs: Mapped[list[str]] = mapped_column(JSONB, default=list)

    user: Mapped[User] = relationship(back_populates="preference_profile")


class Resort(Base):
    __tablename__ = "resorts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    country_code: Mapped[str] = mapped_column(String(2))
    bbox: Mapped[dict] = mapped_column(JSONB)
    center_lat: Mapped[float] = mapped_column(Float)
    center_lng: Mapped[float] = mapped_column(Float)
    supports_lift_status: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    metadata_json: Mapped[dict] = mapped_column(JSONB, default=dict)


class GraphNode(Base):
    __tablename__ = "graph_nodes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    resort_id: Mapped[int] = mapped_column(ForeignKey("resorts.id"), index=True)
    node_key: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    node_type: Mapped[str] = mapped_column(String(64))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    metadata_json: Mapped[dict] = mapped_column(JSONB, default=dict)


class GraphEdge(Base):
    __tablename__ = "graph_edges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    resort_id: Mapped[int] = mapped_column(ForeignKey("resorts.id"), index=True)
    edge_key: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    from_node_key: Mapped[str] = mapped_column(String(128), index=True)
    to_node_key: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(255))
    edge_type: Mapped[str] = mapped_column(String(32))
    difficulty: Mapped[str | None] = mapped_column(String(16), nullable=True)
    lift_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    is_open: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    base_cost: Mapped[float] = mapped_column(Float, default=1.0)
    vertical_drop: Mapped[float] = mapped_column(Float, default=0.0)
    geometry_json: Mapped[dict] = mapped_column(JSONB)
    metadata_json: Mapped[dict] = mapped_column(JSONB, default=dict)


class LiftStatus(Base):
    __tablename__ = "lift_status"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    resort_id: Mapped[int] = mapped_column(ForeignKey("resorts.id"), index=True)
    lift_edge_key: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(32), default="unknown")
    source: Mapped[str] = mapped_column(String(64), default="manual")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class RoutePlan(Base):
    __tablename__ = "route_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    resort_id: Mapped[int] = mapped_column(ForeignKey("resorts.id"), index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    start_node_key: Mapped[str] = mapped_column(String(128))
    end_node_key: Mapped[str] = mapped_column(String(128))
    summary_json: Mapped[dict] = mapped_column(JSONB)
    steps_json: Mapped[list] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    resort_id: Mapped[int] = mapped_column(ForeignKey("resorts.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    is_sponsored: Mapped[bool] = mapped_column(Boolean, default=False)
