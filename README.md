# GymTracker Admin

Painel administrativo para gerenciamento do catálogo de exercícios do GymTracker.

## Stack

- **Framework:** Next.js 16.2.9 (App Router)
- **Linguagem:** TypeScript
- **UI:** TailwindCSS v4 + Shadcn UI (Base UI)
- **Formulários:** react-hook-form + Zod v4
- **Requisições:** Axios + TanStack Query
- **Testes:** Playwright (integração com mocks)

## Funcionalidades

| Página | Descrição |
|--------|-----------|
| **Dashboard** | Métricas em tempo real (exercícios, equipamentos, grupos, substituições) |
| **Exercícios** | CRUD com busca, paginação, step builder de instruções, vínculo multi-equipamento |
| **Equipamentos** | CRUD inline com diálogos |
| **Grupos Musculares** | CRUD inline com diálogos |
| **Grupos de Movimento** | CRUD inline com diálogos |
| **Substituições** | Gerenciar exercícios alternativos por grupo muscular |
| **Mídia** | Biblioteca com grid, filtro por tipo, preview modal |
| **Versão do Catálogo** | Publicação com bump semântico (major/minor) e histórico |

## Começando

```bash
# instalar dependências
npm install

# configurar variável de ambiente
cp .env.example .env.local

# iniciar dev server
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura

```
src/
├── app/          # Rotas (App Router)
├── components/   # Componentes compartilhados (Sidebar, Topbar, Layout)
├── features/     # Módulos por domínio
├── hooks/        # Custom hooks (CRUD factory)
├── lib/          # Axios client, schemas Zod, providers
├── services/     # Camada de API (factory + serviços por entidade)
└── types/        # Interfaces TypeScript
```

## Testes

```bash
# executar todos os testes (inicia dev server automaticamente)
npx playwright test

# modo UI interativo
npx playwright test --ui

# relatório HTML
npx playwright show-report
```

Os testes usam `page.route()` para mockar a API — não dependem de backend.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server |
| `npm run build` | Build de produção |
| `npm run lint` | Lint (ESLint + Next) |
| `npx playwright test` | Testes de integração |
