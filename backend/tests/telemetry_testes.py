import pytest
from fastapi.testclient import TestClient

from app.core.dependencies import get_memory_repository
from app.main import app
from app.repositories.memory_repo import MemoryRepository


@pytest.fixture
def repository():
    return MemoryRepository()


@pytest.fixture
def client(repository):
    app.dependency_overrides[get_memory_repository] = lambda: repository

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def test_create_telemetry_event(client):
    response = client.post(
        "/api/v1/telemetry",
        json={
            "session_id": "sess-001",
            "device_id": "dev-001",
            "event_type": "foco_perdido",
            "occurred_at": "2026-11-11T10:00:00-03:00",
        },
    )

    assert response.status_code == 201

    data = response.json()
    assert data["session_id"] == "sess-001"
    assert data["device_id"] == "dev-001"
    assert data["event_type"] == "foco_perdido"
    assert "id" in data
    assert "received_at" in data


def test_filter_events_by_session(client):
    client.post(
        "/api/v1/telemetry",
        json={
            "session_id": "sess-001",
            "device_id": "dev-001",
            "event_type": "foco_perdido",
            "occurred_at": "2026-11-11T10:00:00-03:00",
        },
    )

    client.post(
        "/api/v1/telemetry",
        json={
            "session_id": "sess-002",
            "device_id": "dev-002",
            "event_type": "foco_recuperado",
            "occurred_at": "2026-11-11T10:01:00-03:00",
            "duration_seconds": 60,
        },
    )

    response = client.get(
        "/api/v1/telemetry",
        params={"session_id": "sess-001"},
    )

    assert response.status_code == 200

    events = response.json()
    assert len(events) == 1
    assert events[0]["session_id"] == "sess-001"


def test_reject_invalid_event_type(client):
    response = client.post(
        "/api/v1/telemetry",
        json={
            "session_id": "sess-001",
            "device_id": "dev-001",
            "event_type": "captura_de_tela",
            "occurred_at": "2026-11-11T10:00:00-03:00",
        },
    )

    assert response.status_code == 422