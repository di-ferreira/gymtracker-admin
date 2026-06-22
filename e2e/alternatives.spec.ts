import { test, expect } from "@playwright/test";
import { setupApiMocks, mockExercises, mockSubstitutions } from "./mocks";

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

    let createdBody: any = null;
    await page.route("**/admin/catalog/exercises/e1/alternatives/", async (route, request) => {
      if (request.method() === "POST") {
        createdBody = request.postDataJSON();
        await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: "s2", ...createdBody }) });
      } else {
        await route.fallback();
      }
    });

    await page.goto("/alternatives");
    await page.getByRole("button", { name: "Supino Reto" }).click();
    await page.getByRole("button", { name: /adicionar/i }).click();
    await page.getByRole("dialog").waitFor();
    await page.getByText("Selecione.").click();
    await page.getByRole("option", { name: "Rosca Direta" }).click();
    await page.locator("button").filter({ hasText: "Adicionar" }).last().click();

    await expect(page.getByText(/sucesso|adicionad/i)).toBeVisible({ timeout: 10000 });
    expect(createdBody).not.toBeNull();
  });

  test("remove substituição", async ({ page }) => {
    await setupApiMocks(page);

    let deleted = false;
    await page.route("**/admin/catalog/exercises/e1/alternatives/s1", async (route, request) => {
      if (request.method() === "DELETE") {
        deleted = true;
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({}) });
      } else {
        await route.fallback();
      }
    });

    await page.goto("/alternatives");
    await page.getByRole("button", { name: "Supino Reto" }).click();
    await page.locator("div.rounded-lg button").click();

    await expect(page.getByText(/sucesso|removid/i)).toBeVisible({ timeout: 10000 });
    expect(deleted).toBe(true);
  });
});
