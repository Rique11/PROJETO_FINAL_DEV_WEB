# Registro de Decisões Técnicas e Metodológicas — Proteca

## 1. Composição da Equipe e Alinhamento Institucional
- **Configuração Inicial (Sprint 1):** Pedro Lucas dos Reis Silva (RA 2272040) executou o setup inicial e a Sprint 1 individualmente em virtude de número ímpar de alunos e indefinição de parcerias no início da aula.
- **Decisão Pós-Sprint 1:** A coordenação da disciplina estabeleceu formalmente a **obrigatoriedade estrita de duplas** para todas as equipes. O projeto Proteca passa a ser conduzido oficialmente pela dupla **Pedro Lucas dos Reis Silva (RA 2272040)** e **Henrique Cois Farjado Gau (RA 2369133)**.
- **Diretriz de Trabalho:** Conforme o regulamento da disciplina, ambos os membros atuam de forma equilibrada em todas as etapas (Frontend Next.js, Backend FastAPI, Inteligência Artificial Gemini, Banco SQLModel, Testes, Deploy e Documentação), com distribuição contínua de commits no repositório Git público.

---

## 2. Escolha do Tema 12
- **Tema:** 12 — Segurança, controle e uso pedagógico dos dispositivos fornecidos pelo governo.
- **Justificativa:** Problema de alta relevância pedagógica nas escolas públicas brasileiras decorrente das remessas em massa de Chromebooks e tablets educacionais, onde a gestão em sala de aula precisa de soluções que priorizem a mediação pedagógica sem recorrer a vigilância invasiva contra menores.

---

## 3. Arquitetura da Stack Tecnológica
- **Decisão:** Frontend Next.js 15 (App Router, estático na Sprint 1), Backend FastAPI Python, Banco PostgreSQL hospedado (Supabase) via SQLModel na Sprint 4, Autenticação JWT na Sprint 3 e IA Google Gemini exclusivamente no backend a partir da Sprint 2.
- **Nota sobre a linguagem única:** O enunciado continha uma menção genérica a "todo o sistema em uma única linguagem, Java ou Python", porém detalhava especificamente a stack obrigatória: Next.js + FastAPI + SQLModel + JWT. Optou-se por seguir a stack detalhada da disciplina, mantendo o frontend e o backend desacoplados.

---

## 4. Política de Publicação e Controle de Artefatos
- **Decisão:** O repositório público `https://github.com/plreis/PROJETO_FINAL_DEV_WEB` e a entrega contêm estritamente os arquivos técnicos necessários para execução (`frontend/`, `backend/`, `README.md`, `.gitignore`, licença e workflows).
- **Artefatos Locais:** Prompts operacionais, roteiros internos, minutas do fórum e status de entrega são mantidos no diretório local `DevWeb/PROJETO_FINAL_A3/` e não integram o repositório público.

---

## 5. Decisões Arquiteturais para as Demandas Levantadas em Aula

Durante o uso da Sprint 1 e os alinhamentos presenciais, foram analisadas e decididas três questões centrais de engenharia e produto:

### 5.1. Problema 1: Monitoramento dos PCs em Tempo Real — Tecnologia e Viabilidade
- **Análise do Problema:** Como acompanhar os computadores/tablets dos alunos em sala com alta fidedignidade sem depender de instalação de programas locais nos Chromebooks governamentais (que possuem travas de superadministrador/MDM e restrições legais)?
- **Decisão Técnica:** Adoção de arquitetura **Web Standards Client-Side (Sessão Web do Aluno)**:
  1. *Sem agentes nativos invasivos:* Instalar binários de monitoramento no SO dos alunos violaria as políticas de segurança escolar do Estado e o artigo 14 da LGPD (proteção integral a menores).
  2. *Telemetria via Navegador Institucional:* O aluno ingressa na aula pelo navegador acessando a rota `/aula/{sessionId}`.
  3. *Page Visibility API:* A aplicação utiliza nativamente `document.visibilitychange` e eventos `window.onblur`/`window.onfocus`. Quando o estudante minimiza a janela pedagógica ou alterna para outra aba (ex: jogos, vídeos, redes sociais), o cliente web dispara imediatamente um evento de telemetria `PERDA_DE_FOCO`.
  4. *Heartbeat Leve:* Envio periódico de pulso (a cada 10s) via WebSocket ou Polling curto para confirmar que o dispositivo continua conectado e ativo na aula.

### 5.2. Problema 2: Comprovação Factual, Índice de Desatenção e Alertas de Segurança
- **Comprovação com Captura Factual (Prints):**
  - O sistema oferece duas modalidades éticas de comprovação:
    a) *Captura assistida pelo navegador:* Utilização da WebRTC Screen Capture API (`navigator.mediaDevices.getDisplayMedia`), na qual a aba do aluno compartilha o stream com a aula com consentimento transparente, permitindo registrar snapshot no instante de um desvio;
    b) *Anexo factual pelo professor:* O professor pode carregar no formulário da ocorrência uma fotografia/evidência factual presenciada em sala de aula (ex: uso indevido de smartphone, gravação indevida).
  - *Salvaguarda:* O sistema não grava áudio ou vídeo contínuos e armazena apenas snapshots pontuais diretamente atrelados ao registro de ocorrência, sanitizando metadados.
- **Índice de Desatenção da Turma:**
  - Métrica quantitativa agregada calculada pelo backend para apoiar a regulação pedagógica da aula:
    $$\text{Índice} = \min\left(100, \, \left(\frac{\sum T_{\text{desfocado}}}{N_{\text{dispositivos}} \times T_{\text{aula}}} \times 65\right) + \left(\frac{\text{Ocorrências}}{\text{Dispositivos}} \times 35\right)\right)$$
  - Fornece feedback visual em três faixas semânticas (Verde: foco alto; Amarelo: dispersão moderada; Vermelho: desvio crítico).
- **Alertas de Segurança e Risco:**
  - Gatilhos automáticos para desatenção contínua prolongada (> 3 min fora da aba) e alertas categorizados de risco à privacidade (ex: compartilhamento de imagens de colegas, tentativa de burlar a sessão).

### 5.3. Problema 3: Dashboard Multitela, Visão Individual e Síntese de IA
- **Dashboard Multitela (Grid da Sala):** Painel do professor estruturado em mosaico de cards correspondentes a cada Chromebook do carrinho (CB-01 a CB-30). Cada card exibe o estado em tempo real: *Conectado*, *Em Foco*, *Em Segundo Plano*, ou *Alerta Emitido*, permitindo abertura rápida de ocorrência com 1 clique.
- **Visão Individual:** Página/modal de detalhe do equipamento contendo linha do tempo cronológica com todos os eventos e ocorrências da sessão.
- **Síntese Assistida com Google Gemini:**
  - O professor clica em *"Sugerir Orientação Pedagógica"*.
  - A API FastAPI compila o resumo da sessão (duração, objetivo, taxa de foco, ocorrências agrupadas por categoria) sem identificadores pessoais.
  - O Gemini gera uma análise formativa orientada a metodologias ativas:
    1) Leitura diagnóstica do ritmo da aula;
    2) Identificação de gargalos de interesse;
    3) Sugestões práticas de mediação presencial;
    4) Orientações preventivas para a coordenação pedagógica.
