import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.core.dependencies import build_repository, get_memory_repository
from app.main import app

OBJECTIVE = "Compreender como proteger dados pessoais na escola."


@pytest.fixture(autouse=True)
def no_real_gemini(monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", None)


@pytest.fixture
def repository():
    return build_repository(seed=True)


@pytest.fixture
def client(repository):
    app.dependency_overrides[get_memory_repository] = lambda: repository
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def open_session(client):
    response = client.post(
        "/api/v1/sessions",
        json={
            "classroom_id": "cls-8b",
            "teacher_name": "Profa. Teste",
            "objective": OBJECTIVE,
            "device_ids": ["dev-03", "dev-04"],
        },
    )
    assert response.status_code == 201
    return response.json()
