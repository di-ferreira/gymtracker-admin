import { test, expect } from "@playwright/test";
import { setupApiMocks, mockMedia } from "./mocks";

test.describe("Biblioteca de Mídia", () => {
  test("exibe grid de mídia", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/media");

    await expect(page.getByText("exercise.gif")).toBeVisible();
    await expect(page.getByText("exercise.mp4")).toBeVisible();
  });

  test("filtra por tipo", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/media");

    await page.getByLabel(/tipo/i).click();
    await page.getByRole("option", { name: "GIF" }).click();

    await expect(page.getByText("exercise.gif")).toBeVisible();
  });

  test("abre preview modal", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/media");

    await page.getByRole("button", { name: /visualizar/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
