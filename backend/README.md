# Vigia Escolar — Backend API

Backend desenvolvido em Python com **FastAPI**, estruturado para gerenciar as regras de negócio, autenticação JWT, persistência com SQLModel e integração com a API Gemini para orientação pedagógica assistida.

> **Status da Sprint 1:** Estrutura inicial (scaffold) com schemas tipados e verificação de integridade operacional (`/api/v1/health`). Os endpoints de negócio completos e a integração com o SDK Gemini serão ativados e hospedados na **Sprint 2 (11/11/2026)**.

---

## 1. Estrutura de Diretórios

```
backend/
├── app/
│   ├── auth/           # Módulo de autenticação JWT e senhas (Argon2)
│   ├── core/           # Configurações e variáveis de ambiente (Pydantic Settings)
│   ├── models/         # Modelos de dados relacionais (SQLModel)
│   ├── routers/        # Rotas da API (health, auth, sessions, incidents, ai)
│   ├── schemas/        # Contratos de entrada e saída (Pydantic v2)
│   ├── services/       # Lógica de integração e serviço Gemini
│   └── main.py         # Instância do FastAPI e middlewares (CORS)
├── tests/              # Testes automatizados (pytest e TestClient)
├── .env.example        # Exemplo inerte de configuração
├── requirements.txt    # Dependências do projeto
└── README.md
```

---

## 2. Requisitos de Ambiente

- Python 3.11+ (testado com Python 3.14)
- Pip / ambiente virtual (`venv`)

---

## 3. Instalação e Execução Local

```bash
# Criar e ativar ambiente virtual
python3 -m venv .venv
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env

# Executar servidor de desenvolvimento
uvicorn app.main:app --reload --port 8000
```

---

## 4. Documentação Interativa

Com o servidor em execução, acesse:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- Verificação de saúde: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## 5. Testes Automatizados

```bash
pytest tests/
```
