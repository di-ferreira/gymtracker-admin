import { test, expect } from "@playwright/test";
import { setupApiMocks, mockExercises, mockSubstitutions } from "./mocks";

test.describe("Substituições", () => {
  test("exibe substituições de um exercício", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/alternatives");

    await expect(page.getByText("Supino Reto")).toBeVisible();
    await expect(page.getByText("Rosca Direta")).toBeVisible();
  });

  test("adiciona substituição", async ({ page }) => {
    await setupApiMocks(page);

    let createdBody: any = null;
    await page.route("**/api/v1/admin/catalog/exercise-alternatives/", async (route, request) => {
      if (request.method() === "POST") {
        createdBody = request.postDataJSON();
        await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ data: { id: "s2", ...createdBody } })});
      } else {
        await route.fallback();
      }
    });

    await page.goto("/alternatives");
    await page.getByRole("button", { name: /adicionar/i }).click();

    await expect(page.getByText(/sucesso|adicionado/i)).toBeVisible();
    expect(createdBody).not.toBeNull();
  });

  test("remove substituição", async ({ page }) => {
    await setupApiMocks(page);

    let deleted = false;
    await page.route("**/api/v1/admin/catalog/exercise-alternatives/s1", async (route, request) => {
      if (request.method() === "DELETE") {
        deleted = true;
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: {} })});
      } else {
        await route.fallback();
      }
    });

    await page.goto("/alternatives");
    await page.getByRole("button", { name: /excluir|remover/i }).first().click();

    await expect(page.getByText(/sucesso|removido/i)).toBeVisible();
    expect(deleted).toBe(true);
  });
});
