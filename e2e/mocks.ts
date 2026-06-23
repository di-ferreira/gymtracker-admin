import type { Page } from "@playwright/test";

export const mockExercises = [
  {
    id: "e1",
    name: "Supino Reto",
    description: "Exercício clássico para peitoral",
    execution_tips: "Mantenha os cotovelos a 45 graus",
    difficulty: "Intermediate",
    movement_group_id: "mg1",
    muscle_group_id: "m1",
    equipment_ids: ["eq1"],
    thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "e2",
    name: "Rosca Direta",
    description: "Exercício para bíceps",
    execution_tips: "Não balançar o corpo",
    difficulty: "Beginner",
    movement_group_id: "mg2",
    muscle_group_id: "m2",
    equipment_ids: ["eq2"],
    thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z",
  },
];

export const mockEquipment = [
  { id: "eq1", name: "Barra Reta", description: null, category: "Barras", order_index: 1, created_at: "", updated_at: "" },
  { id: "eq2", name: "Halteres", description: null, category: "Pesos", order_index: 2, created_at: "", updated_at: "" },
];

export const mockMuscleGroups = [
  { id: "m1", name: "Peitoral", description: "Músculos do peito", order_index: 1, created_at: "", updated_at: "" },
  { id: "m2", name: "Bíceps", description: "Músculos do braço", order_index: 2, created_at: "", updated_at: "" },
];

export const mockMovementGroups = [
  { id: "mg1", name: "Empurrar", description: "Movimentos de empurrar", order_index: 1, created_at: "", updated_at: "" },
  { id: "mg2", name: "Puxar", description: "Movimentos de puxar", order_index: 2, created_at: "", updated_at: "" },
];

export const mockSubstitutions = [
  { id: "s1", exercise_id: "e1", alternative_exercise_id: "e2", reason: "Mesmo grupo muscular", note: null, created_at: "", updated_at: "" },
];

export const mockUsers = [
  { id: "u1", email: "admin@gymtracker.com", name: "Admin", role: "admin", is_active: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z" },
  { id: "u2", email: "user@gymtracker.com", name: "João Usuário", role: "user", is_active: true, created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z" },
  { id: "u3", email: "inactive@gymtracker.com", name: "Inativo", role: "user", is_active: false, created_at: "2025-01-03T00:00:00Z", updated_at: "2025-01-03T00:00:00Z" },
];

export async function setupAuth(page: Page) {
  await page.context().addCookies([
    { name: "gymtracker_token", value: "fake-test-token", url: "http://localhost:3000" },
  ]);
  await page.route("**/api/v1/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockUsers[0]),
    });
  });
}

export async function setupApiMocks(page: Page) {
  await setupAuth(page);

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
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }
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
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }
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

  await page.route("**/api/v1/admin/users/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: mockUsers, total: mockUsers.length, page: 1, per_page: 100, total_pages: 1 }),
    });
  });
}
