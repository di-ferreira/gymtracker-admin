import { test, expect } from "@playwright/test";
import { setupApiMocks } from "./mocks";

test.describe("Substituições", () => {
  test("exibe substituições de um exercício", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/alternatives");

    await page.getByRole("button", { name: "Supino Reto" }).click();
    await expect(page.getByText("Substituto", { exact: true })).toBeVisible();
    await expect(page.getByText("Rosca Direta").first()).toBeVisible();
  });

  test("adiciona substituição", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/alternatives");
    await page.getByRole("button", { name: "Supino Reto" }).click();
    await page.getByRole("button", { name: /adicionar/i }).click();
    await page.getByRole("dialog").waitFor();
    await page.getByText("Selecione.").click();
    await page.getByRole("option", { name: "Rosca Direta" }).click();
    await page.locator("button").filter({ hasText: "Adicionar" }).last().click();

    await expect(page.getByText(/sucesso|adicionad/i)).toBeVisible({ timeout: 10000 });
  });

  test("remove substituição", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/alternatives");
    await page.getByRole("button", { name: "Supino Reto" }).click();
    await page.locator("div.rounded-lg button").click();

    await expect(page.getByText(/sucesso|removid/i)).toBeVisible({ timeout: 10000 });
  });
});
