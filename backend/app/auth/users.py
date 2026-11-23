# backend/app/auth/users.py

from app.schemas.auth import UserInMemory, UserRole
from app.core.config import settings

USERS: dict[str, UserInMemory] = {
    "professor@proteca.local": UserInMemory(
        id="usr-professor-01",
        username="professor@proteca.local",
        full_name="Professor Demonstração",
        role=UserRole.PROFESSOR,
        hashed_password=settings.SENHA_TESTE_HASH,
    ),
}