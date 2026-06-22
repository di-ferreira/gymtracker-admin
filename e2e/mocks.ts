import type { Page } from "@playwright/test";

export const mockExercises = [
  {
    id: "e1",
    name: "Supino Reto",
    slug: "supino-reto",
    description: "Exercício clássico para peitoral",
    execution_tips: "Mantenha os cotovelos a 45 graus",
    difficulty: "Intermediate",
    movement_group_id: "mg1",
    muscle_group_id: "m1",
    movement_group: { id: "mg1", name: "Empurrar", slug: "empurrar", description: null, order_index: 1, created_at: "", updated_at: "" },
    muscle_group: { id: "m1", name: "Peitoral", slug: "peitoral", description: null, order_index: 1, created_at: "", updated_at: "" },
    equipment_relations: [{ exercise_id: "e1", equipment_id: "eq1", usage_note: null }],
    instructions: [
      { id: "i1", exercise_id: "e1", step_order: 1, description: "Deite no banco", image_url: null, created_at: "", updated_at: "" },
      { id: "i2", exercise_id: "e1", step_order: 2, description: "Segure a barra", image_url: null, created_at: "", updated_at: "" },
    ],
    alternatives: [],
    thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    deleted_at: null, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "e2",
    name: "Rosca Direta",
    slug: "rosca-direta",
    description: "Exercício para bíceps",
    execution_tips: "Não balançar o corpo",
    difficulty: "Beginner",
    movement_group_id: "mg2",
    muscle_group_id: "m2",
    movement_group: { id: "mg2", name: "Puxar", slug: "puxar", description: null, order_index: 2, created_at: "", updated_at: "" },
    muscle_group: { id: "m2", name: "Bíceps", slug: "biceps", description: null, order_index: 2, created_at: "", updated_at: "" },
    equipment_relations: [{ exercise_id: "e2", equipment_id: "eq2", usage_note: null }],
    instructions: [],
    alternatives: [],
    thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    deleted_at: null, created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z",
  },
];

export const mockEquipment = [
  { id: "eq1", name: "Barra Reta", slug: "barra-reta", description: null, category: "Barras", order_index: 1, deleted_at: null, created_at: "", updated_at: "" },
  { id: "eq2", name: "Halteres", slug: "halteres", description: null, category: "Pesos", order_index: 2, deleted_at: null, created_at: "", updated_at: "" },
];

export const mockMuscleGroups = [
  { id: "m1", name: "Peitoral", slug: "peitoral", description: "Músculos do peito", order_index: 1, created_at: "", updated_at: "" },
  { id: "m2", name: "Bíceps", slug: "biceps", description: "Músculos do braço", order_index: 2, created_at: "", updated_at: "" },
];

export const mockMovementGroups = [
  { id: "mg1", name: "Empurrar", slug: "empurrar", description: "Movimentos de empurrar", order_index: 1, created_at: "", updated_at: "" },
  { id: "mg2", name: "Puxar", slug: "puxar", description: "Movimentos de puxar", order_index: 2, created_at: "", updated_at: "" },
];

export const mockSubstitutions = [
  { id: "s1", exercise_id: "e1", alternative_exercise_id: "e2", reason: "Mesmo grupo muscular", note: null, created_at: "", updated_at: "" },
];

export const mockMedia = [
  { id: "med1", url: "https://example.com/exercise.gif", type: "GIF", filename: "exercise.gif", created_at: "" },
  { id: "med2", url: "https://example.com/exercise.mp4", type: "VIDEO", filename: "exercise.mp4", created_at: "" },
];

export const mockUsers = [
  { id: "u1", email: "admin@gymtracker.com", name: "Admin", role: "admin", is_active: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z" },
  { id: "u2", email: "user@gymtracker.com", name: "João Usuário", role: "user", is_active: true, created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z" },
  { id: "u3", email: "inactive@gymtracker.com", name: "Inativo", role: "user", is_active: false, created_at: "2025-01-03T00:00:00Z", updated_at: "2025-01-03T00:00:00Z" },
];

export const mockCatalogVersion = {
  id: "v1",
  version_major: 1,
  version_minor: 2,
  checksum: "abc123",
  status: "published",
  description: "Adicionado novos exercícios de perna",
  checksum_algorithm: "sha256",
  sync_metadata: null,
  created_at: "2025-06-01T00:00:00Z",
  updated_at: "2025-06-01T00:00:00Z",
};

export async function setupApiMocks(page: Page) {
  await page.route("**/api/v1/admin/catalog/exercises/", async (route) => {
    const url = new URL(route.request().url());
    const search = url.searchParams.get("search")?.toLowerCase();
    const filtered = search
      ? mockExercises.filter((e) => e.name.toLowerCase().includes(search))
      : mockExercises;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: filtered, total: filtered.length, page: 1, per_page: 20, total_pages: 1 }),
    });
  });

  await page.route("**/api/v1/admin/catalog/exercises/e1", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: mockExercises[0] }),
    });
  });

  await page.route("**/api/v1/admin/catalog/equipment/", async (route) => {
    const url = new URL(route.request().url());
    const search = url.searchParams.get("search")?.toLowerCase();
    const filtered = search
      ? mockEquipment.filter((e) => e.name.toLowerCase().includes(search))
      : mockEquipment;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: filtered, total: filtered.length, page: 1, per_page: 100, total_pages: 1 }),
    });
  });

  await page.route("**/api/v1/admin/catalog/muscle-groups/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: mockMuscleGroups, total: mockMuscleGroups.length, page: 1, per_page: 100, total_pages: 1 }),
    });
  });

  await page.route("**/api/v1/admin/catalog/movement-groups/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: mockMovementGroups, total: mockMovementGroups.length, page: 1, per_page: 100, total_pages: 1 }),
    });
  });

  await page.route("**/admin/catalog/exercises/*/alternatives/", async (route) => {
    const url = new URL(route.request().url());
    const pathParts = url.pathname.split("/");
    const exerciseIdx = pathParts.indexOf("exercises") + 1;
    const exerciseId = pathParts[exerciseIdx];
    const filtered = mockSubstitutions.filter((s) => s.exercise_id === exerciseId);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(filtered),
    });
  });

  await page.route("**/api/v1/admin/catalog/media/", async (route) => {
    const url = new URL(route.request().url());
    const type = url.searchParams.get("type");
    const filtered = type ? mockMedia.filter((m) => m.type === type) : mockMedia;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: filtered }),
    });
  });

  await page.route("**/api/v1/admin/users/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: mockUsers, total: mockUsers.length, page: 1, per_page: 100, total_pages: 1 }),
    });
  });

  await page.route("**/api/v1/admin/catalog/version/current", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: mockCatalogVersion }),
    });
  });

  await page.route("**/api/v1/admin/catalog/version/history", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [mockCatalogVersion] }),
    });
  });
}
