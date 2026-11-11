from fastapi import APIRouter, HTTPException, status

from app.core.dependencies import MemoryRepositoryDependency
from app.schemas.schemas import (
    SessionClose,
    SessionCreate,
    SessionResponse,
)


router = APIRouter(
    prefix="/sessions",
    tags=["Sessões"],
)


@router.get(
    "",
    response_model=list[SessionResponse],
)
def list_sessions(
    repository: MemoryRepositoryDependency,
):
    return repository.list_sessions()


@router.post(
    "",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_session(
    data: SessionCreate,
    repository: MemoryRepositoryDependency,
):
    try:
        return repository.create_session(data)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get(
    "/{session_id}",
    response_model=SessionResponse,
)
def get_session(
    session_id: str,
    repository: MemoryRepositoryDependency,
):
    session = repository.get_session(session_id)

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sessão não encontrada.",
        )

    return session


@router.patch(
    "/{session_id}/close",
    response_model=SessionResponse,
)
def close_session(
    session_id: str,
    data: SessionClose,
    repository: MemoryRepositoryDependency,
):
    try:
        session = repository.close_session(
            session_id=session_id,
            justification=data.justification,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sessão não encontrada.",
        )

    return session