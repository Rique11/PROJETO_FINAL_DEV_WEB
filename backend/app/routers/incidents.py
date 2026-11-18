from fastapi import APIRouter, status

from app.core.dependencies import MemoryRepositoryDependency
from app.schemas.incidents import (
    IncidentCategory,
    IncidentCreate,
    IncidentResponse,
    IncidentStatus,
    IncidentStatusUpdate,
)

router = APIRouter(prefix="/incidents", tags=["Ocorrências"])


@router.get("", response_model=list[IncidentResponse])
def list_incidents(
    repository: MemoryRepositoryDependency,
    session_id: str | None = None,
    category: IncidentCategory | None = None,
    incident_status: IncidentStatus | None = None,
):
    return repository.list_incidents(
        session_id=session_id,
        category=category,
        status=incident_status,
    )


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(data: IncidentCreate, repository: MemoryRepositoryDependency):
    return repository.create_incident(data)


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str, repository: MemoryRepositoryDependency):
    return repository.get_incident(incident_id)


@router.patch("/{incident_id}/status", response_model=IncidentResponse)
def update_incident_status(
    incident_id: str,
    data: IncidentStatusUpdate,
    repository: MemoryRepositoryDependency,
):
    return repository.update_incident_status(
        incident_id=incident_id,
        new_status=data.status,
        justification=data.justification,
    )
