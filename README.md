# Vigia Escolar

Sistema web para organização pedagógica, controle de equipamentos e acompanhamento formativo no uso de dispositivos educacionais fornecidos pelo governo.

Projeto desenvolvido para a disciplina de **Desenvolvimento de Aplicações Web** (Engenharia de Computação — UTFPR) integrado ao projeto de extensão *"Desenvolvimento de Aplicações Web baseadas em Inteligência Artificial para Apoio de Professores da Educação Básica"*.

- **Integrante:** Pedro Lucas dos Reis Silva — RA 2272040
- **Tema:** 12 — *Segurança, controle e uso pedagógico dos dispositivos fornecidos pelo governo*
- **Repositório Git Público:** [https://github.com/plreis/PROJETO_FINAL_DEV_WEB](https://github.com/plreis/PROJETO_FINAL_DEV_WEB)
- **Demonstração Online (Sprint 1):** [https://plreis.github.io/PROJETO_FINAL_DEV_WEB/](https://plreis.github.io/PROJETO_FINAL_DEV_WEB/)

> **Nota sobre a composição da equipe:** Conforme registrado no planejamento acadêmico, o projeto está sendo executado individualmente por Pedro Lucas dos Reis Silva (RA 2272040), em virtude de alinhamento com a coordenação da disciplina para validação docente de exceção de dupla.

---

## 1. Descrição do Sistema

Vigia Escolar organiza o uso pedagógico de Chromebooks e tablets em escolas de educação básica.  
O professor abre uma sessão de aula e acompanha os dispositivos disponibilizados à turma.  
Durante a sessão, registra ocorrências de uso inadequado, acesso indevido ou risco à privacidade.  
O gestor consulta ocorrências e intervenções, com filtros e indicadores derivados dos registros.  
Cada ocorrência percorre um fluxo de análise, orientação e encerramento com decisão humana.  
A IA Gemini resume os registros selecionados e sugere intervenções educativas para revisão docente.  
A solução controla o acesso ao próprio sistema e minimiza a coleta de informações dos estudantes.  
O sistema não monitora navegação, câmera ou sistema operacional dos dispositivos; o acompanhamento depende de registro humano.

---

## 2. Cronograma de Desenvolvimento e Status das Sprints

| Sprint | Data Limite | Foco e Entregáveis | Status |
|---|---|---|:---:|
| **Sprint 1** | 04/11/2026 | Definição do sistema, equipe, Next.js funcional com mocks, componentes reutilizáveis, formulários com feedback, prevenção de conflito de alocação e exportação estática | **Concluída** |
| **Sprint 2** | 11/11/2026 | API FastAPI pública com `/docs`, schemas Pydantic, dados em memória e endpoint de orientação assistida via Google Gemini | *Planejada* |
| **Sprint 3** | 18/11/2026 | Integração Frontend-API em produção, autenticação JWT, expiração de tokens e remoção de mocks em produção | *Planejada* |
| **Sprint 4** | 25/11/2026 | Persistência com SQLModel + PostgreSQL Supabase, testes de reinício, manual do usuário (PDF) e documentação final (PDF/ZIP) | *Planejada* |

---

## 3. Arquitetura e Stack Tecnológica

- **Frontend:** [Next.js](https://nextjs.org/) (App Router com exportação estática `output: 'export'`), [TypeScript](https://www.typescriptlang.org/) e [Tailwind CSS](https://tailwindcss.com/).
- **Backend:** Python 3.11+ com [FastAPI](https://fastapi.tiangolo.com/), [Pydantic v2](https://docs.pydantic.dev/) e Uvicorn.
- **Banco de Dados (Sprint 4):** PostgreSQL hospedado (Supabase) via [SQLModel](https://sqlmodel.tiangolo.com/).
- **Autenticação (Sprint 3):** JWT com algoritmo HS256 e senhas protegidas com Argon2.
- **Inteligência Artificial (Sprint 2):** Google Gemini API chamada exclusivamente a partir do backend.

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
