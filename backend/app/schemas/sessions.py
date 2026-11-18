from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class SessionStatus(str, Enum):
    ABERTA = "aberta"
    ENCERRADA = "encerrada"


class SessionActionEntry(BaseModel):
    id: str
    timestamp: datetime
    action: str
    author: str
    note: str | None = None


class SessionCreate(BaseModel):
    classroom_id: str = Field(min_length=1)
    teacher_name: str = Field(min_length=3, max_length=120)
    objective: str = Field(min_length=10, max_length=500)
    device_ids: list[str] = Field(default_factory=list, max_length=60)


class SessionClose(BaseModel):
    justification: str = Field(min_length=10, max_length=500)


class SessionResponse(BaseModel):
    id: str
    school_id: str
    classroom_id: str
    teacher_name: str
    objective: str
    status: SessionStatus
    started_at: datetime
    ended_at: datetime | None = None
    allocated_device_ids: list[str] = Field(default_factory=list)
    closing_justification: str | None = None
    action_log: list[SessionActionEntry] = Field(default_factory=list)
