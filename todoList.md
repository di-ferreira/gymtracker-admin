# GymTracker Admin — Todo List

## Fase 1 — Setup do Projeto
- [x] Inicializar Next.js 15 + React 19 + TypeScript com TailwindCSS
- [x] Configurar Shadcn UI com tema customizado dark
- [x] Estruturar pastas feature-based
- [x] Configurar Axios client + interceptors
- [x] Configurar TanStack Query Provider no layout root
- [x] Configurar React Hook Form + Zod (schemas base)
- [x] Configurar ESLint + Prettier

## Fase 2 — Design System & Tokens
- [x] Extrair tokens do `design-system/` (cores, tipografia, spacing, radius, shadows, motion)
- [x] Implementar `globals.css` com variáveis CSS do tema dark GymTracker
- [x] Build de componentes base do Shadcn:
  - Button, Input, Textarea, Select, Card, Table
  - Dialog, Drawer, Sheet
  - Tabs, Badge
  - Sonner (Toast)
  - Skeleton, Separator
  - Dropdown Menu, Avatar, Tooltip
- [x] Implementar layout shell:
  - Sidebar com navegação por seções
  - Topbar
  - DashboardLayout wrapper
  - Toaster + TooltipProvider no root layout

## Fase 3 — Infraestrutura de Dados
- [ ] Criar types/entities adicionais (`ApiResponse<T>`, `PaginatedResponse<T>`)
- [ ] Criar schemas Zod para cada formulário:
  - `exerciseSchema`, `equipmentSchema`, `muscleGroupSchema`, `movementGroupSchema`
- [ ] Criar service layer (Axios):
  - `services/exercise.service.ts`
  - `services/equipment.service.ts`
  - `services/muscle-group.service.ts`
  - `services/movement-group.service.ts`
  - `services/media.service.ts`
  - `services/substitution.service.ts`
- [ ] Criar factories TanStack Query:
  - `useList`, `useGet`, `useCreate`, `useUpdate`, `useDelete` para cada entidade

## Fase 4 — CRUD de Exercícios
- [ ] Página **Exercise List** (`/exercises`):
  - Tabela com colunas: nome, dificuldade, grupo muscular, equipamentos
  - Search por nome
  - Filtros (dificuldade, grupo muscular)
  - Paginação
- [ ] Página **Create Exercise** (`/exercises/new`):
  - Formulário: nome, slug (auto-gerado), descrição, dicas, dificuldade
  - Selectores: equipamento (múltiplo), grupo muscular, grupo de movimento
  - Upload de mídia: thumbnail, imagem, GIF, vídeo
  - Step builder: adicionar/remover/reordenar instruções
  - Validação Zod + feedback visual
- [ ] Página **Edit Exercise** (`/exercises/[id]/edit`)
- [ ] Página **Exercise Detail** (`/exercises/[id]`)
- [ ] Modal de delete com confirmação

## Fase 5 — CRUD de Entidades de Suporte
- [ ] **Equipamentos** (`/equipment`):
  - Lista, Create, Edit, Delete
  - Campos: nome, slug, ícone
- [ ] **Grupos Musculares** (`/muscle-groups`):
  - Lista, Create, Edit, Delete
  - Campos: nome, slug, descrição
- [ ] **Grupos de Movimento** (`/movement-groups`):
  - Lista, Create, Edit, Delete
  - Campos: nome, slug, descrição

## Fase 6 — Relacionamentos & Mídias
- [ ] Página **Alternative Exercises** (`/alternatives`):
  - Selecionar exercício principal
  - Adicionar/remover substituições (relação n:n)
  - Visualização em tabela ou chips
- [ ] Página **Media Library** (`/media`):
  - Grid de mídias com preview
  - Upload bulk
  - Filtro por tipo (GIF, vídeo, imagem)
- [ ] Modal de preview de mídia (zoom, metadados)

## Fase 7 — Dashboard
- [ ] Página **Dashboard** (`/`):
  - Cards de métricas
  - Feed de atividade recente
  - Estado vazio quando sem dados

## Fase 8 — Versionamento & Publicação
- [ ] Página/section de **Catalog Version**:
  - Exibir versão atual do catálogo
  - Botão "Publicar nova versão"
  - Validações pré-publicação
  - Incremento semântico (major/minor/patch)
- [ ] Histórico de versões publicadas

## Fase 9 — Polimento Final
- [ ] Traduzir mensagens de validação Zod para português
- [ ] Tratamento global de erros da API com toasts
- [ ] Estados de loading/skeleton em todas as páginas
- [ ] Empty states personalizados por entidade
- [ ] Responsividade tablet (layout adaptativo)
- [ ] Testes unitários (Vitest + Testing Library)
- [ ] Testes de integração (Playwright ou Cypress)
- [ ] Acessibilidade: focus visible, aria labels, headings hierarchy
