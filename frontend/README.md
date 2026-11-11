# Proteca — Frontend (Next.js)

Interface de acompanhamento pedagógico e gestão de dispositivos educacionais desenvolvida em **Next.js (App Router)** com **TypeScript** e **Tailwind CSS**.

> **Status da Sprint 1:** Interface funcional completa com dados mockados em memória (`mockService`), componentes modulares reutilizáveis, gerenciamento de estado via Context API, formulário com validações acessíveis, prevenção de conflitos de alocação de equipamentos e exportação estática (`output: 'export'`).

---

## 1. Estrutura de Diretórios

```
frontend/
├── src/
│   ├── app/                    # Rotas do Next.js App Router
│   │   ├── page.tsx            # Painel Geral / Dashboard
│   │   ├── sessoes/            # Listagem, abertura e detalhe de sessões
│   │   ├── ocorrencias/        # Listagem e formulário de ocorrências
│   │   ├── dispositivos/       # Inventário de equipamentos
│   │   └── not-found.tsx       # Tratamento de página 404
│   ├── components/             # Componentes de UI reutilizáveis (Shell, Badges, Modais, etc.)
│   ├── context/                # Contexto global de estado (SchoolContext)
│   ├── data/                   # Fixtures sintéticas de demonstração
│   ├── features/               # Módulos de domínio (incidents, sessions)
│   ├── services/               # Contratos e mockService
│   └── types/                  # Definições de tipo TypeScript
├── next.config.ts              # Configuração com suporte a exportação estática
├── tailwind.config.ts          # Tokens de design do projeto
└── README.md
```

---

## 2. Requisitos de Ambiente

- Node.js 18+ (testado na v25.3.0)
- npm 9+

---

## 3. Execução em Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 4. Build e Exportação Estática

```bash
# Compilar e gerar pasta estática out/
npm run build
```

A saída estática gerada na pasta `out/` pode ser servida por qualquer servidor HTTP estático ou hospedada no GitHub Pages:

```bash
npx serve out
```
