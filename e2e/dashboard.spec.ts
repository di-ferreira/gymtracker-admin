import { test, expect } from "@playwright/test";
import { setupApiMocks, mockExercises, mockEquipment, mockMuscleGroups, mockMovementGroups, mockSubstitutions, mockMedia, mockCatalogVersion } from "./mocks";

test("dashboard carrega com métricas", async ({ page }) => {
  await setupApiMocks(page);
  await page.goto("/");

  await expect(page.getByText("Dashboard")).toBeVisible();
  await expect(page.getByText("Exercícios")).toBeVisible();
  await expect(page.getByText(mockExercises.length.toString())).toBeVisible();
  await expect(page.getByText("Equipamentos")).toBeVisible();
  await expect(page.getByText(mockEquipment.length.toString())).toBeVisible();
  await expect(page.getByText("Grupos Musculares")).toBeVisible();
  await expect(page.getByText(mockMuscleGroups.length.toString())).toBeVisible();
  await expect(page.getByText("Substituições")).toBeVisible();
  await expect(page.getByText(mockSubstitutions.length.toString())).toBeVisible();
});

test("dashboard mostra skeleton durante carregamento", async ({ page }) => {
  await page.route("**/api/v1/**", async (route) => {
    await new Promise((r) => setTimeout(r, 500));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [] }) });
  });
  await page.goto("/");

  await expect(page.locator(".animate-pulse")).first().toBeVisible();
});

test("dashboard mostra empty state quando não há dados", async ({ page }) => {
  await page.route("**/api/v1/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [], total: 0, page: 1, per_page: 20, total_pages: 0 }) });
  });
  await page.goto("/");

  await expect(page.getByText(/nenhum/i)).toBeVisible();
});
