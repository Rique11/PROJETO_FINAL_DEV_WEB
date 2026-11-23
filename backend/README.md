# Proteca — API

API em FastAPI para sessões de aula, dispositivos, ocorrências, telemetria leve e a Proteca Live com Gemini.

## Estrutura

```text
app/
├── core/          configuração (env), erros de domínio e dependências
├── routers/       uma rota por recurso (school, devices, sessions, incidents, telemetry, ia, learning, health)
├── schemas/       contratos Pydantic, um arquivo por recurso
├── repositories/  repositório em memória e dados de demonstração (seed)
├── services/      Gemini/fallback, sinais agregados da sessão e contexto educacional
├── models/        tabelas SQLModel (Sprint 4)
├── auth/          JWT (Sprint 3)
└── main.py        app, CORS e registro das rotas
tests/             pytest com TestClient
Dockerfile         imagem de produção (Python 3.12)
```

## Executar

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
pytest
```

`/docs` traz o Swagger. `/api/v1/health` mostra se a IA está em modo `gemini` ou `local-fallback`.

## Erros

As regras de negócio levantam erros de domínio (`app/core/errors.py`), convertidos em:

- **404** quando turma, aparelho, sessão ou ocorrência não existe;
- **409** quando o estado não permite a ação (aparelho em uso, sessão já encerrada, transição inválida);
- **422** quando o corpo é inválido ou referencia um aparelho fora da sessão.

## Proteca Live

`POST /api/v1/sessions/{id}/live` conta, na própria API, os aparelhos da sessão, os eventos de foco perdido, os alertas e as ocorrências abertas por categoria. Só esses números e o objetivo da aula vão para o Gemini. A resposta inclui `signals`, para o professor ver em que dados a sugestão se baseou.

Sem chave, ou se o Gemini falhar, a resposta vem do fallback local com `model: "local-fallback"` e `is_mock: true`. O motivo da falha aparece no log (código HTTP ou tipo de erro), sem a chave.

`POST /api/v1/ia/live` faz o mesmo com sinais enviados pelo cliente e fica para testes e compatibilidade.

## Deploy

Imagem Docker em `backend/Dockerfile` (porta `8000`, healthcheck em `/api/v1/health`). As variáveis obrigatórias em produção estão em `.env.example`.
