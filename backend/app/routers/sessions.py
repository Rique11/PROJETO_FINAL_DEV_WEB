from fastapi import APIRouter, status

from app.core.dependencies import MemoryRepositoryDependency
from app.schemas.ai import AILiveGuidanceResponse
from app.schemas.sessions import (
    SessionClose,
    SessionCreate,
    SessionResponse,
    SessionStatus,
)
from app.services.ai_guidance import generate_live_guidance
from app.services.session_signals import build_live_request

router = APIRouter(prefix="/sessions", tags=["Sessões"])


@router.get("", response_model=list[SessionResponse])
def list_sessions(
    repository: MemoryRepositoryDependency,
    session_status: SessionStatus | None = None,
):
    return repository.list_sessions(status=session_status)


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(data: SessionCreate, repository: MemoryRepositoryDependency):
    return repository.create_session(data)


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: str, repository: MemoryRepositoryDependency):
    return repository.get_session(session_id)


@router.patch("/{session_id}/close", response_model=SessionResponse)
def close_session(
    session_id: str,
    data: SessionClose,
    repository: MemoryRepositoryDependency,
):
    return repository.close_session(session_id, data.justification)


@router.post(
    "/{session_id}/live",
    response_model=AILiveGuidanceResponse,
    tags=["Inteligência pedagógica"],
    summary="Proteca Live da sessão",
    description=(
        "Calcula sinais agregados da sessão (telemetria e ocorrências abertas) e pede ao "
        "Gemini uma orientação pedagógica. Sem chave ou com falha do provedor, devolve o "
        "fallback local com is_mock=true."
    ),
)
def session_live(session_id: str, repository: MemoryRepositoryDependency):
    session = repository.get_open_session(session_id)
    return generate_live_guidance(build_live_request(repository, session))
