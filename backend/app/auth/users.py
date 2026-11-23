# backend/app/auth/users.py

from app.core.config import settings
from app.schemas.auth import UserInMemory, UserRole


def get_user(username: str) -> UserInMemory | None:
    """Usuário de demonstração até a Sprint 4 (#14 leva os usuários para o banco).

    O hash é lido a cada chamada para refletir a configuração atual.
    """
    users = {
        "professor@proteca.local": UserInMemory(
            id="usr-professor-01",
            username="professor@proteca.local",
            full_name="Professor Demonstração",
            role=UserRole.PROFESSOR,
            hashed_password=settings.SENHA_TESTE_HASH,
        ),
    }
    return users.get(username.lower())
