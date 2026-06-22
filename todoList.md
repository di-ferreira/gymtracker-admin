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
- [x] Criar types/entities adicionais (`ApiResponse<T>`, `PaginatedResponse<T>`)
- [x] Criar schemas Zod para cada formulário:
  - `exerciseSchema`, `equipmentSchema`, `muscleGroupSchema`, `movementGroupSchema`, `substitutionSchema`
- [x] Criar service layer (Axios):
  - `services/base.ts` — factory `createService` com list/get/create/update/remove
  - `services/exercise.service.ts`
  - `services/equipment.service.ts`
  - `services/muscle-group.service.ts`
  - `services/movement-group.service.ts`
  - `services/media.service.ts`
  - `services/substitution.service.ts`
- [x] Criar factories TanStack Query:
  - `hooks/use-crud.ts` — factory `createCrudHooks`
  - `hooks/use-exercises.ts`
  - `hooks/use-equipment.ts`
  - `hooks/use-muscle-groups.ts`
  - `hooks/use-movement-groups.ts`

## Fase 4 — CRUD de Exercícios
- [x] Página **Exercise List** (`/exercises`):
  - Tabela com colunas: nome, dificuldade, grupo muscular, equipamentos
  - Search por nome
  - Paginação
- [x] Página **Create Exercise** (`/exercises/new`):
  - Formulário: nome, slug (auto-gerado), descrição, dicas, dificuldade
  - Selectores: equipamento (múltiplo), grupo muscular, grupo de movimento
  - Mídias: thumbnail, imagem, GIF, vídeo (URLs)
  - Step builder: adicionar/remover/reordenar instruções
  - Validação Zod + feedback visual
- [x] Página **Edit Exercise** (`/exercises/[id]/edit`)
- [x] Página **Exercise Detail** (`/exercises/[id]`)
- [x] Modal de delete com confirmação

## Fase 5 — CRUD de Entidades de Suporte
- [x] **Equipamentos** (`/equipment`):
  - Lista, Create, Edit, Delete (diálogos inline)
- [x] **Grupos Musculares** (`/muscle-groups`):
  - Lista, Create, Edit, Delete (diálogos inline)
- [x] **Grupos de Movimento** (`/movement-groups`):
  - Lista, Create, Edit, Delete (diálogos inline)

## Fase 6 — Relacionamentos & Mídias
- [x] Página **Alternative Exercises** (`/alternatives`):
  - Selecionar exercício principal (sidebar com search)
  - Adicionar/remover substituições (relação n:n)
  - Visualização em cards com motivo
- [x] Página **Media Library** (`/media`):
  - Grid de mídias com preview
  - Upload de arquivo com detecção automática de tipo
  - Filtro por tipo (imagem, GIF, vídeo)
- [x] Modal de preview de mídia (imagem/vídeo em tela cheia)

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
