import { test, expect } from "@playwright/test";
import { setupApiMocks, mockUsers } from "./mocks";

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

    let updatedBody: any = null;
    await page.route("**/api/v1/admin/users/u1", async (route, request) => {
      if (request.method() === "PATCH") {
        updatedBody = request.postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ...mockUsers[0], ...updatedBody }),
        });
      } else {
        await route.fallback();
      }
    });

    await page.goto("/users");
    await page.getByRole("button", { name: /editar/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const nameInput = page.getByLabel(/nome/i);
    await nameInput.clear();
    await nameInput.fill("Admin Editado");
    await page.getByRole("button", { name: /salvar/i }).click();

    await expect(page.getByText(/sucesso|atualizado/i)).toBeVisible();
    expect(updatedBody.name).toBe("Admin Editado");
  });

  test("altera status do usuário", async ({ page }) => {
    await setupApiMocks(page);

    let updatedBody: any = null;
    await page.route("**/api/v1/admin/users/u2", async (route, request) => {
      if (request.method() === "PATCH") {
        updatedBody = request.postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ...mockUsers[1], ...updatedBody }),
        });
      } else {
        await route.fallback();
      }
    });

    await page.goto("/users");
    await page.getByRole("button", { name: /editar/i }).nth(1).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("switch").click();

    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByText(/sucesso|atualizado/i)).toBeVisible();
    expect(updatedBody.is_active).toBe(false);
  });
});
