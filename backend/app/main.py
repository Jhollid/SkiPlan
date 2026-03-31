from collections.abc import Generator
from contextlib import contextmanager

from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.resorts import router as resorts_router
from app.api.routes import router as routes_router
from app.core.config import settings
from app.db.session import Base, SessionLocal, engine
from app.services.ingestion.service import ingest_flims_laax_fixture
from app.services.resorts.seed import seed_default_resort

@contextmanager
def lifespan(_: FastAPI) -> Generator[None, None, None]:
    Base.metadata.create_all(bind=engine)
    if settings.seed_sample_data_on_startup:
        with SessionLocal() as db:
            seed_default_resort(db)
            ingest_flims_laax_fixture(db)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(resorts_router, prefix=settings.api_prefix)
app.include_router(routes_router, prefix=settings.api_prefix)
