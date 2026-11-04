from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

# Entidades preliminares SQLModel planejadas para a Sprint 4


class School(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Classroom(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    school_id: str = Field(foreign_key="school.id")
    name: str
    grade: str


class Device(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    school_id: str = Field(foreign_key="school.id")
    patrimonio: str = Field(index=True)
    type: str
    model: str
    status: str = Field(default="disponivel")


class LessonSession(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    school_id: str = Field(foreign_key="school.id")
    classroom_id: str = Field(foreign_key="classroom.id")
    teacher_id: str
    teacher_name: str
    objective: str
    status: str = Field(default="aberta")
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    closing_justification: Optional[str] = None


class Incident(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    school_id: str = Field(foreign_key="school.id")
    session_id: str = Field(foreign_key="lessonsession.id")
    device_id: Optional[str] = Field(default=None, foreign_key="device.id")
    author_id: str
    category: str
    description: str
    status: str = Field(default="aberta")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    closing_justification: Optional[str] = None
