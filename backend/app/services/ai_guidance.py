import json
from datetime import datetime, timezone
import httpx

from app.core.config import settings
from app.schemas.schemas import (
    AILiveGuidanceRequest,
    AILiveGuidanceResponse,
    AIPedagogicalAdvice,
    AIPedagogicalAdviceRequest,
    ProtecaIntervention,
    ProtecaState,
)


LIMITATIONS = (
    "Orientação de apoio ao professor; não diagnostica alunos, não prova intenção "
    "e não substitui observação humana ou decisão pedagógica."
)


def _fallback(request: AILiveGuidanceRequest) -> AILiveGuidanceResponse:
    focus = request.focus
    if focus.safety_alerts > 0:
        level = "alerta"
        pattern = "Há sinais de segurança que merecem uma pausa pedagógica coletiva."
        intervention = ProtecaIntervention(
            state=ProtecaState.ALERTA,
            title="Proteca em modo guardião",
            message="Vamos fazer uma pausa rápida para revisar segurança e respeito digital.",
            prompt="Qual atitude protege o aprendizado e os colegas nesta atividade?",
        )
    elif focus.focus_lost_events > max(1, focus.active_devices):
        level = "atenção"
        pattern = "A turma apresenta dispersão suficiente para justificar uma mudança de ritmo."
        intervention = ProtecaIntervention(
            state=ProtecaState.CURIOSIDADE,
            title="Proteca tem uma pergunta",
            message="Uma pista pode ajudar a turma a reencontrar o objetivo da aula.",
            prompt="Que parte do objetivo você consegue explicar com um exemplo?",
        )
    else:
        level = "foco"
        pattern = "Os sinais agregados não indicam necessidade de intervenção imediata."
        intervention = ProtecaIntervention(
            state=ProtecaState.ACOLHIMENTO,
            title="Proteca reconhece o foco",
            message="A turma está conectada ao objetivo. Aproveite o momento para aprofundar.",
            prompt="Quem consegue relacionar o conteúdo a uma situação real?",
        )

    return AILiveGuidanceResponse(
        session_id=request.session_id,
        model="local-fallback",
        generated_at=datetime.now(timezone.utc),
        attention_level=level,
        observed_pattern=pattern,
        teacher_suggestions=[
            "Retome o objetivo em uma frase e convide a turma a dar um exemplo.",
            "Faça uma pergunta aberta antes de mudar o formato da atividade.",
        ],
        intervention=intervention,
        limitations=LIMITATIONS,
        is_mock=True,
    )


def _prompt(request: AILiveGuidanceRequest) -> str:
    return f"""
Você é Proteca, um assistente de apoio pedagógico e segurança digital para professores.
Gere uma orientação breve, acolhedora e acionável para uma aula.
Nunca diagnostique alunos, atribua culpa, faça ranking ou recomende punição.
Use somente os sinais agregados abaixo; não invente dados individuais.
Responda JSON com as chaves: attention_level, observed_pattern,
teacher_suggestions (array com no máximo 2 itens), intervention (objeto ou null).
intervention deve conter state (acolhimento, curiosidade ou alerta), title, message e prompt.
Objetivo da aula: {request.objective}
Sinais agregados: {request.focus.model_dump_json()}
""".strip()


def _parse_generated(
    request: AILiveGuidanceRequest,
    payload: dict[str, Any],
) -> AILiveGuidanceResponse:
    return AILiveGuidanceResponse(
        session_id=request.session_id,
        model=settings.GEMINI_MODEL,
        generated_at=datetime.now(timezone.utc),
        attention_level=str(payload["attention_level"]),
        observed_pattern=str(payload["observed_pattern"]),
        teacher_suggestions=[str(item) for item in payload["teacher_suggestions"][:2]],
        intervention=(
            ProtecaIntervention.model_validate(payload["intervention"])
            if payload.get("intervention")
            else None
        ),
        limitations=LIMITATIONS,
        is_mock=False,
    )


def generate_live_guidance(request: AILiveGuidanceRequest) -> AILiveGuidanceResponse:
    if not settings.GEMINI_API_KEY:
        return _fallback(request)

    endpoint = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_MODEL}:generateContent"
    )
    body = {
        "contents": [{"parts": [{"text": _prompt(request)}]}],
        "generationConfig": {"responseMimeType": "application/json"},
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(
                endpoint,
                params={"key": settings.GEMINI_API_KEY},
                json=body,
            )
            response.raise_for_status()
            text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            return _parse_generated(request, json.loads(text))
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError):
        return _fallback(request).model_copy(
            update={"model": "local-fallback", "is_mock": True}
        )


def generate_pedagogical_advice(
    session_id: str,
    request: AIPedagogicalAdviceRequest,
) -> AIPedagogicalAdvice:
    guidance = generate_live_guidance(
        AILiveGuidanceRequest(
            session_id=session_id,
            objective=request.objective,
            focus=request.focus,
        )
    )
    interventions = list(guidance.teacher_suggestions)
    if guidance.intervention:
        interventions.append(guidance.intervention.message)

    return AIPedagogicalAdvice(
        session_summary=guidance.observed_pattern,
        engagement_diagnostic=guidance.attention_level,
        detected_patterns=[guidance.observed_pattern],
        pedagogical_interventions=interventions[:2],
        recommendations_for_management=[
            "Validar a sugestão com observação docente antes de qualquer encaminhamento."
        ],
        ethical_disclaimer=guidance.limitations,
    )
