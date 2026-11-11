# Status de Desenvolvimento e Entregas — Proteca

## 1. Identificação Geral
- **Sistema:** Proteca
- **Tema:** 12 — Segurança, controle e uso pedagógico dos dispositivos fornecidos pelo governo
- **Equipe (Dupla):** Pedro Lucas dos Reis Silva (RA 2272040) e Henrique Cois Farjado Gau (RA 2369133)
- **Repositório Público no GitHub:** https://github.com/plreis/PROJETO_FINAL_DEV_WEB
- **Demonstração Estática Online:** https://plreis.github.io/PROJETO_FINAL_DEV_WEB/
- **Data da Última Atualização:** 04/11/2026 (Pós-Review da Sprint 1)

---

## 2. Matriz de Situação dos Entregáveis — Sprint 1 (Concluída)

| Item | Status | Responsável | Evidência / Observações |
|---|:---:|:---:|---|
| **Repositório Público Criado** | **Concluído** | Dupla / plreis | `https://github.com/plreis/PROJETO_FINAL_DEV_WEB` |
| **README.md do Repositório** | **Concluído** | Dupla | Descrição, equipe, tema 12, stack, comandos e tabela de sprints |
| **Frontend Next.js com Mocks** | **Concluído** | Dupla | Dashboard, Sessões, Detalhes, Nova Sessão, Ocorrências e Dispositivos |
| **Exportação Estática Next.js** | **Concluído** | Dupla | `output: 'export'` validado; pasta `out/` com 12 páginas estáticas |
| **GitHub Actions / Pages** | **Concluído** | Dupla | Workflow `.github/workflows/deploy.yml` operacional com subpath |
| **Scaffold Backend FastAPI** | **Concluído** | Dupla | `backend/app/`, schemas tipados, rota `/health` e testes passando |
| **Review Presencial Sprint 1** | **Concluído** | Pedro | Apresentação em aula (pitch presencial 5 min) |
| **Formalização da Dupla** | **Alinhado** | Dupla / Docente | Regra docente pós-Sprint 1 de obrigatoriedade de duplas atendida |

---

## 3. Planejamento Operacional — Sprint 2 (Entrega: 11/11/2026)

| Item da Sprint 2 | Responsável Primário | Co-Responsável | Status |
|---|:---:|:---:|:---:|
| **Configuração FastAPI & CORS Modular** | Pedro Lucas | Henrique | **Concluído** |
| **Serviço de IA Google Gemini (REST seguro + fallback)** | Pedro Lucas | Henrique | **Concluído** |
| **Schemas Pydantic de Entrada e Saída IA** | Pedro Lucas | Henrique | **Concluído** |
| **Repositório de Dados em Memória** | Henrique | Pedro Lucas | *Em Andamento* |
| **Roteadores de Negócio (/sessions, /devices, /incidents)** | Henrique | Pedro Lucas | *Planejado* |
| **Módulo de Telemetria e Eventos (/telemetry)** | Henrique | Pedro Lucas | **Concluído na base integrada** |
| **Contexto educacional Wikipedia/Open Library** | Pedro Lucas | Henrique | **Concluído** |
| **Interface Proteca Live com motion acessível** | Pedro Lucas | Henrique | **Concluído** |
| **Deploy da API em Nuvem (HTTPS público)** | Pedro Lucas | Henrique | *Planejado* |
| **Testes Automatizados (IA e Rotas)** | Pedro Lucas | Henrique | **Concluído para Live e contexto** |
| **Validação da Documentação Swagger (/docs)** | Henrique | Pedro Lucas | *Planejado* |
