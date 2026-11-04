import { Classroom, Device, Incident, LessonSession } from '@/types';

export const INITIAL_SCHOOL = {
  id: 'sch-01',
  name: 'Escola Municipal Alberto Santos Dumont',
  city: 'Curitiba - PR',
};

export const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'cls-7a',
    schoolId: 'sch-01',
    name: '7º Ano A — Manhã',
    grade: '7º Ano',
  },
  {
    id: 'cls-8b',
    schoolId: 'sch-01',
    name: '8º Ano B — Tarde',
    grade: '8º Ano',
  },
];

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'dev-01',
    schoolId: 'sch-01',
    patrimonio: 'DEV-CR-0101',
    type: 'chromebook',
    model: 'Lenovo 300e Chromebook Gen 3',
    status: 'em_uso',
  },
  {
    id: 'dev-02',
    schoolId: 'sch-01',
    patrimonio: 'DEV-CR-0102',
    type: 'chromebook',
    model: 'Lenovo 300e Chromebook Gen 3',
    status: 'em_uso',
  },
  {
    id: 'dev-03',
    schoolId: 'sch-01',
    patrimonio: 'DEV-TB-0201',
    type: 'tablet',
    model: 'Samsung Galaxy Tab A9+ Educação',
    status: 'disponivel',
  },
  {
    id: 'dev-04',
    schoolId: 'sch-01',
    patrimonio: 'DEV-TB-0202',
    type: 'tablet',
    model: 'Samsung Galaxy Tab A9+ Educação',
    status: 'disponivel',
  },
  {
    id: 'dev-05',
    schoolId: 'sch-01',
    patrimonio: 'DEV-NB-0301',
    type: 'notebook',
    model: 'Positivo Master N1250 Educacional',
    status: 'manutencao',
  },
  {
    id: 'dev-06',
    schoolId: 'sch-01',
    patrimonio: 'DEV-CR-0103',
    type: 'chromebook',
    model: 'Lenovo 300e Chromebook Gen 3',
    status: 'disponivel',
  },
];

export const INITIAL_SESSIONS: LessonSession[] = [
  {
    id: 'sess-01',
    schoolId: 'sch-01',
    classroomId: 'cls-7a',
    teacherName: 'Prof. Carlos Eduardo',
    objective: 'Pesquisa orientada de Geografia: Biomas Brasileiros e conservação ambiental',
    status: 'aberta',
    startedAt: '2026-11-04T10:15:00Z',
    allocatedDeviceIds: ['dev-01', 'dev-02'],
    actionLog: [
      {
        id: 'log-01',
        timestamp: '2026-11-04T10:15:00Z',
        action: 'Sessão aberta',
        author: 'Prof. Carlos Eduardo',
        note: 'Início da atividade com verificação inicial dos aparelhos.',
      },
      {
        id: 'log-02',
        timestamp: '2026-11-04T10:16:00Z',
        action: 'Dispositivos vinculados',
        author: 'Prof. Carlos Eduardo',
        note: 'Alocados DEV-CR-0101 e DEV-CR-0102 para duplas de trabalho.',
      },
    ],
  },
  {
    id: 'sess-02',
    schoolId: 'sch-01',
    classroomId: 'cls-8b',
    teacherName: 'Profa. Mariana Silveira',
    objective: 'Laboratório de Redação: Produção textual dissertativa orientada',
    status: 'encerrada',
    startedAt: '2026-11-03T14:00:00Z',
    endedAt: '2026-11-03T15:40:00Z',
    allocatedDeviceIds: [],
    closingJustification:
      'Aula concluída sem intercorrências graves pendentes; equipamentos conferidos no carrinho de recarga.',
    actionLog: [
      {
        id: 'log-03',
        timestamp: '2026-11-03T14:00:00Z',
        action: 'Sessão aberta',
        author: 'Profa. Mariana Silveira',
        note: 'Sessão iniciada na sala multimídia.',
      },
      {
        id: 'log-04',
        timestamp: '2026-11-03T15:40:00Z',
        action: 'Sessão encerrada',
        author: 'Profa. Mariana Silveira',
        note: 'Justificativa registrada e aparelhos liberados.',
      },
    ],
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-01',
    schoolId: 'sch-01',
    sessionId: 'sess-01',
    deviceId: 'dev-01',
    category: 'uso_nao_pedagogico',
    description:
      'Aluno alternando repetidamente entre aba da pesquisa de Geografia e aba de jogo online de navegador.',
    status: 'aberta',
    createdAt: '2026-11-04T10:35:00Z',
    actions: [
      {
        id: 'act-01',
        timestamp: '2026-11-04T10:35:00Z',
        action: 'Ocorrência registrada',
        author: 'Prof. Carlos Eduardo',
        note: 'Identificado durante circulação pedagógica em sala.',
      },
    ],
  },
  {
    id: 'inc-02',
    schoolId: 'sch-01',
    sessionId: 'sess-01',
    deviceId: 'dev-02',
    category: 'privacidade_exposicao',
    description:
      'Tentativa de abertura do aplicativo de câmera para registrar imagem de colegas de classe sem autorização pedagógica.',
    status: 'em_analise',
    createdAt: '2026-11-04T10:48:00Z',
    actions: [
      {
        id: 'act-02',
        timestamp: '2026-11-04T10:48:00Z',
        action: 'Ocorrência registrada',
        author: 'Prof. Carlos Eduardo',
        note: 'Aparelho retido preventivamente para diálogo com a dupla.',
      },
      {
        id: 'act-03',
        timestamp: '2026-11-04T10:55:00Z',
        action: 'Transição para Em Análise',
        author: 'Prof. Carlos Eduardo',
        note: 'Diálogo inicial realizado com reforço sobre privacidade escolar.',
      },
    ],
  },
  {
    id: 'inc-03',
    schoolId: 'sch-01',
    sessionId: 'sess-01',
    category: 'desvio_foco',
    description:
      'Dois estudantes compartilhando fones de ouvido e assistindo a vídeos de streaming desconectados do tema da aula.',
    status: 'aberta',
    createdAt: '2026-11-04T11:02:00Z',
    actions: [
      {
        id: 'act-04',
        timestamp: '2026-11-04T11:02:00Z',
        action: 'Ocorrência registrada',
        author: 'Prof. Carlos Eduardo',
        note: 'Aviso verbal realizado.',
      },
    ],
  },
  {
    id: 'inc-04',
    schoolId: 'sch-01',
    sessionId: 'sess-02',
    category: 'acesso_indevido',
    description: 'Tentativa de desativação do filtro DNS para acesso a fórum de jogos eletrônicos.',
    status: 'encerrada',
    createdAt: '2026-11-03T14:25:00Z',
    updatedAt: '2026-11-03T15:15:00Z',
    closingJustification:
      'Equipamento reiniciado em presença da coordenação e estudante orientado pedagogicamente com registro na ata da turma.',
    actions: [
      {
        id: 'act-05',
        timestamp: '2026-11-03T14:25:00Z',
        action: 'Ocorrência registrada',
        author: 'Profa. Mariana Silveira',
        note: 'Detecção visual pelo professor.',
      },
      {
        id: 'act-06',
        timestamp: '2026-11-03T15:15:00Z',
        action: 'Ocorrência encerrada',
        author: 'Profa. Mariana Silveira',
        note: 'Conclusão pedagógica com mediação do gestor.',
      },
    ],
  },
  {
    id: 'inc-05',
    schoolId: 'sch-01',
    sessionId: 'sess-02',
    deviceId: 'dev-01',
    category: 'dano_fisico_equipamento',
    description: "Teclado do Chromebook com tecla 'Espaço' travada por pressão excessiva durante atividade.",
    status: 'encerrada',
    createdAt: '2026-11-03T14:40:00Z',
    updatedAt: '2026-11-03T15:30:00Z',
    closingJustification:
      'Dispositivo encaminhado à assistência técnica interna da escola e substituído na atividade.',
    actions: [
      {
        id: 'act-07',
        timestamp: '2026-11-03T14:40:00Z',
        action: 'Ocorrência registrada',
        author: 'Profa. Mariana Silveira',
        note: 'Avaria mecânica informada.',
      },
      {
        id: 'act-08',
        timestamp: '2026-11-03T15:30:00Z',
        action: 'Ocorrência encerrada',
        author: 'Profa. Mariana Silveira',
        note: 'Equipamento isolado no setor técnico.',
      },
    ],
  },
  {
    id: 'inc-06',
    schoolId: 'sch-01',
    sessionId: 'sess-01',
    deviceId: 'dev-02',
    category: 'acesso_indevido',
    description:
      'Busca de termos impróprios em motor de busca com tentativa de burlar safe search durante a pesquisa de imagens.',
    status: 'aberta',
    createdAt: '2026-11-04T11:10:00Z',
    actions: [
      {
        id: 'act-09',
        timestamp: '2026-11-04T11:10:00Z',
        action: 'Ocorrência registrada',
        author: 'Prof. Carlos Eduardo',
        note: 'Intervenção imediata com fechamento das guias.',
      },
    ],
  },
];
