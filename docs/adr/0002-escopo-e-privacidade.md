# ADR 0002 — Escopo das Sprints 3 e 4 e limites de privacidade

- **Status:** aceita
- **Data:** 18/11/2026
- **Substitui:** itens do plano de 04/11 (multitela, índice de desatenção, captura de tela e anexos de foto)

## Contexto

O tema 12 trata de dois problemas: uso dos Chromebooks e tablets fora da atividade (jogos, redes sociais, mesmo com o filtro da SEED) e uso da câmera para fotografar ou filmar colegas sem autorização. O próprio tema cita LGPD, ECA e ECA Digital (Lei 15.211/2025).

O plano de 04/11 previa capturar a tela do aluno (`getDisplayMedia`), anexar fotos como evidência, um painel multitela em tempo real e um índice percentual de desatenção da turma. Revisando contra o tema e contra o enunciado, esses itens têm dois problemas:

1. **Privacidade.** Guardar imagens de estudantes para provar uma ocorrência é justamente o tipo de registro de imagem que o tema aponta como risco. Também contradiz o README, que já dizia que o sistema não captura tela nem câmera.
2. **Prazo.** A Sprint 3 vai até 23/11 e a Sprint 4 até 30/11. O enunciado diz que funcionalidade pela metade não é pontuada e que escopo pequeno e completo vale mais.

## Decisão

Ficam no escopo:

- Sessão de aula com vínculo de dispositivos (quem estava com qual carrinho de aparelhos em qual aula).
- Inventário de dispositivos com estados disponível, em uso e manutenção.
- Ocorrências factuais com fluxo aberta → em análise → encerrada, e justificativa obrigatória no encerramento.
- Proteca Live: a API conta telemetria e ocorrências abertas da sessão e envia só esses números ao Gemini.
- Login com perfis professor e gestor.

Saem do escopo:

- Captura de tela, fotos ou qualquer anexo de imagem.
- Painel multitela em tempo real e índice de desatenção.
- Página do aluno com telemetria automática. A rota `/telemetry` continua na API, mas sem cliente automático nesta entrega.

Regras de dados:

- Nenhum nome ou identificador de estudante é cadastrado. A ocorrência aponta para o dispositivo e para a sessão.
- O Gemini recebe objetivo da aula e contagens. Não recebe descrições de ocorrências.
- A sugestão da IA nunca gera punição automática. Quem decide é o professor.

## Consequências

- O sistema não bloqueia sites. Ele complementa o filtro da SEED com registro, acompanhamento e mediação em sala, e isso precisa ficar claro no pitch.
- Os sinais do Live na prática vêm das ocorrências registradas pelo professor. A telemetria fica pronta para um cliente futuro.
