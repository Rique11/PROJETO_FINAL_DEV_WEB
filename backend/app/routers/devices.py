from fastapi import APIRouter, status

from app.core.dependencies import MemoryRepositoryDependency
from app.schemas.devices import (
    DeviceCreate,
    DeviceResponse,
    DeviceStatus,
    DeviceStatusUpdate,
)

router = APIRouter(prefix="/devices", tags=["Dispositivos"])


@router.get("", response_model=list[DeviceResponse])
def list_devices(
    repository: MemoryRepositoryDependency,
    device_status: DeviceStatus | None = None,
):
    return repository.list_devices(status=device_status)


@router.post("", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
def create_device(data: DeviceCreate, repository: MemoryRepositoryDependency):
    return repository.create_device(data)


@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(device_id: str, repository: MemoryRepositoryDependency):
    return repository.get_device(device_id)


@router.patch("/{device_id}/status", response_model=DeviceResponse)
def update_device_status(
    device_id: str,
    data: DeviceStatusUpdate,
    repository: MemoryRepositoryDependency,
):
    return repository.update_device_status(device_id, data.status)
