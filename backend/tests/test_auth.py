import pytest
from pwdlib import PasswordHash

from app.core.config import settings

DEMO_USERNAME = "professor@proteca.local"
DEMO_PASSWORD = "senha-de-teste-123"


@pytest.fixture
def demo_password_hash(monkeypatch):
    monkeypatch.setattr(
        settings,
        "SENHA_TESTE_HASH",
        PasswordHash.recommended().hash(DEMO_PASSWORD),
    )


def login(client, username, password):
    return client.post(
        "/api/v1/auth/token",
        data={"username": username, "password": password},
    )


def test_login_returns_bearer_token_for_demo_professor(client, demo_password_hash):
    response = login(client, DEMO_USERNAME, DEMO_PASSWORD)

    assert response.status_code == 200
    data = response.json()
    assert data["token_type"] == "bearer"
    assert data["access_token"]


@pytest.mark.parametrize(
    "misconfigured_hash",
    [
        "COLE_AQUI_O_HASH_GERADO",  # variável não definida (valor padrão)
        "",  # variável definida vazia
        "=19=65536,t=3,p=4=corrompido",  # "$" interpretado pelo painel de deploy
    ],
)
def test_login_is_401_when_demo_hash_is_misconfigured(client, monkeypatch, misconfigured_hash):
    monkeypatch.setattr(settings, "SENHA_TESTE_HASH", misconfigured_hash)

    response = login(client, DEMO_USERNAME, DEMO_PASSWORD)

    assert response.status_code == 401


def test_login_is_401_with_wrong_password(client, demo_password_hash):
    response = login(client, DEMO_USERNAME, "senha-errada")

    assert response.status_code == 401
    assert response.json()["detail"] == "Usuário ou senha inválidos."
