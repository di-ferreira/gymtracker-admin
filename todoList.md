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

## Fase 13 — Gestão de Usuários

- [x] Criar user service (GET /admin/users/, PATCH /admin/users/{id})
- [x] Criar user hooks (useUserList, useUpdateUser)
- [x] Página /users: tabela com nome, email, função, status
- [x] Diálogo inline de edição (nome, role, is_active)
- [x] Schema Zod userEditSchema
- [x] Adicionar "Usuários" no sidebar (seção Sistema)
- [x] Testes Playwright (listar, editar nome, alternar status)
- [x] Instalar componente Switch do Shadcn

## Fase 12 — Integração com API Real

- [x] Ajustar tipos (slug opcional Equipment/MuscleGroup/MovementGroup)
- [x] Remover campos não aceitos dos schemas Zod (exerciseSchema: equipment_ids, instructions, target_muscle_primary)
- [x] Ajustar formulários criar/editar exercício (remove step builder, equipment multi-select)
- [x] Buscar nomes via lookup maps para exibir muscle_group/movement_group no list e detail
- [x] Transformar página de mídia em upload-only (API não tem endpoint de listagem)
- [x] Verificar endpoints: substituições e versão não existem na API — páginas mantidas com empty state
- [x] Atualizar rotas de substituições para nested /exercises/{id}/alternatives/
- [x] Adicionar setupAuth helper (cookie gymtracker_token + mock /auth/me) nos testes
- [x] Corrigir mocks para retornar arrays planos (formato real da API)
- [x] Corrigir testes de substituições (3 testes: listar, adicionar, remover)
- [ ] Testar CRUD completo com API rodando

## Fase 14 — Alinhamento com API v0.1.0 ✅

- [x] Ajustar tipos Exercise/Equipment/MuscleGroup/MovementGroup (remover slug, deleted_at; adicionar equipment_ids)
- [x] Corrigir query params em base.ts (sort_by→order_by, sort_order→order_dir)
- [x] Remover métodos obsoletos: addEquipment/removeEquipment, media.list()
- [x] Remover Catalog Version (página, serviço, sidebar, testes)
- [x] Criar instruction.service.ts + use-instructions.ts
- [x] Adicionar step builder reordenável na página de detalhe do exercício
- [x] Adicionar multi-select de equipamentos nos formulários de criar/editar exercício
- [x] Corrigir ExerciseUpdate para incluir movement_group_id, muscle_group_id, equipment_ids

## Fase 15 — Gestão de Treinos (Workouts) ✅

- [x] Criar tipos Workout, WorkoutCreate, WorkoutUpdate, WorkoutExercise, etc.
- [x] Criar workout.service.ts (CRUD workouts + workout-exercises)
- [x] Criar hooks use-workouts.ts
- [x] Página /workouts: listar treinos com busca e filtro por usuário
- [x] Página /workouts/new: criar treino com nome, descrição, selecionar usuário
- [x] Página /workouts/[id]: detalhe do treino + gerenciar exercícios (add, remove, reorder)
- [x] Adicionar "Treinos" no sidebar
- [ ] Testes Playwright para treinos (postergado)

---

## Fase S1 — Segurança: Server Actions + Criptografia (Parte 1)

**Objetivo:** Substituir chamadas diretas à FastAPI (axios) por Server Actions do Next.js, com criptografia assimétrica da senha no login e cookie HTTP-only para o token JWT.

### Fase S1.1 — Fundação (Criptografia + Server Actions) ✅

- [x] Script para gerar par de chaves RSA (2048 bits)
- [x] `src/lib/crypto.ts` — utilitário de criptografia (cliente: encrypt, servidor: decrypt)
- [x] `src/actions/api.action.ts` — server actions genéricas (apiGet, apiPost, apiPatch, apiDelete)
- [x] `src/actions/auth.actions.ts` — server actions de autenticação (login, me, logout)
- [x] Configurar variáveis de ambiente (ENCRYPTION_PRIVATE_KEY, NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY, API_URL)

### Fase S1.2 — Integração Auth (AuthContext + Login) ✅

- [x] Atualizar `auth-context.tsx` para usar server actions (login com criptografia, me, logout)
- [x] `api.ts` (axios) lê token do `token-store` (fallback js-cookie)
- [x] Token JWT mantido em `token-store` (módulo) para compatibilidade com axios até S1.3

### Fase S1.3 — Proxy de Todas as Chamadas CRUD ✅

- [x] Refatorar hooks para chamar `api.action.ts` em vez de `services/*.ts` + axios
- [x] Remover `src/lib/api.ts` (axios) e interceptors
- [x] Remover `NEXT_PUBLIC_API_URL` do .env
- [x] Criar `src/actions/media.action.ts` para upload de mídia via server action
- [x] Remover `src/services/` e todos os arquivos de serviço
- [x] Remover `src/lib/token-store.ts` (não mais necessário)
- [x] Remover dependência `axios` do `package.json`

### Fase S1.4 — Finalização

- [ ] Build de produção sem erros
- [ ] Testes e2e ajustados para novo fluxo (sem axios, sem NEXT_PUBLIC_API_URL)
- [ ] Limpeza de código morto
