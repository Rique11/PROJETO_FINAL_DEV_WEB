def _incident(session_id, device_id=None, category="uso_nao_pedagogico"):
    return {
        "session_id": session_id,
        "device_id": device_id,
        "category": category,
        "description": "Aluno abriu jogo durante a pesquisa orientada.",
    }


def test_create_incident_in_open_session(client, open_session):
    response = client.post("/api/v1/incidents", json=_incident(open_session["id"], "dev-03"))

    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "aberta"
    assert data["actions"][0]["action"] == "Ocorrência registrada"


def test_incident_requires_existing_open_session(client):
    unknown = client.post("/api/v1/incidents", json=_incident("sess-x"))
    closed = client.post("/api/v1/incidents", json=_incident("sess-02"))

    assert unknown.status_code == 404
    assert closed.status_code == 409


def test_incident_device_must_belong_to_session(client, open_session):
    response = client.post("/api/v1/incidents", json=_incident(open_session["id"], "dev-06"))

    assert response.status_code == 422


def test_filter_incidents(client):
    response = client.get(
        "/api/v1/incidents",
        params={"session_id": "sess-01", "category": "acesso_indevido"},
    )

    assert response.status_code == 200
    assert [item["id"] for item in response.json()] == ["inc-06"]


def test_incident_status_flow(client):
    analysis = client.patch("/api/v1/incidents/inc-01/status", json={"status": "em_analise"})
    closed = client.patch(
        "/api/v1/incidents/inc-01/status",
        json={"status": "encerrada", "justification": "Conversa realizada com a dupla."},
    )

    assert analysis.status_code == 200
    assert closed.status_code == 200
    assert closed.json()["closing_justification"] == "Conversa realizada com a dupla."
    assert [action["action"] for action in closed.json()["actions"]][-2:] == [
        "Transição para Em Análise",
        "Ocorrência encerrada",
    ]


def test_closing_incident_requires_justification(client):
    response = client.patch("/api/v1/incidents/inc-01/status", json={"status": "encerrada"})

    assert response.status_code == 422


def test_invalid_incident_transition_returns_409(client):
    response = client.patch("/api/v1/incidents/inc-04/status", json={"status": "em_analise"})

    assert response.status_code == 409


def test_unknown_incident_returns_404(client):
    response = client.patch("/api/v1/incidents/inc-x/status", json={"status": "em_analise"})

    assert response.status_code == 404
