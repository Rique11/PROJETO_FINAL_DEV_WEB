from fastapi import APIRouter

from app.schemas.ai import AILiveGuidanceRequest, AILiveGuidanceResponse
from app.services.ai_guidance import generate_live_guidance

router = APIRouter(prefix="/ia", tags=["Inteligência pedagógica"])


@router.post(
    "/live",
    response_model=AILiveGuidanceResponse,
    summary="Proteca Live com sinais informados",
    description=(
        "Versão sem estado: o cliente envia objetivo e sinais agregados. "
        "No fluxo da aplicação, prefira POST /sessions/{session_id}/live."
    ),
)
def live_guidance(data: AILiveGuidanceRequest):
    return generate_live_guidance(data)
