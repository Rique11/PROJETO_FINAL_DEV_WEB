def _event(session_id="sess-01", device_id="dev-01", event_type="foco_perdido", **extra):
    return {
        "session_id": session_id,
        "device_id": device_id,
        "event_type": event_type,
        "occurred_at": "2026-11-11T10:00:00-03:00",
        **extra,
    }


def test_create_telemetry_event(client):
    response = client.post("/api/v1/telemetry", json=_event())

    assert response.status_code == 201
    data = response.json()
    assert data["session_id"] == "sess-01"
    assert data["device_id"] == "dev-01"
    assert data["event_type"] == "foco_perdido"
    assert "id" in data
    assert "received_at" in data


def test_filter_events_by_session(client, open_session):
    client.post("/api/v1/telemetry", json=_event())
    client.post(
        "/api/v1/telemetry",
        json=_event(open_session["id"], "dev-03", "foco_recuperado", duration_seconds=60),
    )

    response = client.get("/api/v1/telemetry", params={"session_id": "sess-01"})

    assert response.status_code == 200
    events = response.json()
    assert len(events) == 1
    assert events[0]["session_id"] == "sess-01"


def test_reject_invalid_event_type(client):
    response = client.post("/api/v1/telemetry", json=_event(event_type="captura_de_tela"))

    assert response.status_code == 422


def test_reject_event_for_unknown_or_closed_session(client):
    assert client.post("/api/v1/telemetry", json=_event("sess-x")).status_code == 404
    assert client.post("/api/v1/telemetry", json=_event("sess-02")).status_code == 409


def test_reject_event_from_device_outside_session(client):
    response = client.post("/api/v1/telemetry", json=_event(device_id="dev-03"))

    assert response.status_code == 422
