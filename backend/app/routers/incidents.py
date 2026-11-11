from fastapi import APIRouter, HTTPException, status

from app.core.dependencies import MemoryRepositoryDependency
from app.schemas.schemas import (
    IncidentCategory,
    IncidentCreate,
    IncidentResponse,
    IncidentStatus,
    IncidentStatusUpdate,
)


router = APIRouter(
    prefix="/incidents",
    tags=["Ocorrências"],
)


@router.get(
    "",
    response_model=list[IncidentResponse],
)
def list_incidents(
    repository: MemoryRepositoryDependency,
    session_id: str | None = None,
    category: IncidentCategory | None = None,
    incident_status: IncidentStatus | None = None,
):
    return repository.list_incidents(
        session_id=session_id,
        category=category,
        incident_status=incident_status,
    )


@router.post(
    "",
    response_model=IncidentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_incident(
    data: IncidentCreate,
    repository: MemoryRepositoryDependency,
):
    try:
        return repository.create_incident(data)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.get(
    "/{incident_id}",
    response_model=IncidentResponse,
)
def get_incident(
    incident_id: str,
    repository: MemoryRepositoryDependency,
):
    incident = repository.get_incident(incident_id)

    if incident is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ocorrência não encontrada.",
        )

    return incident


@router.patch(
    "/{incident_id}/status",
    response_model=IncidentResponse,
)
def update_incident_status(
    incident_id: str,
    data: IncidentStatusUpdate,
    repository: MemoryRepositoryDependency,
):
    if data.status == IncidentStatus.ENCERRADA and not data.justification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A justificativa é obrigatória para encerrar uma ocorrência.",
        )

    incident = repository.update_incident_status(
        incident_id=incident_id,
        new_status=data.status,
        justification=data.justification,
    )

    if incident is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ocorrência não encontrada.",
        )

    return incident