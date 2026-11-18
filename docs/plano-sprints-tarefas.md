# Plano de sprints e divisão de tarefas — Proteca

- **Disciplina:** Desenvolvimento de Aplicações Web (2026.2), UTFPR
- **Tema 12:** Segurança, controle e uso pedagógico dos dispositivos fornecidos pelo governo
- **Dupla:** Pedro Lucas dos Reis Silva (RA 2272040) e Henrique Cois Farjado Gau (RA 2369133)
- **Repositório:** https://github.com/plreis/proteca
- **Atualizado em:** 18/11/2026, depois da mudança de datas das Sprints 3 e 4

As tarefas de cada sprint estão em issues no GitHub, nos milestones `Sprint 3` e `Sprint 4`, com responsável e critério de aceite.

## Regras que guiam a divisão

- Os dois trabalham em frontend, backend e documentação em todas as sprints. O enunciado desconta quando alguém fica só com uma parte.
- Cada um faz commits com a própria conta do GitHub, ao longo da sprint e não só no último dia.
- Nada entra na `main` sem PR revisado pelo outro. Quem revisa precisa conseguir explicar o código na review.

## Cronograma

| Sprint | Entrega | Foco | Situação |
|---|---|---|---|
| 1 | 04/11 | Descrição, dupla e frontend com dados simulados | Concluída |
| 2 | 11/11 | API FastAPI pública com `/docs` e IA por endpoint | Código corrigido em 18/11; falta publicar no Coolify |
| 3 | 23/11 | Site público consumindo a API, login JWT, estados de carregamento e erro | Planejada |
| 4 | 30/11 | Persistência com SQLModel no Supabase, manual do usuário e entrega final | Planejada |

Stack e hospedagem: `docs/adr/0001-stack-e-hospedagem.md`. Escopo e privacidade: `docs/adr/0002-escopo-e-privacidade.md`.

## Sprint 2 — fechamento (Pedro)

A review de 11/11 aconteceu sem a API publicada. Em 18/11 a auditoria encontrou e corrigiu:

- API não iniciava em Python 3.12 por um `import` faltando.
- Rotas de dispositivos, sessões e ocorrências respondiam 500 (assinaturas diferentes entre rotas e repositório, sessões sem id, repositório vazio).
- Modelo `gemini-1.5-flash` desativado pelo Google; a IA nunca seria chamada de verdade.
- Schemas com nomes diferentes dos tipos do frontend e quatro formatos de resposta de IA.

Falta: publicar a API no Coolify seguindo `docs/deploy-coolify.md` e conferir `/docs` e o Live com a chave real.

## Sprint 3 — até 23/11

Critérios do professor: site público consumindo a API real, login funcionando, token nas requisições, JWT protegendo escrita e dados sensíveis, carregamento e erro tratados, URL da API e CORS por variável de ambiente.

| Pedro | Henrique |
|---|---|
| Autenticação no backend: `/auth/token`, `/auth/me`, senha com Argon2, JWT com expiração, perfis professor e gestor | Cliente HTTP do frontend (`apiClient.ts`) com URL da API por variável de ambiente e tratamento de erro |
| Tela de login, `AuthContext` e redirecionamento de páginas sem login | Sessões e Dispositivos ligados à API, com carregamento e erro |
| Painel Proteca Live usando `POST /sessions/{id}/live` | Ocorrências ligadas à API (lista, filtros, nova, mudança de status) |
| Dockerfile do frontend e deploy do site no Coolify | Proteção das rotas da API com JWT e testes de 401 e 403 |

Ordem: a autenticação do backend (Pedro) sai primeiro, até 20/11, porque a proteção das rotas (Henrique) depende dela. O cliente HTTP (Henrique) pode começar no mesmo dia, já que no começo as rotas ainda estão abertas.

## Sprint 4 — até 30/11

Critérios do professor: modelos SQLModel coerentes, dados mantidos após reiniciar a API, fluxo principal sem erros em produção, manual do usuário e pitch de até 2 minutos.

| Pedro | Henrique |
|---|---|
| Modelos SQLModel com relacionamentos, conexão com o Supabase e `SessionDep` | Repositório SQL com as mesmas operações do repositório em memória |
| Carga inicial de dados e usuários de demonstração | Teste de persistência: criar dados, reiniciar a API no Coolify e conferir |
| Documentação em PDF (dupla, descrição e README) e ZIP com `frontend/` e `backend/` | Manual do usuário em PDF com telas do sistema publicado |

Os dois: revisão final do fluxo em produção, pitch de 2 minutos e envio no Moodle até 30/11.
