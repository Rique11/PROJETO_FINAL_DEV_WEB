from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_live_guidance_returns_honest_local_fallback_without_key():
    response = client.post(
        "/api/v1/ia/live",
        json={
            "session_id": "sess-001",
            "objective": "Compreender como proteger dados pessoais na escola.",
            "focus": {
                "active_devices": 10,
                "focus_lost_events": 12,
                "safety_alerts": 0,
                "open_incidents": 1,
                "elapsed_minutes": 20,
            },
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == "sess-001"
    assert data["is_mock"] is True
    assert data["model"] == "local-fallback"
    assert data["intervention"]["state"] == "curiosidade"
    assert "não diagnostica" in data["limitations"]


def test_live_guidance_rejects_short_objective():
    response = client.post(
        "/api/v1/ia/live",
        json={"session_id": "sess-001", "objective": "foco"},
    )

    assert response.status_code == 422
