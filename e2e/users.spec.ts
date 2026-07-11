import { test, expect } from "@playwright/test";
import { setupApiMocks } from "./mocks";

test.describe("Usuários - CRUD", () => {
  test("lista usuários", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/users");

    await expect(page.getByText("Admin")).toBeVisible();
    await expect(page.getByText("João Usuário")).toBeVisible();
    await expect(page.getByText("Inativo")).toBeVisible();
  });

  test("edita usuário via diálogo inline", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/users");
    await page.getByRole("button", { name: /editar/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const nameInput = page.getByLabel(/nome/i);
    await nameInput.clear();
    await nameInput.fill("Admin Editado");
    await page.getByRole("button", { name: /salvar/i }).click();

    await expect(page.getByText(/sucesso|atualizado/i)).toBeVisible();
  });

  test("altera status do usuário", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/users");
    await page.getByRole("button", { name: /editar/i }).nth(1).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("switch").click();

    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByText(/sucesso|atualizado/i)).toBeVisible();
  });

  test("cria usuário via diálogo", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/users");
    await page.getByRole("button", { name: /novo usuário/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByLabel(/nome/i).fill("Novo Usuário Teste");
    await page.getByLabel(/email/i).fill("novo@teste.com");
    await page.getByLabel(/senha/i).fill("12345678");
    await page.getByRole("button", { name: /salvar/i }).click();

    await expect(page.getByText(/sucesso|criado/i)).toBeVisible();
    await expect(page.getByText("Novo Usuário Teste")).toBeVisible();
  });

  test("exclui usuário via diálogo de confirmação", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/users");
    await page.getByRole("button", { name: /excluir/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/tem certeza/i)).toBeVisible();

    await page.getByRole("button", { name: /excluir$/i }).click();
    await expect(page.getByText(/sucesso|excluído/i)).toBeVisible();
  });
});
