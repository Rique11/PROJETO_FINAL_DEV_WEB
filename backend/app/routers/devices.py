from fastapi import APIRouter, HTTPException, status

from app.core.dependencies import MemoryRepositoryDependency
from app.schemas.schemas import DeviceBase


router = APIRouter(
    prefix="/devices",
    tags=["Dispositivos"],
)


@router.get(
    "",
    response_model=list[DeviceBase],
)
def list_devices(
    repository: MemoryRepositoryDependency,
    device_status: str | None = None,
):
    return repository.list_devices(device_status=device_status)


@router.get(
    "/{device_id}",
    response_model=DeviceBase,
)
def get_device(
    device_id: str,
    repository: MemoryRepositoryDependency,
):
    device = repository.get_device(device_id)

    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dispositivo não encontrado.",
        )

    return device