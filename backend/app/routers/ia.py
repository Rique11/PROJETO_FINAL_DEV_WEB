from fastapi import APIRouter

from app.schemas.schemas import (
    AILiveGuidanceRequest,
    AILiveGuidanceResponse,
    AIPedagogicalAdvice,
    AIPedagogicalAdviceRequest,
)
from app.services.ai_guidance import (
    generate_live_guidance,
    generate_pedagogical_advice,
)


router = APIRouter(
    prefix="/ia",
    tags=["Inteligência pedagógica"],
)


@router.post(
    "/live",
    response_model=AILiveGuidanceResponse,
)
def live_guidance(data: AILiveGuidanceRequest):
    return generate_live_guidance(data)


@router.post(
    "/sessions/{session_id}/ai-advice",
    response_model=AIPedagogicalAdvice,
)
def pedagogical_advice(
    session_id: str,
    data: AIPedagogicalAdviceRequest,
):
    return generate_pedagogical_advice(session_id, data)
