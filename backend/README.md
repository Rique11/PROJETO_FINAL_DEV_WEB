# Proteca — Backend API

Backend desenvolvido em Python com **FastAPI**, estruturado para gerenciar regras de negócio, telemetria leve de sessão, contexto educacional público e integração opcional com a API Gemini para orientação pedagógica assistida.

> **Status da Sprint 2:** Rotas de negócio, telemetria, Proteca Live com fallback local e contexto opcional via Wikipedia/Open Library estão implementados. A chave Gemini é opcional em desenvolvimento e necessária apenas para geração real no ambiente publicado.

---

## 1. Estrutura de Diretórios

```
backend/
├── app/
│   ├── auth/           # Módulo de autenticação JWT e senhas (Argon2)
│   ├── core/           # Configurações e variáveis de ambiente (Pydantic Settings)
│   ├── models/         # Modelos de dados relacionais (SQLModel)
│   ├── routers/        # Rotas da API (health, sessions, incidents, telemetry, ia, learning)
│   ├── schemas/        # Contratos de entrada e saída (Pydantic v2)
│   ├── services/       # Gemini/fallback e contexto educacional
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

## 5. Rotas da Sprint 2

- `POST /api/v1/ia/live`: recebe objetivo e sinais agregados; retorna orientação estruturada e intervenção Proteca.
- `GET /api/v1/learning/context?query=...`: busca até quatro referências em Wikipedia/Open Library. Falhas externas retornam lista vazia e uma limitação explícita.

O Live nunca recebe notas individuais, CSV, captura de tela ou identificadores de alunos. Sem `GEMINI_API_KEY`, ele retorna `model: "local-fallback"` e `is_mock: true`.

## 6. Testes Automatizados

```bash
pytest tests/
```
