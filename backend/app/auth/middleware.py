# backend/app/auth/middleware.py

import logging
from datetime import UTC, datetime, timedelta
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pwdlib.exceptions import PwdlibError

from app.auth.users import get_user
from app.core.config import settings
from app.schemas.auth import UserInMemory, UserPublic

logger = logging.getLogger(__name__)

password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token"
)


def authenticate_user(
    username: str,
    password: str,
) -> UserInMemory | None:
    user = get_user(username)

    if user is None:
        return None

    try:
        password_ok = password_hash.verify(password, user.hashed_password)
    except PwdlibError:
        logger.warning("Hash de senha ilegível para %s; confira SENHA_TESTE_HASH.", user.username)
        return None

    if not password_ok:
        return None

    if user.disabled:
        return None

    return user


def create_access_token(user: UserInMemory) -> str:
    now = datetime.now(UTC)
    expires_at = now + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": user.username,
        "role": user.role.value,
        "iat": now,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> UserPublic:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        username = payload.get("sub")

        if not isinstance(username, str):
            raise credentials_error

    except InvalidTokenError:
        raise credentials_error

    user = get_user(username)

    if user is None or user.disabled:
        raise credentials_error

    return UserPublic(
        id=user.id,
        username=user.username,
        full_name=user.full_name,
        role=user.role,
        disabled=user.disabled,
    )


CurrentUser = Annotated[UserPublic, Depends(get_current_user)]