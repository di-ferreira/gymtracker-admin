import { test, expect } from "@playwright/test";
import { setupApiMocks, setupAuth, mockDelay, mockEmptyMode } from "./mocks";

test.describe("Exercícios - CRUD", () => {
  test("lista exercícios com busca", async ({ page }) => {
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

    await page.goto("/exercises/new");

    await page.getByPlaceholder(/nome/i).fill("Agachamento");
    await page.getByLabel(/grupo muscular/i).click();
    await page.getByRole("option", { name: "Peitoral" }).click();
    await page.getByLabel(/grupo de movimento/i).click();
    await page.getByRole("option", { name: "Empurrar" }).click();

    await page.getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso|criado|cadastrado/i)).toBeVisible();
  });

  test("edita exercício existente", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/exercises/e1/edit");
    await page.getByPlaceholder(/nome/i).clear();
    await page.getByPlaceholder(/nome/i).fill("Supino Inclinado");

    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByText(/sucesso|salvo|atualizado/i)).toBeVisible();
  });

  test("exclui exercício com confirmação", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/exercises");
    await page.getByRole("link", { name: "Supino Reto" }).click();

    await page.getByRole("button", { name: /excluir/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /confirmar/i }).click();

    await expect(page.getByText(/sucesso|excluído|removido/i)).toBeVisible();
  });

  test("validação de formulário (campos obrigatórios)", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/exercises/new");

    await page.getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/obrigatório/i)).toBeVisible();
  });

  test("exibe skeleton durante carregamento", async ({ page }) => {
    await mockDelay(page, 500);
    await setupAuth(page);
    await page.goto("/exercises");

    await expect(page.locator(".animate-pulse")).first().toBeVisible();
  });

  test("exibe empty state quando não há exercícios", async ({ page }) => {
    await mockEmptyMode(page, true);
    await setupAuth(page);
    await page.goto("/exercises");

    await expect(page.getByText(/nenhum/i)).toBeVisible();
  });
});
