# Deploy da Proteca no Coolify

## Backend FastAPI

Crie um serviço apontando para este repositório, com diretório raiz `backend`.

- **Build:** `pip install -r requirements.txt`
- **Start:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health check:** `/api/v1/health`

Configure no painel do Coolify:

```text
PROJECT_NAME=Proteca API
ENVIRONMENT=production
BACKEND_CORS_ORIGINS=https://<dominio-do-frontend>
GEMINI_API_KEY=<segredo-do-Google>
GEMINI_MODEL=gemini-1.5-flash
SECRET_KEY=<segredo-forte-para-o-ambiente>
```

`GEMINI_API_KEY` e `SECRET_KEY` devem ser secrets do Coolify. Não copie `backend/.env` para o Git e não use nenhuma dessas chaves em variáveis `NEXT_PUBLIC_*`.

## Frontend Next.js

O frontend atual pode ser publicado como exportação estática. Configure:

- **Diretório raiz:** `frontend`
- **Build:** `npm ci && npm run build`
- **Saída:** `out`
- **Variável:** `NEXT_PUBLIC_API_URL=https://<dominio-do-backend>/api/v1`

O build funciona sem essa variável usando fallback local, mas o modo Live real só será acionado quando ela apontar para o backend público. O backend precisa permitir essa origem em `BACKEND_CORS_ORIGINS`.

## Limites de privacidade

A Proteca não instala agente no notebook, não captura tela/áudio/vídeo continuamente e não envia notas individuais ou CSV ao Gemini. O Live usa sinais agregados e a decisão final permanece com o professor.
