import asyncio

from app.db.session import Base, SessionLocal, engine
from app.services.ingestion.overpass import fetch_overpass_payload, flims_laax_query
from app.services.ingestion.service import ingest_flims_laax_fixture


async def main() -> None:
    Base.metadata.create_all(bind=engine)
    payload = await fetch_overpass_payload(flims_laax_query())
    print(f"Fetched {len(payload.get('elements', []))} OSM elements for Flims Laax.")

    with SessionLocal() as db:
        ingest_flims_laax_fixture(db)
        print("Seeded Flims Laax MVP fixture graph into Postgres.")


if __name__ == "__main__":
    asyncio.run(main())
