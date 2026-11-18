# ADR 0001 — Stack e hospedagem

- **Status:** aceita
- **Data:** 18/11/2026
- **Substitui:** as menções a Vercel, Render e Fly.io no plano anterior

## Contexto

O enunciado fixa a stack: Next.js só como frontend, FastAPI, banco suportado pelo SQLModel, JWT e alguma IA. Também pede API pública com `/docs` (Sprint 2), site público consumindo a API (Sprint 3) e banco hospedado (Sprint 4).

Na Sprint 2 o frontend chegou a ser publicado na Vercel, mas a API não foi publicada. Ao auditar o código encontramos dois motivos para a API não funcionar em produção, mesmo que tivesse sido publicada:

1. `ai_guidance.py` usava `Any` sem importar. No Python 3.14 local isso passa despercebido (as anotações são avaliadas sob demanda), mas no Python 3.12 de um container a API nem inicia (`NameError`).
2. O modelo padrão era `gemini-1.5-flash`, que não existe mais. Com chave configurada, toda chamada falharia e cairia no fallback local.

## Decisão

| Camada | Escolha | Observação |
|---|---|---|
| Frontend | Next.js 15 + TypeScript + Tailwind | Build `standalone` em container no Coolify a partir da Sprint 3 |
| Backend | Python 3.12 + FastAPI + Pydantic v2 | `backend/Dockerfile`, mesma versão do Python em dev e produção |
| Banco | PostgreSQL do Supabase, acessado só via SQLModel | Sprint 4. Usamos o Supabase apenas como Postgres gerenciado |
| Autenticação | JWT emitido pelo FastAPI (OAuth2 password flow, PyJWT, pwdlib com Argon2) | Igual ao material da disciplina |
| IA | Gemini via REST, chamado só pelo backend | `GEMINI_MODEL=gemini-flash-latest`, chave no header `x-goog-api-key` |
| Hospedagem | Coolify na VM da equipe, dois serviços (API e site) | HTTPS com Let's Encrypt em domínios `sslip.io` |

### Por que o Supabase só como Postgres

O frontend não usa `supabase-js` nem o Supabase Auth. Se usasse, o site falaria direto com o banco e o JWT do FastAPI deixaria de proteger os dados, o que contraria os critérios das Sprints 3 e 4. Toda leitura e escrita passa pela API.

Na conexão usamos a string do **Session pooler** (porta 5432). A conexão direta do Supabase é só IPv6, e a VM pode não ter IPv6.

### Por que Coolify

A VM já existe e o Coolify publica a partir do repositório com Dockerfile, variáveis de ambiente como segredos e HTTPS automático. Os dois serviços ficam no mesmo lugar, o que simplifica CORS e a configuração de `NEXT_PUBLIC_API_URL`.

## Consequências

- Até a Sprint 4 os dados ficam em memória e somem a cada redeploy. Por isso a API carrega dados de demonstração (`SEED_DEMO_DATA=true`).
- `NEXT_PUBLIC_API_URL` é lida no build do Next.js. No Coolify ela precisa estar marcada como variável de build, e o site precisa de novo build quando a URL da API mudar.
- O GitHub Pages da Sprint 1 continua só como registro da versão estática com dados simulados. O site oficial passa a ser o do Coolify.
- A disponibilidade depende da VM estar ligada nas reviews. Antes de cada review conferimos `/api/v1/health`.
