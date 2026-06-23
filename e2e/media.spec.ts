import { test, expect } from "@playwright/test";
import { setupApiMocks } from "./mocks";

test.describe("Biblioteca de Mídia", () => {
  test("exibe página de upload", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/media");

    await expect(page.getByText("Biblioteca de Mídia")).toBeVisible();
    await expect(page.getByText(/selecionar arquivo/i)).toBeVisible();
  });
});
