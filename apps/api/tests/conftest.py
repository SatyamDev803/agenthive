import os
import asyncio
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

# Minimal env so app.settings loads during import
os.environ.setdefault("SECRET_KEY", "test-secret")
# DATABASE_URL not used by tests (we override get_db), but keep it harmless
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

from app.core.db import Base  # after env vars
from app.core import db as db_module
from app.core import redis_client as rc_module
from app.main import app

# Single in-memory async SQLite engine for all tests
engine = create_async_engine(
    "sqlite+aiosqlite:///:memory:",
    poolclass=StaticPool,  # keep one connection so in-memory DB persists
    echo=False,
)
TestSession = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)

async def _init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@pytest.fixture(scope="session", autouse=True)
def _bootstrap_db():
    asyncio.run(_init_models())

@pytest.fixture
def client(monkeypatch):
    # Override DB dependency to use the test AsyncSession
    async def override_get_db():
        async with TestSession() as session:
            yield session

    app.dependency_overrides[db_module.get_db] = override_get_db

    # Patch Redis with fakeredis
    try:
        import fakeredis
    except ImportError:
        pytest.skip("fakeredis not installed")
    fake = fakeredis.FakeRedis(decode_responses=True)
    monkeypatch.setattr(rc_module, "redis_client", fake, raising=True)

    return TestClient(app)
