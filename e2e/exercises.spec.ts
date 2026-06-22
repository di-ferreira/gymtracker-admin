import { test, expect } from "@playwright/test";
import { setupApiMocks, mockExercises, mockMuscleGroups, mockMovementGroups, mockEquipment } from "./mocks";

test.describe("Exercícios - CRUD", () => {
  test("lista exercícios com busca e paginação", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/exercises");

    await expect(page.getByText("Supino Reto")).toBeVisible();
    await expect(page.getByText("Rosca Direta")).toBeVisible();

    await page.getByPlaceholder(/buscar/i).fill("supino");
    await page.getByPlaceholder(/buscar/i).press("Enter");
    await expect(page.getByText("Supino Reto")).toBeVisible();
    await expect(page.getByText("Rosca Direta")).toBeHidden();
  });

  test("cria exercício com formulário", async ({ page }) => {
    await setupApiMocks(page);

    let createdBody: any = null;
    await page.route("**/api/v1/admin/catalog/exercises/", async (route, request) => {
      if (request.method() === "POST") {
        createdBody = request.postDataJSON();
        await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({
          data: { id: "e3", ...createdBody, slug: createdBody.name.toLowerCase().replace(/\s+/g, "-") },
        })});
      } else {
        await route.fallback();
      }
    });

    await page.goto("/exercises/new");

    await page.getByPlaceholder(/nome/i).fill("Agachamento");
    await page.getByLabel(/grupo muscular/i).click();
    await page.getByRole("option", { name: "Peitoral" }).click();
    await page.getByLabel(/grupo de movimento/i).click();
    await page.getByRole("option", { name: "Empurrar" }).click();

    await page.getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso|criado|cadastrado/i)).toBeVisible();
    expect(createdBody).not.toBeNull();
    expect(createdBody.name).toBe("Agachamento");
  });

  test("edita exercício existente", async ({ page }) => {
    await setupApiMocks(page);

    let updatedBody: any = null;
    await page.route("**/api/v1/admin/catalog/exercises/e1", async (route, request) => {
      if (request.method() === "PUT") {
        updatedBody = request.postDataJSON();
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { ...mockExercises[0], ...updatedBody } })});
      } else {
        await route.fallback();
      }
    });

    await page.goto("/exercises/e1/edit");
    await page.getByPlaceholder(/nome/i).clear();
    await page.getByPlaceholder(/nome/i).fill("Supino Inclinado");

    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByText(/sucesso|salvo|atualizado/i)).toBeVisible();
    expect(updatedBody).not.toBeNull();
  });

  test("exclui exercício com confirmação", async ({ page }) => {
    await setupApiMocks(page);

    let deleted = false;
    await page.route("**/api/v1/admin/catalog/exercises/e1", async (route, request) => {
      if (request.method() === "DELETE") {
        deleted = true;
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: {} })});
      } else {
        await route.fallback();
      }
    });

    await page.goto("/exercises");

    await page.getByRole("button", { name: /excluir/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /confirmar/i }).click();

    await expect(page.getByText(/sucesso|excluído|removido/i)).toBeVisible();
    expect(deleted).toBe(true);
  });

  test("validação de formulário (campos obrigatórios)", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/exercises/new");

    await page.getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/obrigatório/i)).toBeVisible();
  });

  test("exibe skeleton durante carregamento", async ({ page }) => {
    await page.route("**/api/v1/admin/catalog/exercises/", async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: mockExercises, total: 2, page: 1, per_page: 20, total_pages: 1 }) });
    });
    await page.goto("/exercises");

    await expect(page.locator(".animate-pulse")).first().toBeVisible();
  });

  test("exibe empty state quando não há exercícios", async ({ page }) => {
    await page.route("**/api/v1/admin/catalog/exercises/", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [], total: 0, page: 1, per_page: 20, total_pages: 0 }) });
    });
    await page.goto("/exercises");

    await expect(page.getByText(/nenhum/i)).toBeVisible();
  });
});
