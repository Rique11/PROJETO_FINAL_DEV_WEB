from pydantic import BaseModel


class SchoolResponse(BaseModel):
    id: str
    name: str
    city: str


class ClassroomResponse(BaseModel):
    id: str
    school_id: str
    name: str
    grade: str
