# Plano de Sprints e Divisão de Tarefas — Proteca

> **Disciplina:** Desenvolvimento de Aplicações Web (2026.2) — Engenharia de Computação, UTFPR  
> **Tema 12:** Segurança, controle e uso pedagógico dos dispositivos fornecidos pelo governo  
> **Equipe (Dupla):**  
> - **Integrante 1:** Pedro Lucas dos Reis Silva (RA 2272040)  
> - **Integrante 2:** Henrique Cois Farjado Gau (RA 2369133)  
> **Repositório Público:** [https://github.com/plreis/PROJETO_FINAL_DEV_WEB](https://github.com/plreis/PROJETO_FINAL_DEV_WEB)  
> **Data de Atualização:** 04/11/2026 (Pós-Review da Sprint 1)

---

## 1. Contexto e Diretrizes da Disciplina

Após a entrega e apresentação da **Sprint 1 (04/11/2026)**, a coordenação da disciplina estabeleceu a **obrigatoriedade estrita de realização do projeto em duplas**. Para atender a essa diretriz e assegurar a nota máxima nas rubricas de avaliação, este planejamento formaliza a transição do trabalho para dupla e estrutura o cronograma das Sprints 2, 3 e 4.

### 1.1. Regras Institucionais Obrigatórias
1. **Participação Integral:** *"Todo membro deve participar de todas as atividades. Divisões em que alguém fica apenas com a documentação ou com outra parte específica implicam desconto."*  
   $\rightarrow$ **Diretriz de Engenharia:** Não haverá separação estanque (ex: um apenas front e outro apenas back). Ambos atuarão em Frontend, Backend, Inteligência Artificial, Testes, DevOps/Deploy e Documentação.
2. **Histórico de Commits Distribuído:** *"O repositório é usado para verificar o histórico de commits e o progresso iterativo da equipe, que deve mostrar commits dos dois membros distribuídos ao longo das sprints."*  
   $\rightarrow$ **Diretriz de Versionamento:** Cada membro fará commits assinados com seu próprio usuário GitHub, distribuídos de forma regular em cada sprint.
3. **Domínio Compartilhado:** *"Nas reviews qualquer membro deve saber explicar qualquer decisão do projeto. Não saber justificar implica desconto."*  
   $\rightarrow$ **Diretriz de Pair Programming & Review:** Revisão mútua de Pull Requests e alinhamento prévio antes de cada pitch presencial de 5 minutos.

---

## 2. Incorporação das Novas Demandas Técnicas

Durante o uso e as discussões da Sprint 1, foram identificadas três oportunidades de alto impacto pedagógico e técnico para enriquecer o sistema:

1. **Problema 1 — Monitoramento dos Dispositivos em Tempo Real:**  
   - *Desafio:* Como acompanhar os aparelhos (Chromebooks/tablets) sem instalar softwares invasivos não autorizados nos equipamentos escolares do governo.  
   - *Solução:* Arquitetura baseada em **Web Standards (Client-Side Session via PWA / Aba da Aula)**:
     - Dispositivos na aula conectam-se à URL `/aula/{session_id}`.
     - Transmissão de telemetria leve (pulso/heartbeat a cada 10 segundos) via WebSocket ou Polling curto.
     - Detecção de foco e alternância de abas via **Page Visibility API** (`document.visibilitychange`) e `window.onblur`.
2. **Problema 2 — Captura de Comprovação Factual, Índice de Desatenção e Alertas de Risco:**  
   - *Captura Factual:* Mecanismo para anexar comprovação do desvio pedagógico (via captura de tela voluntária no navegador com `getDisplayMedia` ou registro fotográfico/anexo direto pelo professor).
   - *Índice de Desatenção da Turma:* Métrica calculada em tempo real com base no percentual de tempo fora da atividade pedagógica e na densidade de ocorrências abertas.
   - *Alertas de Risco:* Disparo de alertas visuais no painel do professor para desvio prolongado (> 3 minutos fora do foco) ou incidentes de privacidade/segurança.
3. **Problema 3 — Dashboard Multitela e Individual com IA:**  
   - *Visão Multitela (Grid da Sala):* Mosaico com cards de todos os Chromebooks do carrinho alocados na aula, indicando em tempo real quem está em foco, em segundo plano ou com alerta.
   - *Visão Individual:* Detalhamento da linha do tempo de eventos de cada dispositivo.
   - *Síntese da IA Gemini:* Endpoint que processa o histórico de eventos, ocorrências e índice de desatenção da sessão, gerando recomendações pedagógicas humanizadas e formativas para o docente.

---

## 3. Cronograma Geral das Sprints

| Sprint | Data Limite | Foco Principal | Entregáveis Avaliados | Status |
|:---:|:---:|---|---|:---:|
| **Sprint 1** | 04/11/2026 | Equipe, Descrição e Frontend Mockado | Next.js funcional, formulários com feedback, componentes reutilizáveis, prevenção de conflito e deploy Pages estático | **Concluída** |
| **Sprint 2** | 11/11/2026 | API FastAPI Hospedada e Proteca Live | API pública em nuvem com `/docs`, schemas Pydantic, dados em memória, telemetria, fallback local e endpoint Gemini funcional | **Entregue nesta branch** |
| **Sprint 3** | 18/11/2026 | Integração Frontend-API, JWT e Dashboard Multitela | Site hospedado (Vercel) consumindo API real, login JWT com controle de acesso, grid da sala em tempo real e cálculo de desatenção | *Planejada* |
| **Sprint 4** | 25/11/2026 | Persistência Relacional, Manuais e Entrega Final | SQLModel + PostgreSQL Supabase, sobrevivência ao reinício, Manual do Usuário (PDF), Relatório Técnico (PDF) e ZIP final | *Planejada* |

---

## 4. Divisão Detalhada de Tarefas por Sprint e por Integrante

### Sprint 2 (04/11 a 11/11/2026) — API FastAPI Hospedada e Inteligência Artificial
**Objetivo:** Publicar a API FastAPI em nuvem gratuita com documentação interativa em `/docs`, repositório em memória para sessões/ocorrências/telemetria e integração real com a API do Google Gemini.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SPRINT 2 — DIVISÃO                            │
├───────────────────────────────────┬────────────────────────────────────┤
│ Pedro Lucas dos Reis Silva        │ Henrique Cois Farjado Gau          │
├───────────────────────────────────┼────────────────────────────────────┤
│ 1. Arquitetura Base FastAPI & CORS│ 1. Repositório em Memória e Dados  │
│ 2. Serviço Gemini (Google AI SDK) │ 2. Roteadores de Negócio (/crud)   │
│ 3. Schemas Pydantic de IA         │ 3. Roteador de Telemetria e Alertas│
│ 4. Deploy em Nuvem (Render/Fly.io)│ 4. Testes Unitários de Rotas       │
│ 5. Testes de Integração da IA     │ 5. Documentação OpenAPI (/docs)    │
└───────────────────────────────────┴────────────────────────────────────┘
```

#### Atribuição de Tarefas na Sprint 2:
- **Pedro Lucas dos Reis Silva (Integrante 1):**
  - **[BACKEND]** Configuração da estrutura modular do FastAPI (`app/main.py`, `app/core/config.py`), injeção de dependências e configuração de CORS para origens autorizadas.
  - **[IA]** Implementação do Live da Proteca (`app/services/ai_guidance.py`), com prompts parametrizados, entrada agregada, fallback local e tratamento de indisponibilidade.
  - **[BACKEND]** Definição dos schemas Pydantic para a funcionalidade de IA (`app/schemas/ai.py`): entrada sanitizada de eventos/ocorrências e saída estruturada com resumo, padrões observados e recomendações formativas.
  - **[DEVOPS]** Configuração de variáveis de ambiente (`GEMINI_API_KEY`, `ALLOWED_ORIGINS`) e deploy público da API em plataforma gratuita (ex: Render ou Fly.io), garantindo disponibilidade pública com HTTPS.
  - **[TESTES]** Testes automatizados do endpoint de IA com mocks controlados para integração contínua (`tests/test_ai_endpoint.py`).

- **Henrique Cois Farjado Gau (Integrante 2):**
  - **[BACKEND]** Implementação do repositório de persistência em memória (`app/repositories/memory_repo.py`) para sessões ativas, catálogo de dispositivos e ocorrências pedagógicas.
  - **[BACKEND]** Desenvolvimento dos roteadores REST modulares (`app/routers/sessions.py`, `app/routers/devices.py`, `app/routers/incidents.py`) com operações de consulta, criação e encerramento.
  - **[BACKEND / TELEMETRIA]** Criação do módulo de telemetria (`app/routers/telemetry.py`), com endpoints para receber heartbeats dos dispositivos da aula, registrar alternância de abas (`PERDA_DE_FOCO`) e disparar alertas.
  - **[FRONTEND]** Atualização dos tipos TypeScript e conexão do painel Proteca Live com `NEXT_PUBLIC_API_URL`, mantendo fallback local.
  - **[TESTES & DOCS]** Criação da suíte de testes unitários para os endpoints de negócio (`tests/test_sessions.py`, `tests/test_telemetry.py`) e revisão técnica da documentação Swagger em `/docs`.

---

### Sprint 3 (11/11 a 18/11/2026) — Integração Frontend-API, Autenticação JWT e Dashboard Multitela
**Objetivo:** Remover todos os mocks em produção, conectar o frontend hospedado (Vercel) à API real, implementar autenticação JWT segura com controle de perfis e disponibilizar o Dashboard Multitela da sala de aula com detecção de desatenção.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SPRINT 3 — DIVISÃO                            │
├───────────────────────────────────┬────────────────────────────────────┤
│ Pedro Lucas dos Reis Silva        │ Henrique Cois Farjado Gau          │
├───────────────────────────────────┼────────────────────────────────────┤
│ 1. Autenticação JWT no Backend    │ 1. Dashboard Multitela (Grid Sala) │
│ 2. AuthContext e Login no Frontend│ 2. Telemetria no Cliente (Aba Aula)│
│ 3. Integração Frontend com Gemini │ 3. Cálculo de Índice de Desatenção │
│ 4. Deploy do Frontend (Vercel)    │ 4. Integração de Sessões e Ocorr.  │
│ 5. Proteção de Rotas & Middleware │ 5. Testes E2E de Fluxo e Segurança │
└───────────────────────────────────┴────────────────────────────────────┘
```

#### Atribuição de Tarefas na Sprint 3:
- **Pedro Lucas dos Reis Silva (Integrante 1):**
  - **[SEGURANÇA / BACKEND]** Implementação do módulo de autenticação JWT (`app/auth/`): emissão de tokens assinados com algoritmo HS256, hash de senhas com Argon2/Bcrypt, verificação de expiração e dependências de extração do usuário corrente.
  - **[AUTORIZAÇÃO / BACKEND]** Proteção de rotas sensíveis com validação de perfis (Professor só altera suas sessões; Gestor consulta histórico global da escola).
  - **[FRONTEND / AUTH]** Criação do `AuthContext`, hook `useAuth`, tela de login com feedback de erro de credenciais e redirecionamento seguro pós-login.
  - **[FRONTEND / IA]** Conexão do componente de orientação assistida (`AIDemoCard` $\rightarrow$ `AIPedagogicalFeedback`) à rota real da API `/api/v1/sessions/{id}/ai-advice`, renderizando o retorno estruturado do Gemini.
  - **[DEVOPS]** Configuração da implantação do frontend na Vercel com injeção segura de `NEXT_PUBLIC_API_URL` e testes de CORS em produção.

- **Henrique Cois Farjado Gau (Integrante 2):**
  - **[FRONTEND / MULTITELA]** Construção do componente de **Dashboard Multitela (Grid da Sala)** em `frontend/src/features/classroom/ClassroomGrid.tsx`: visualização em mosaico de todos os Chromebooks alocados na aula com crachás de foco em tempo real.
  - **[FRONTEND / CLIENTE AULA]** Implementação da interface do dispositivo do aluno (`/aula/[sessionId]`) com envio periódico de heartbeat e listeners de `visibilitychange` para identificar quando o aluno sai da aba pedagógica.
  - **[BACKEND / MÉTRICAS]** Implementação do algoritmo do **Índice de Desatenção da Turma** no backend, calculando a métrica em tempo real a partir do tempo fora de foco e ocorrências abertas.
  - **[FRONTEND / INTEGRAÇÃO]** Substituição dos mocks das páginas de Dispositivos, Ocorrências e Detalhes da Sessão por chamadas HTTP autenticadas (usando Axios ou Fetch com bearer token).
  - **[TESTES]** Testes end-to-end do fluxo completo (Login $\rightarrow$ Nova Sessão $\rightarrow$ Alocação de Dispositivos $\rightarrow$ Telemetria $\rightarrow$ Consulta ao Gemini $\rightarrow$ Encerramento) e testes de rejeição para requisições sem token (HTTP 401/403).

---

### Sprint 4 (18/11 a 25/11/2026) — Persistência Relacional, Manuais e Entrega Final
**Objetivo:** Substituir a memória por banco relacional PostgreSQL hospedado (Supabase) via SQLModel, garantir resiliência e integridade após reinicialização, elaborar o Manual do Usuário e Documentação Técnica (PDFs) e gerar o pacote ZIP final da disciplina.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SPRINT 4 — DIVISÃO                            │
├───────────────────────────────────┬────────────────────────────────────┤
│ Pedro Lucas dos Reis Silva        │ Henrique Cois Farjado Gau          │
├───────────────────────────────────┼────────────────────────────────────┤
│ 1. Modelagem SQLModel e Conexão BD│ 1. Repositório SQL & Consultas     │
│ 2. Migrações e Seed de Dados      │ 2. Anexo de Evidências Factual     │
│ 3. Documentação Técnica do Sistema│ 3. Manual do Usuário Final (PDF)   │
│ 4. Empacotamento Final (ZIP)      │ 4. Testes de Sobrevivência/Reinício│
│ 5. Auditoria de Segurança & LGPD  │ 5. Preparação Conjunta do Pitch    │
└───────────────────────────────────┴────────────────────────────────────┘
```

#### Atribuição de Tarefas na Sprint 4:
- **Pedro Lucas dos Reis Silva (Integrante 1):**
  - **[BANCO DE DADOS]** Configuração do SQLModel e SQLAlchemy assíncrono conectado ao PostgreSQL do Supabase via connection pool com SSL habilitado.
  - **[BANCO DE DADOS]** Implementação dos modelos relacionais definitivos (`User`, `Classroom`, `Device`, `LessonSession`, `Incident`, `TelemetryEvent`, `AIAnalysis`) com chaves estrangeiras e índices.
  - **[BACKEND]** Criação do script de migrações e seed inicial para instanciar a escola de demonstração, turmas e carrinho de Chromebooks com dados íntegros.
  - **[DOCUMENTAÇÃO]** Redação e compilação da **Documentação Técnica do Sistema (PDF)** utilizando template LaTeX acadêmico UTFPR (arquitetura, decisões técnicas, conformidade ética, endpoints e evidências de execução).
  - **[DEVOPS & RELEASE]** Auditoria final de código, verificação de segredos fora do repositório e geração do arquivo `.zip` autossuficiente contendo `frontend/` e `backend/` limpos de dependências temporárias.

- **Henrique Cois Farjado Gau (Integrante 2):**
  - **[BACKEND / REPOSITÓRIO]** Migração da camada de repositório de memória para SQLModel (`app/repositories/sql_repo.py`), assegurando que todas as rotas leiam e gravem diretamente no banco relacional.
  - **[FUNCIONALIDADE / EVIDÊNCIAS]** Implementação do suporte a anexo de evidências factuais (snapshots / prints) associados a ocorrências, com armazenamento e sanitização adequados.
  - **[DOCUMENTAÇÃO]** Elaboração do **Manual do Usuário Final (PDF)** focado em professores e gestores: guia passo a passo ilustrado com capturas reais de tela ensinando a gerenciar a sala, monitorar dispositivos, agir perante desvios e utilizar a orientação da IA.
  - **[TESTES DE RESILIÊNCIA]** Execução de testes de sobrevivência a reinicialização: inserção de registros em produção, desligamento/reinício do servidor da API e verificação de integridade dos dados mantidos no banco.
  - **[PITCH FINAL]** Estruturação conjunta do pitch presencial de 5 minutos da entrega final, dividindo a fala entre os dois integrantes conforme exigido pelo regulamento.

---

## 5. Especificação Técnica das Novas Funcionalidades

### 5.1. Arquitetura de Telemetria sem Agente Invasivo
Para evitar bloqueios de rede corporativa escolar e violações de privacidade:
- O aluno acessa a aplicação web via navegador institucional ChromeOS.
- O componente `StudentSessionListener.tsx` escuta:
  ```typescript
  document.addEventListener("visibilitychange", () => {
    const isHidden = document.hidden;
    telemetryClient.sendEvent({
      sessionId,
      deviceId,
      type: isHidden ? "PERDA_DE_FOCO" : "RETOMADA_DE_FOCO",
      timestamp: new Date().toISOString()
    });
  });
  ```
- O backend recebe o evento e atualiza o estado em memória/banco, calculando o tempo cumulativo fora da atividade pedagógica.

### 5.2. Algoritmo do Índice de Desatenção
O indicador percentual da turma varia de 0% a 100% e é computado a cada ciclo:
$$\text{Índice} = \min\left(100, \, \left(\frac{\sum T_{\text{desfoco}}}{N_{\text{dispositivos}} \times T_{\text{sessão\_decorrido}}} \times 65\right) + \left(\frac{N_{\text{ocorrências\_ativas}}}{N_{\text{dispositivos}}} \times 35\right)\right)$$
- **Faixa Verde (< 15%):** Turma engajada na atividade.
- **Faixa Amarela (15% a 35%):** Dispersão moderada; recomendação de intervenção pedagógica pelo professor.
- **Faixa Vermelha (> 35%):** Alto desvio ou risco; sugestão de pausa na tela e acionamento da IA para redirecionamento didático.

### 5.3. Pipeline da IA Gemini
1. **Entrada do Endpoint:** `POST /api/v1/sessions/{id}/ai-advice`
2. **Contexto Sanitizado:** Duração da aula, objetivo pedagógico, índice de desatenção, categorias de ocorrências abertas e descrições factuais (sem nomes de alunos).
3. **Prompt do Sistema:** Instrução pedagógica estrita baseada em mediação educativa, acolhimento e métodos ativos, com proibição de sugerir sanções punitivas automáticas.
4. **Validação de Saída Pydantic:**
   ```python
   class AIPedagogicalAdvice(BaseModel):
       session_summary: str
       engagement_diagnostic: str
       detected_patterns: list[str]
       pedagogical_interventions: list[str]
       recommendations_for_management: list[str]
       ethical_disclaimer: str
   ```

---

## 6. Fluxo Git e Estratégia de Versionamento da Dupla

Para assegurar histórico balanceado de commits exigido na avaliação:
1. **Padrão de Branches:**
   - `main`: Branch estável de produção.
   - `feat/sprint2-fastapi-gemini-pedro`: Branch de trabalho das tarefas do Integrante 1.
   - `feat/sprint2-telemetry-routes-integrante2`: Branch de trabalho das tarefas do Integrante 2.
2. **Convenção de Commits:** Commits descritivos no padrão Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`), garantindo que ambos assinem commits técnicos individuais e commits de pareamento (`Co-authored-by`).
3. **Pull Requests Obrigatórios:** Nenhuma alteração entra na `main` sem PR aprovado pelo outro integrante da dupla após validação de build e testes.
