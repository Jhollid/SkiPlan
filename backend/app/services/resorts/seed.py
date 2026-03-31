from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.domain import Resort


def seed_default_resort(db: Session) -> None:
    existing = db.query(Resort).filter(Resort.slug == settings.default_resort_slug).first()
    if existing:
        return

    db.add(
        Resort(
            slug=settings.default_resort_slug,
            name="Flims Laax",
            country_code="CH",
            bbox={"south": 46.81, "west": 9.18, "north": 46.89, "east": 9.32},
            center_lat=46.835,
            center_lng=9.24,
            supports_lift_status=False,
            metadata_json={
                "mvp_scope": True,
                "notes": "Initial v1 resort pending live OSM verification.",
            },
        )
    )
    db.commit()
