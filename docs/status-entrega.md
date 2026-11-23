# Status das entregas — Proteca

Atualizado em 18/11/2026.

## Sprint 1 — concluída (04/11)

| Item | Situação |
|---|---|
| Repositório público e README | Feito |
| Frontend Next.js com dados simulados, formulários e listagens | Feito |
| Exportação estática no GitHub Pages | Feita (registro da Sprint 1) |
| Review presencial | Feita |

## Sprint 2 — código pronto, publicação pendente (11/11)

| Critério do professor | Situação | Onde verificar |
|---|---|---|
| API acessível por URL pública com `/docs` | Pendente: deploy no Coolify | `backend/Dockerfile` |
| Código organizado em módulos | Feito | `backend/app/{routers,schemas,repositories,services,core}` |
| Schemas Pydantic alinhados ao frontend | Feito | `backend/app/schemas/` e `frontend/src/types/index.ts` |
| Códigos HTTP e mensagens de erro adequados | Feito (404, 409, 422) | `backend/app/core/errors.py`, testes |
| IA com papel no fluxo do usuário | Feito: Live usa os dados da sessão | `POST /api/v1/sessions/{id}/live` |
| Chaves em variáveis de ambiente | Feito | `backend/.env.example` |

Verificação local em 18/11: 37 testes passando em Python 3.12 e 3.14, e imagem Docker testada (health, `/docs`, Live, CORS e healthcheck).

## Sprint 3 e Sprint 4

Ver `docs/plano-sprints-tarefas.md` e os milestones no GitHub.
