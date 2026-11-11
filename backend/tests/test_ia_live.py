from fastapi.testclient import TestClient
import httpx

from app.main import app
from app.schemas.schemas import (
    AILiveGuidanceRequest,
    AILiveGuidanceResponse,
    ProtecaIntervention,
    ProtecaState,
)
from app.services.ai_guidance import generate_live_guidance


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


def test_ai_advice_adapts_a_controlled_guidance_response(monkeypatch):
    def fake_guidance(request):
        return AILiveGuidanceResponse(
            session_id=request.session_id,
            model="fake-gemini",
            generated_at="2026-11-11T12:00:00Z",
            attention_level="foco",
            observed_pattern="A turma está conectada ao objetivo.",
            teacher_suggestions=["Peça um exemplo aplicado."],
            intervention=ProtecaIntervention(
                state=ProtecaState.CURIOSIDADE,
                title="Pergunta Proteca",
                message="Uma pista pode aprofundar a conversa.",
                prompt="Qual exemplo confirma essa ideia?",
            ),
            limitations="Sugestão para revisão docente.",
            is_mock=False,
        )

    monkeypatch.setattr("app.services.ai_guidance.generate_live_guidance", fake_guidance)
    response = client.post(
        "/api/v1/ia/sessions/sess-001/ai-advice",
        json={"objective": "Compreender como proteger dados pessoais na escola."},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["session_summary"] == "A turma está conectada ao objetivo."
    assert data["pedagogical_interventions"] == [
        "Peça um exemplo aplicado.",
        "Uma pista pode aprofundar a conversa.",
    ]


def test_live_guidance_parses_a_successful_gemini_response(monkeypatch):
    class FakeResponse:
        def raise_for_status(self):
            return None

        def json(self):
            return {
                "candidates": [
                    {
                        "content": {
                            "parts": [
                                {
                                    "text": '{"attention_level":"foco","observed_pattern":"A turma avançou.","teacher_suggestions":["Peça uma síntese."],"intervention":null}'
                                }
                            ]
                        }
                    }
                ]
            }

    class FakeClient:
        def __enter__(self):
            return self

        def __exit__(self, *args):
            return None

        def post(self, *args, **kwargs):
            return FakeResponse()

    monkeypatch.setattr("app.core.config.settings.GEMINI_API_KEY", "test-key")
    monkeypatch.setattr("app.services.ai_guidance.httpx.Client", lambda **kwargs: FakeClient())
    response = generate_live_guidance(
        AILiveGuidanceRequest(
            session_id="sess-001",
            objective="Compreender como proteger dados pessoais na escola.",
        )
    )

    assert response.model == "gemini-1.5-flash"
    assert response.is_mock is False
    assert response.observed_pattern == "A turma avançou."


def test_live_guidance_falls_back_when_gemini_fails(monkeypatch):
    class FailingClient:
        def __enter__(self):
            return self

        def __exit__(self, *args):
            return None

        def post(self, *args, **kwargs):
            raise httpx.ConnectError(
                "provider unavailable",
                request=httpx.Request("POST", "https://example.com"),
            )

    monkeypatch.setattr("app.core.config.settings.GEMINI_API_KEY", "test-key")
    monkeypatch.setattr(
        "app.services.ai_guidance.httpx.Client",
        lambda **kwargs: FailingClient(),
    )
    response = generate_live_guidance(
        AILiveGuidanceRequest(
            session_id="sess-001",
            objective="Compreender como proteger dados pessoais na escola.",
        )
    )

    assert response.model == "local-fallback"
    assert response.is_mock is True
