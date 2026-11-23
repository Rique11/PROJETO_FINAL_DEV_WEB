# backend/app/schemas/auth.py

from enum import Enum

from pydantic import BaseModel


class UserRole(str, Enum):
    PROFESSOR = "professor"
    GESTOR = "gestor"


class UserPublic(BaseModel):
    id: str
    username: str
    full_name: str
    role: UserRole
    disabled: bool = False


class UserInMemory(UserPublic):
    hashed_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"