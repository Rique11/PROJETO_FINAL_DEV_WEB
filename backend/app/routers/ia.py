from fastapi import APIRouter

from app.schemas.schemas import AILiveGuidanceRequest, AILiveGuidanceResponse
from app.services.ai_guidance import generate_live_guidance


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