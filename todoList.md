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
- [x] Página **Dashboard** (`/`):
  - Cards de métricas com dados reais da API (total exercises, muscle groups, equipment, substitutions)
  - Loading skeleton
  - Estado vazio quando sem dados

## Fase 8 — Versionamento & Publicação
- [x] Página **Catalog Version** (`/catalog-version`):
  - Exibir versão atual do catálogo
  - Botão "Publicar nova versão" com diálogo
  - Validações pré-publicação
  - Incremento semântico (major/minor)
  - Histórico de versões publicadas

## Fase 9 — Polimento Final
- [x] Traduzir mensagens de validação Zod para português
- [x] Tratamento global de erros da API com toasts (interceptor Axios)
- [x] Estados de loading/skeleton em todas as páginas
- [x] Empty states personalizados por entidade
- [x] Responsividade: sidebar colapsável em mobile com overlay
- [x] Acessibilidade: aria-labels, heading hierarchy, focus visible

## Fase 11 — Sistema de Login (Admin)
- [x] Instalar js-cookie e @types/js-cookie
- [x] Criar auth service (login, me)
- [x] Criar AuthContext (cookie token, user state, login/logout)
- [x] Criar /login com formulário + validação de admin
- [x] Criar proxy.ts (proteção de rotas via cookie — Next.js 16)
- [x] Atualizar Axios interceptor para usar cookie (js-cookie)
- [x] Atualizar Topbar (nome real + Sair)
- [x] Adicionar "Sair" no sidebar
- [x] Wrap root layout com AuthProvider

## Fase 12 — Integração com API Real
- [ ] Ajustar tipos (slug opcional Equipment/MuscleGroup/MovementGroup)
- [ ] Remover campos não aceitos dos schemas Zod
- [ ] Ajustar formulários criar/editar exercício
- [ ] Exibir IDs em vez de nomes aninhados no detalhe
- [ ] Transformar página de mídia em upload-only
- [ ] Verificar endpoints substituições e versão
- [ ] Testar CRUD completo com API rodando

## Fase 10 — Testes de Integração (mockados)
- [x] Configurar Playwright + chromium
- [x] Mock API com `page.route()` — dados de exemplo em `e2e/mocks.ts`
- [x] Teste: dashboard carrega com métricas, skeleton e empty state
- [x] Teste: navegação entre todas as rotas via sidebar + sidebar mobile
- [x] Teste: CRUD de exercício (criar, editar, excluir, validação, busca, skeleton, empty)
- [x] Teste: CRUD de equipamento (criar, excluir)
- [x] Teste: CRUD de grupo muscular (criar)
- [x] Teste: CRUD de grupo de movimento (criar)
- [x] Teste: adicionar/remover substituição
- [x] Teste: mídia (grid, filtro tipo, preview modal)
- [x] Teste: versão do catálogo (exibir, diálogo publicar)
