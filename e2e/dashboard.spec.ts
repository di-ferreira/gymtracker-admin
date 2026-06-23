import { test, expect } from "@playwright/test";
import { setupApiMocks, setupAuth, mockDelay, mockEmptyMode } from "./mocks";

test("dashboard carrega com métricas", async ({ page }) => {
  await setupApiMocks(page);
  await page.goto("/");

  await expect(page.getByText("Dashboard")).toBeVisible();
  await expect(page.getByText("Total de Exercícios")).toBeVisible();
  await expect(page.getByText("Grupos Musculares")).toBeVisible();
  await expect(page.getByText("Equipamentos")).toBeVisible();
  await expect(page.getByText("Substituições")).toBeVisible();
});

test("dashboard mostra skeleton durante carregamento", async ({ page }) => {
  await mockDelay(page, 300);
  await setupAuth(page);
  await page.goto("/");

  await expect(page.locator(".animate-pulse")).first().toBeVisible();
});

test("dashboard mostra empty state quando não há dados", async ({ page }) => {
  await mockEmptyMode(page, true);
  await setupAuth(page);
  await page.goto("/");

  await expect(page.getByText(/nenhum/i)).toBeVisible();
});
