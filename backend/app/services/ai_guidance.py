import json
import logging
from datetime import datetime, timezone
from typing import Any

import httpx

from app.core.config import settings
from app.schemas.ai import (
    AILiveGuidanceRequest,
    AILiveGuidanceResponse,
    ProtecaIntervention,
    ProtecaState,
)

logger = logging.getLogger(__name__)

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

LIMITATIONS = (
    "Orientação de apoio ao professor; não diagnostica alunos, não prova intenção "
    "e não substitui observação humana ou decisão pedagógica."
)

RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "attention_level": {"type": "STRING", "enum": ["foco", "atenção", "alerta"]},
        "observed_pattern": {"type": "STRING"},
        "teacher_suggestions": {"type": "ARRAY", "items": {"type": "STRING"}},
        "intervention": {
            "type": "OBJECT",
            "nullable": True,
            "properties": {
                "state": {"type": "STRING", "enum": [state.value for state in ProtecaState]},
                "title": {"type": "STRING"},
                "message": {"type": "STRING"},
                "prompt": {"type": "STRING"},
            },
            "required": ["state", "title", "message", "prompt"],
        },
    },
    "required": ["attention_level", "observed_pattern", "teacher_suggestions"],
}


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
        signals=focus,
        is_mock=True,
    )


def _prompt(request: AILiveGuidanceRequest) -> str:
    return f"""
Você é Proteca, um assistente de apoio pedagógico e segurança digital para professores
da educação básica que usam Chromebooks e tablets fornecidos pelo governo.
Gere uma orientação breve, acolhedora e acionável para o professor usar agora na aula.
Nunca diagnostique alunos, atribua culpa, faça ranking ou recomende punição.
Use somente os sinais agregados abaixo; não invente dados individuais.
Quando houver ocorrência de privacidade (câmera, imagem de colegas), oriente uma conversa
coletiva sobre consentimento e direito de imagem.
Responda em português, em JSON, com: attention_level (foco, atenção ou alerta),
observed_pattern, teacher_suggestions (no máximo 2 frases curtas) e intervention
(objeto com state, title, message e prompt, ou null).
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
        signals=request.focus,
        is_mock=False,
    )


def generate_live_guidance(request: AILiveGuidanceRequest) -> AILiveGuidanceResponse:
    if not settings.GEMINI_API_KEY:
        return _fallback(request)

    body = {
        "contents": [{"parts": [{"text": _prompt(request)}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": RESPONSE_SCHEMA,
        },
    }

    try:
        with httpx.Client(timeout=settings.GEMINI_TIMEOUT_SECONDS) as client:
            response = client.post(
                GEMINI_URL.format(model=settings.GEMINI_MODEL),
                headers={"x-goog-api-key": settings.GEMINI_API_KEY},
                json=body,
            )
            response.raise_for_status()
            text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            return _parse_generated(request, json.loads(text))
    except httpx.HTTPStatusError as error:
        logger.warning(
            "Gemini respondeu HTTP %s para o modelo %s; usando fallback local.",
            error.response.status_code,
            settings.GEMINI_MODEL,
        )
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError) as error:
        logger.warning(
            "Falha ao usar o Gemini (%s); usando fallback local.",
            type(error).__name__,
        )
    return _fallback(request)
