# Vigia Escolar

Sistema web para organização pedagógica, controle de equipamentos e acompanhamento formativo no uso de dispositivos educacionais fornecidos pelo governo.

Projeto desenvolvido para a disciplina de **Desenvolvimento de Aplicações Web** (Engenharia de Computação — UTFPR) integrado ao projeto de extensão *"Desenvolvimento de Aplicações Web baseadas em Inteligência Artificial para Apoio de Professores da Educação Básica"*.

- **Equipe (Dupla):**
  - Pedro Lucas dos Reis Silva — RA 2272040
  - Henrique Cois Farjado Gau — RA 2369133
- **Tema:** 12 — *Segurança, controle e uso pedagógico dos dispositivos fornecidos pelo governo*
- **Repositório Git Público:** [https://github.com/plreis/PROJETO_FINAL_DEV_WEB](https://github.com/plreis/PROJETO_FINAL_DEV_WEB)
- **Demonstração Online (Sprint 1):** [https://plreis.github.io/PROJETO_FINAL_DEV_WEB/](https://plreis.github.io/PROJETO_FINAL_DEV_WEB/)

> **Nota sobre a composição da equipe:** Conforme alinhamento presencial pós-Sprint 1, o professor estabeleceu a obrigatoriedade estrita de duplas. O projeto foi formalizado para execução em dupla com Pedro Lucas e Henrique, cumprindo a regra institucional de participação integral de ambos os membros em todas as atividades técnicas, com divisão balanceada de tarefas e distribuição de commits ao longo de todas as sprints.

---

## 1. Descrição do Sistema

Vigia Escolar organiza o uso pedagógico de Chromebooks e tablets em escolas de educação básica.  
O professor abre uma sessão de aula e acompanha os dispositivos disponibilizados à turma.  
Durante a sessão, registra ocorrências de uso inadequado, acesso indevido ou risco à privacidade.  
O gestor consulta ocorrências e intervenções, com filtros e indicadores derivados dos registros.  
Cada ocorrência percorre um fluxo de análise, orientação e encerramento com decisão humana.  
A IA Gemini resume os registros selecionados e sugere intervenções educativas para revisão docente.  
A solução controla o acesso ao próprio sistema e minimiza a coleta de informações dos estudantes.  
O sistema não monitora navegação, câmera ou sistema operacional dos dispositivos; o acompanhamento depende de registro humano e telemetria leve consentida.

---

## 2. Cronograma de Desenvolvimento e Divisão de Tarefas por Sprint

Em atendimento à regra do edital (*"Todo membro deve participar de todas as atividades. Divisões em que alguém fica apenas com a documentação ou com outra parte específica implicam desconto"*), as tarefas de cada sprint são divididas de forma balanceada entre os dois integrantes, cobrindo Frontend, Backend, Inteligência Artificial, Testes, Deploy e Documentação.

| Sprint | Data Limite | Foco e Entregáveis | Status |
|---|---|---|:---:|
| **Sprint 1** | 04/11/2026 | Definição do sistema, equipe, Next.js funcional com mocks, componentes reutilizáveis, formulários com feedback, prevenção de conflito de alocação e exportação estática | **Concluída** |
| **Sprint 2** | 11/11/2026 | API FastAPI pública com `/docs`, schemas Pydantic, dados em memória, módulo de telemetria e endpoint de orientação assistida via Google Gemini | *Em Andamento* |
| **Sprint 3** | 18/11/2026 | Integração Frontend-API em produção (Vercel), autenticação JWT com controle de perfis, Dashboard Multitela da sala em tempo real e cálculo de desatenção | *Planejada* |
| **Sprint 4** | 25/11/2026 | Persistência com SQLModel + PostgreSQL Supabase, testes de reinício, manual do usuário (PDF) e documentação final (PDF/ZIP) | *Planejada* |

### Detalhamento das Atribuições por Integrante:

#### **Sprint 2 (11/11/2026) — API FastAPI Hospedada e Inteligência Artificial**
- **Pedro Lucas dos Reis Silva (Integrante 1):**
  - Configuração do FastAPI modular (`app/core/config.py`, injeção de dependências e CORS).
  - Implementação do serviço de integração com Google Gemini (`app/services/gemini_service.py`) com prompt de mediação pedagógica e tratamento de erros (429/503).
  - Modelagem dos Schemas Pydantic de entrada e saída da IA (`AIPedagogicalAdvice`).
  - Deploy da API em nuvem pública gratuita com HTTPS e monitoramento de saúde `/health`.
  - Testes automatizados do endpoint de IA (`tests/test_ai_endpoint.py`).
- **Henrique Cois Farjado Gau (Integrante 2):**
  - Implementação do repositório de persistência em memória (`app/repositories/memory_repo.py`).
  - Criação dos roteadores REST modulares de negócio (`/sessions`, `/devices`, `/incidents`).
  - Desenvolvimento do módulo de telemetria e eventos (`/telemetry`) para registro de perda de foco e alertas.
  - Atualização dos tipos TypeScript do frontend e preparação do cliente HTTP (`apiClient.ts`).
  - Testes unitários de rotas e validação da documentação OpenAPI em `/docs`.

#### **Sprint 3 (18/11/2026) — Integração Frontend-API, Autenticação JWT e Dashboard Multitela**
- **Pedro Lucas dos Reis Silva (Integrante 1):**
  - Emissão e validação de tokens JWT no backend com expiração, algoritmo HS256 e hash de senhas Argon2.
  - Criação do `AuthContext`, middleware de rotas protegidas e tela de login responsiva no Next.js.
  - Integração do componente de orientação assistida (`AIDemoCard` $\rightarrow$ `AIPedagogicalFeedback`) à rota real do Gemini.
  - Configuração de build e deploy contínuo do frontend na Vercel com injeção segura de variáveis de ambiente.
  - Testes de autorização e controle de acesso por papel (Professor vs. Gestor).
- **Henrique Cois Farjado Gau (Integrante 2):**
  - Construção do **Dashboard Multitela (Grid da Sala)** exibindo em mosaico o status de foco dos Chromebooks alocados.
  - Implementação da telemetria no cliente web (`/aula/[id]`) com listeners de `visibilitychange` para identificar saídas da aba da aula.
  - Implementação do algoritmo de cálculo do **Índice de Desatenção da Turma** no backend.
  - Conexão das telas de Dispositivos e Ocorrências com a API REST, com estados de loading e erro.
  - Testes E2E de navegação e fluxos de negócio protegidos por autenticação.

#### **Sprint 4 (25/11/2026) — Banco de Dados Relacional, Manuais e Entrega Final**
- **Pedro Lucas dos Reis Silva (Integrante 1):**
  - Configuração do SQLModel e pool de conexões assíncronas ao PostgreSQL gerenciado (Supabase/Neon) com SSL.
  - Mapeamento das entidades relacionais (`User`, `Classroom`, `Device`, `LessonSession`, `Incident`, `TelemetryEvent`, `AIAnalysis`).
  - Criação de scripts de migração e seed de dados escolares consistentes.
  - Redação e compilação da **Documentação Técnica do Sistema (PDF)** em template LaTeX acadêmico UTFPR.
  - Auditoria de segurança, limpeza de artefatos e empacotamento do arquivo ZIP autossuficiente (`frontend/` e `backend/`).
- **Henrique Cois Farjado Gau (Integrante 2):**
  - Migração da camada de repositório de memória para SQLModel com persistência real em disco.
  - Implementação do módulo de anexos de comprovação factual (snapshots de tela/fotos de sala) vinculados às ocorrências.
  - Elaboração do **Manual do Usuário Final (PDF)** ilustrado para Professores e Gestores.
  - Testes de sobrevivência a reinicialização da API em produção (verificação de persistência após reboot).
  - Estruturação conjunta e ensaio do pitch presencial de 5 minutos da entrega final.

---

## 3. Arquitetura e Stack Tecnológica

- **Frontend:** [Next.js](https://nextjs.org/) 15 (App Router com exportação estática `output: 'export'` na Sprint 1 e integração SSR/Vercel a partir da Sprint 3), [TypeScript](https://www.typescriptlang.org/) e [Tailwind CSS](https://tailwindcss.com/).
- **Backend:** Python 3.11+ com [FastAPI](https://fastapi.tiangolo.com/), [Pydantic v2](https://docs.pydantic.dev/) e Uvicorn.
- **Inteligência Artificial (Sprint 2):** Google Gemini API chamada exclusivamente a partir do backend, fornecendo diagnóstico de engajamento e orientações pedagógicas formativas.
- **Telemetria e Detecção de Foco (Sprint 3):** Web Standards com Page Visibility API (`visibilitychange`), sem necessidade de instalação de agentes nativos no sistema operacional dos Chromebooks escolares.
- **Autenticação e Autorização (Sprint 3):** JWT com algoritmo HS256, senhas com Argon2 e controle baseado em perfis (Professor, Gestor, Administrador).
- **Banco de Dados (Sprint 4):** PostgreSQL hospedado (Supabase/Neon) via [SQLModel](https://sqlmodel.tiangolo.com/).

---

## 4. Instruções de Instalação e Execução

### 4.1. Frontend (Next.js)

```bash
cd frontend

# Instalação das dependências
npm install

# Execução em modo de desenvolvimento (localhost:3000)
npm run dev

# Geração de exportação estática (pasta out/)
npm run build
```

Para inspecionar a saída estática gerada localmente:
```bash
npx serve out
```

### 4.2. Backend (FastAPI)

```bash
cd backend

# Criar e ativar ambiente virtual Python
python3 -m venv .venv
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env

# Executar a API em modo de desenvolvimento (localhost:8000)
uvicorn app.main:app --reload --port 8000
```

Endpoints disponíveis no backend:
- Swagger UI interativo: [http://localhost:8000/docs](http://localhost:8000/docs)
- Verificação de saúde: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## 5. Salvaguardas Éticas e Limites Operacionais

1. **Ausência de monitoramento invasivo:** O sistema não instala agentes em dispositivos dos alunos, não acessa câmeras, microfones nem rastreia histórico de navegação individual.
2. **Registro factual estrito:** As ocorrências registram apenas fatos observados presencialmente pelo docente, sem anotação de nomes ou dados sensíveis de menores.
3. **Decisão e mediação humana:** As sínteses geradas pelo modelo Gemini constituem exclusivamente sugestões pedagógicas formativas para análise do professor, não gerando punições automáticas.

---

## 6. Licença

Este projeto é disponibilizado sob a licença [MIT](LICENSE).
