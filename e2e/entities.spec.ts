import { test, expect } from "@playwright/test";
import { setupApiMocks } from "./mocks";

test.describe("Equipamentos - CRUD", () => {
  test("lista equipamentos", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/equipment");

    await expect(page.getByText("Barra Reta")).toBeVisible();
    await expect(page.getByText("Halteres")).toBeVisible();
  });

  test("cria equipamento via diálogo inline", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/equipment");

    await page.getByRole("button", { name: /novo/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByPlaceholder(/nome/i).fill("Kettlebell");
    await page.getByRole("button", { name: /criar|salvar/i }).click();

    await expect(page.getByText(/sucesso|criado/i)).toBeVisible();
  });

  test("exclui equipamento", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/equipment");
    await page.getByRole("button", { name: /excluir/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /confirmar/i }).click();

    await expect(page.getByText(/sucesso|excluído/i)).toBeVisible();
  });
});

test.describe("Grupos Musculares - CRUD", () => {
  test("cria grupo muscular", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/muscle-groups");
    await page.getByRole("button", { name: /novo/i }).click();
    await page.getByPlaceholder(/nome/i).fill("Quadríceps");
    await page.getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso|criado/i)).toBeVisible();
  });
});

test.describe("Grupos de Movimento - CRUD", () => {
  test("cria grupo de movimento", async ({ page }) => {
    await setupApiMocks(page);

    await page.goto("/movement-groups");
    await page.getByRole("button", { name: /novo/i }).click();
    await page.getByPlaceholder(/nome/i).fill("Agachar");
    await page.getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso|criado/i)).toBeVisible();
  });
});
