import { test, expect } from "@playwright/test";
import { setupApiMocks, mockCatalogVersion } from "./mocks";

test.describe("Versão do Catálogo", () => {
  test("exibe versão atual", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/catalog-version");

    await expect(page.getByText(/1\.2/)).toBeVisible();
    await expect(page.getByText(/publicado/i)).toBeVisible();
  });

  test("abre diálogo de publicação", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/catalog-version");

    await page.getByRole("button", { name: /publicar/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
