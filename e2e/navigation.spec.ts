import { test, expect } from "@playwright/test";
import { setupApiMocks, mockExercises } from "./mocks";

test.describe("Navegação", () => {
  test("navega entre todas as rotas via sidebar", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/");

    await page.getByRole("link", { name: /exercícios/i }).click();
    await expect(page).toHaveURL(/\/exercises/);
    await expect(page.getByText("Supino Reto")).toBeVisible();

    await page.getByRole("link", { name: /equipamentos/i }).click();
    await expect(page).toHaveURL(/\/equipment/);
    await expect(page.getByText("Barra Reta")).toBeVisible();

    await page.getByRole("link", { name: /grupos musculares/i }).click();
    await expect(page).toHaveURL(/\/muscle-groups/);

    await page.getByRole("link", { name: /grupos de movimento/i }).click();
    await expect(page).toHaveURL(/\/movement-groups/);

    await page.getByRole("link", { name: /substituições/i }).click();
    await expect(page).toHaveURL(/\/alternatives/);

    await page.getByRole("link", { name: /mídia/i }).click();
    await expect(page).toHaveURL(/\/media/);

    await page.getByRole("link", { name: /versão/i }).click();
    await expect(page).toHaveURL(/\/catalog-version/);
  });

  test("sidebar recolhe e expande em mobile", async ({ page }) => {
    await setupApiMocks(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const sidebar = page.getByRole("navigation");
    await expect(sidebar).toBeHidden();

    await page.getByRole("button", { name: /abrir menu/i }).click();
    await expect(sidebar).toBeVisible();

    await page.getByRole("button", { name: /fechar/i }).click();
    await expect(sidebar).toBeHidden();
  });
});
