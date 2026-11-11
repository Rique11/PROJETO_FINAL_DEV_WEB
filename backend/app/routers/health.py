from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "version": "0.1.0",
        "sprint": "sprint-1-scaffold",
        "message": "Scaffold inicial para a Sprint 1. Endpoints de negócio e integração Gemini serão ativados na Sprint 2.",
    }
