# Proteca

Sistema web para professores e gestores organizarem o uso dos Chromebooks e tablets fornecidos pelo governo, registrarem ocorrências e receberem orientação pedagógica assistida por IA.

Trabalho final de **Desenvolvimento de Aplicações Web** (Engenharia de Computação, UTFPR), integrado ao projeto de extensão *Desenvolvimento de Aplicações Web baseadas em Inteligência Artificial para Apoio de Professores da Educação Básica*.

- **Dupla:** Pedro Lucas dos Reis Silva (RA 2272040) e Henrique Cois Farjado Gau (RA 2369133)
- **Tema:** 12 — Problemas de segurança, controle e uso pedagógico dos dispositivos fornecidos pelo governo
- **Repositório:** https://github.com/plreis/proteca
- **API pública:** publicação no Coolify em andamento (ver `docs/deploy-coolify.md`)
- **Versão estática da Sprint 1:** https://plreis.github.io/proteca/

## Descrição do sistema

Durante as aulas, o uso de Chromebooks e tablets para atividades não relacionadas ao conteúdo e os registros de imagens sem autorização podem prejudicar a aprendizagem e a privacidade dos estudantes.
A Proteca é voltada para professores e gestores organizarem os dispositivos utilizados por cada turma e registrarem ocorrências e orientações.
O professor abre uma sessão de aula, vincula os aparelhos entregues à turma e registra fatos observados, como uso fora da atividade, acesso indevido ou uso da câmera para fotografar colegas.
O gestor acompanha o inventário (disponível, em uso, manutenção) e o andamento de cada ocorrência até o encerramento com justificativa.
Durante a aula, a Proteca Live envia ao Gemini apenas contagens da sessão e devolve sugestões de mediação para o professor, que continua decidindo o que fazer.
O sistema não instala nada nos aparelhos, não captura tela, câmera ou histórico de navegação e não cadastra nomes de estudantes.

## Como o sistema responde ao tema

| Problema do tema | O que a Proteca faz |
|---|---|
| Acesso a jogos e redes sociais mesmo com o filtro da SEED | Registro da ocorrência ligado à sessão e ao aparelho, e sugestão de intervenção na hora pela Proteca Live |
| Fotos e vídeos de colegas sem autorização | Categoria própria de ocorrência de privacidade; a IA orienta conversa sobre consentimento e direito de imagem |
| Controle dos dispositivos | Inventário com estados e vínculo de cada aparelho à sessão em que foi usado |
| LGPD, ECA e ECA Digital | Sem dados de estudantes, sem imagens, IA recebendo só números agregados, decisão sempre humana |

A Proteca não substitui o filtro de rede da SEED. Ela organiza o que acontece em sala e ajuda o professor a agir de forma pedagógica.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Python 3.12, FastAPI, Pydantic v2 |
| Banco (Sprint 4) | PostgreSQL no Supabase via SQLModel |
| Autenticação (Sprint 3) | JWT emitido pelo FastAPI |
| IA | Google Gemini, chamado só pelo backend |
| Hospedagem | Coolify em VM própria, HTTPS com Let's Encrypt |

Motivos em `docs/adr/0001-stack-e-hospedagem.md`.

## Estrutura

```text
backend/    API FastAPI (routers, schemas, repositories, services, core, models, auth)
frontend/   Next.js (app, components, features, services, types)
docs/       plano de sprints, decisões (adr/), deploy e status
```

## Como executar

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

- Documentação interativa: http://localhost:8000/docs
- Saúde: http://localhost:8000/api/v1/health
- Testes: `pytest`

A API sobe com dados de demonstração (escola, turmas, seis aparelhos, duas sessões e seis ocorrências). Sem `GEMINI_API_KEY`, o Live responde com o fallback local e marca `is_mock: true`.

Com Docker:

```bash
cd backend
docker build -t proteca-api .
docker run --rm -p 8000:8000 --env-file .env proteca-api
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

O site abre em http://localhost:3000. `NEXT_PUBLIC_API_URL` aponta para a API (por padrão `http://localhost:8000/api/v1`).

## Rotas principais da API

| Método | Rota | Uso |
|---|---|---|
| GET | `/api/v1/health` | Situação da API e modo da IA |
| GET | `/api/v1/school`, `/api/v1/classrooms` | Escola e turmas |
| GET, POST | `/api/v1/devices` | Inventário e cadastro de aparelhos |
| PATCH | `/api/v1/devices/{id}/status` | Manutenção ou disponível |
| GET, POST | `/api/v1/sessions` | Sessões de aula |
| PATCH | `/api/v1/sessions/{id}/close` | Encerrar sessão e liberar aparelhos |
| POST | `/api/v1/sessions/{id}/live` | Proteca Live com os dados da sessão |
| GET, POST | `/api/v1/incidents` | Ocorrências, com filtros |
| PATCH | `/api/v1/incidents/{id}/status` | Em análise, encerrada ou reaberta |
| GET, POST | `/api/v1/telemetry` | Eventos de foco por sessão e aparelho |

## Variáveis de ambiente

Backend (`backend/.env.example`): `BACKEND_CORS_ORIGINS`, `SECRET_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL` e, na Sprint 4, `DATABASE_URL`. A chave do Gemini e a `SECRET_KEY` ficam só no servidor.

Frontend (`frontend/.env.example`): `NEXT_PUBLIC_API_URL`. Nunca coloque chaves em variáveis `NEXT_PUBLIC_*`, porque elas vão para o navegador.

## Sprints

| Sprint | Entrega | Foco |
|---|---|---|
| 1 | 04/11 | Descrição, dupla e frontend com dados simulados |
| 2 | 11/11 | API pública com `/docs` e IA por endpoint |
| 3 | 23/11 | Site público integrado à API com login JWT |
| 4 | 30/11 | Banco no Supabase, manual do usuário e entrega final |

Divisão de tarefas: `docs/plano-sprints-tarefas.md`. Situação atual: `docs/status-entrega.md`.

## Licença

MIT. Ver `LICENSE`.
