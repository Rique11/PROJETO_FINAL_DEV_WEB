# Deploy no Coolify

A API e o site rodam como dois recursos no Coolify da VM da equipe, a partir deste repositório. A decisão está em `docs/adr/0001-stack-e-hospedagem.md`.

## Antes de começar

- A VM precisa de IP público com as portas 80 e 443 abertas. O Let's Encrypt valida o domínio por elas.
- Usamos domínios `sslip.io`, que resolvem para o IP embutido no nome. Com IP `203.0.113.10`:
  - API: `https://api.203-0-113-10.sslip.io`
  - Site: `https://app.203-0-113-10.sslip.io`
- Os dois precisam de `https://`. Site em HTTPS chamando API em HTTP é bloqueado pelo navegador.

## 1. API (Sprint 2)

No painel: **Projects → (projeto Proteca) → + New → Public Repository**.

| Campo | Valor |
|---|---|
| Repository URL | `https://github.com/plreis/proteca` |
| Branch | `main` |
| Build Pack | `Dockerfile` |
| Base Directory | `/backend` |
| Dockerfile Location | `/Dockerfile` |
| Ports Exposes | `8000` |
| Domains | `https://api.<ip-com-hifens>.sslip.io` |

Em **Environment Variables**:

```text
ENVIRONMENT=production
PROJECT_NAME=Proteca API
BACKEND_CORS_ORIGINS=https://app.<ip-com-hifens>.sslip.io
SECRET_KEY=<gerar com: python3 -c "import secrets; print(secrets.token_urlsafe(48))">
GEMINI_API_KEY=<chave do Google AI Studio>
GEMINI_MODEL=gemini-flash-latest
SEED_DEMO_DATA=true
```

Marque `SECRET_KEY` e `GEMINI_API_KEY` como secretas e não marque nenhuma como variável de build. Em **Healthcheck**, use o caminho `/api/v1/health` na porta `8000`. Depois clique em **Deploy**.

Com `ENVIRONMENT=production` a API se recusa a iniciar sem uma `SECRET_KEY` de 32 caracteres ou mais. Se o deploy falhar logo no início, confira essa variável nos logs.

### Conferir

```bash
API=https://api.<ip-com-hifens>.sslip.io
curl -s $API/api/v1/health
curl -s -o /dev/null -w "%{http_code}\n" $API/docs
curl -s -X POST $API/api/v1/sessions/sess-01/live
```

No `/health`, `ai_provider` deve ser `gemini`. No Live, `is_mock` deve ser `false` e `model` deve ser o modelo configurado. Se vier `local-fallback` com chave configurada, os logs do Coolify mostram o código HTTP devolvido pelo Gemini (a chave não aparece nos logs).

## 2. Site (Sprint 3)

Fica para a Sprint 3, depois que o frontend passar a usar a API. O plano:

- `frontend/next.config.ts` com `output: "standalone"` e um `frontend/Dockerfile` (Node 20).
- Recurso novo no Coolify com Base Directory `/frontend`, porta `3000` e domínio `https://app.<ip-com-hifens>.sslip.io`.
- `NEXT_PUBLIC_API_URL=https://api.<ip-com-hifens>.sslip.io/api/v1` marcada como **variável de build**, porque o Next.js grava esse valor no JavaScript durante o build.

Nenhuma chave vai em variável `NEXT_PUBLIC_*`.

## 3. Banco (Sprint 4)

No Supabase: **Project Settings → Database → Connection string → Session pooler**. Cadastre na API:

```text
DATABASE_URL=postgresql+psycopg://postgres.<ref>:<senha>@aws-0-<regiao>.pooler.supabase.com:5432/postgres?sslmode=require
```

A senha do banco é segredo e só existe no Coolify e no `.env` local de quem precisar.

## Deploy contínuo

Repositório público não dispara deploy sozinho. Depois de cada merge na `main`, clique em **Redeploy**. Se quiser deploy automático, instale o GitHub App do Coolify no repositório.
