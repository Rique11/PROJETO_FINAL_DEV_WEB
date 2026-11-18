from enum import Enum

from pydantic import BaseModel, Field


class DeviceType(str, Enum):
    CHROMEBOOK = "chromebook"
    TABLET = "tablet"
    NOTEBOOK = "notebook"


class DeviceStatus(str, Enum):
    DISPONIVEL = "disponivel"
    EM_USO = "em_uso"
    MANUTENCAO = "manutencao"


class DeviceCreate(BaseModel):
    patrimonio: str = Field(min_length=3, max_length=40)
    type: DeviceType
    model: str = Field(min_length=2, max_length=120)


class DeviceStatusUpdate(BaseModel):
    status: DeviceStatus


class DeviceResponse(BaseModel):
    id: str
    school_id: str
    patrimonio: str
    type: DeviceType
    model: str
    status: DeviceStatus
