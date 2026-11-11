# Roteiro para a Review da Sprint 1 (Pitch de 5 Minutos)

**Formato:** Presencial, estilo Daily do Scrum / Pitch Direto (sem slides, direto no navegador).  
**Apresentador:** Pedro Lucas dos Reis Silva (RA 2272040)  
**Tema:** 12 — Segurança, controle e uso pedagógico dos dispositivos fornecidos pelo governo  
**URL:** https://plreis.github.io/PROJETO_FINAL_DEV_WEB/

---

## 1. Problema e Proposta (1 minuto)
- **Problema concreto:** Escolas públicas receberam centenas de Chromebooks e tablets. Em sala de aula, professores enfrentam desvios de foco (jogos online, redes sociais) e riscos à privacidade (gravações de colegas sem autorização), mas não dispõem de ferramentas pedagógicas para organizar o uso desses equipamentos durante a aula.
- **Nossa solução (Proteca):** Uma aplicação web leve que permite ao professor abrir a sessão de aula, alocar equipamentos disponíveis por patrimônio, registrar ocorrências factuais em tempo real e encaminhar intervenções educativas com apoio assistido de IA na síntese pedagógica.
- **Diferencial ético:** O sistema **não** instala agentes invasivos nos aparelhos dos alunos nem monitora telas ou câmeras; o controle é fundamentado em acompanhamento presencial docente e mediação pedagógica.

---

## 2. Demonstração do Fluxo no Navegador (2 minutos e meio)
1. **Painel Geral (Dashboard):**
   - Mostrar os indicadores: Sessões ativas, ocorrências abertas demandando mediação, dispositivos em uso vs. disponíveis.
2. **Abertura de Sessão (`/sessoes/nova`):**
   - Demonstrar a seleção da turma e objetivo pedagógico obrigatório.
   - Mostrar a regra de negócio: equipamentos que já estão em uso ou em manutenção aparecem bloqueados, impedindo dupla alocação no carrinho.
3. **Registro de Ocorrência com Validação:**
   - Preencher o formulário de ocorrência: selecionar a categoria (ex: *Uso Não Pedagógico* ou *Risco de Privacidade*), vincular ao aparelho da aula.
   - Demonstrar o feedback de validação acessível (`aria-describedby` e mínimo de caracteres).
   - Salvar e mostrar a atualização imediata no estado da aplicação sem recarregar a tela.
4. **Ciclo de Vida da Ocorrência e Encerramento:**
   - Mudar ocorrência de *Aberta* para *Em Análise* e depois *Encerrada* com justificativa obrigatória.
   - Encerrar a sessão de aula com justificativa pedagógica, liberando os aparelhos de volta ao status *Disponível*.
5. **Seção de Orientação Assistida com IA (Demonstração):**
   - Mostrar o card Proteca Live, informando se a resposta veio do Gemini ou do fallback local.
   - Clicar em "Gerar Sugestão Demonstrativa" e explicar como o Google Gemini atuará na Sprint 2 para sugerir intervenções educativas humanizadas baseadas no conjunto de registros.

---

## 3. Arquitetura, Tecnologias e Exportação (1 minuto)
- **Frontend:** Next.js 15 com App Router, TypeScript e Tailwind CSS. Componentes próprios reutilizáveis (`AppShell`, `StatusBadge`, `FilterBar`, `FieldError`, `Modal`, `IncidentForm`).
- **Exportação Estática:** Configurado com `output: 'export'` e hospedado publicamente via GitHub Pages.
- **Backend (Scaffold para Sprint 2):** Estrutura inicial em Python/FastAPI pronta com schemas Pydantic e rota de saúde (`/api/v1/health`), preparando a integração do SDK oficial do Gemini.

---

## 4. O que Ficou Bloqueado e Próximos Passos (30 segundos)
- **Bloqueios / Alinhamentos:** Confirmação formal da exceção de execução individual junto ao professor.
- **Próximos passos (Sprint 2 — até 11/11):**
  - Hospedar a API FastAPI em plataforma gratuita.
  - Implementar o endpoint de negócio e conectar a chamada real à API do Google Gemini com saída estruturada Pydantic.
