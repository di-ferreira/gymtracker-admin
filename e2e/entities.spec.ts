import { test, expect } from "@playwright/test";
import { setupApiMocks, mockEquipment, mockMuscleGroups, mockMovementGroups } from "./mocks";

test.describe("Equipamentos - CRUD", () => {
  test("lista equipamentos", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/equipment");

    await expect(page.getByText("Barra Reta")).toBeVisible();
    await expect(page.getByText("Halteres")).toBeVisible();
  });

  test("cria equipamento via diálogo inline", async ({ page }) => {
    await setupApiMocks(page);

    let createdBody: any = null;
    await page.route("**/api/v1/admin/catalog/equipment/", async (route, request) => {
      if (request.method() === "POST") {
        createdBody = request.postDataJSON();
        await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({
          data: { id: "eq3", ...createdBody },
        })});
      } else {
        await route.fallback();
      }
    });

    await page.goto("/equipment");

    await page.getByRole("button", { name: /novo/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByPlaceholder(/nome/i).fill("Kettlebell");
    await page.getByRole("button", { name: /criar|salvar/i }).click();

    await expect(page.getByText(/sucesso|criado/i)).toBeVisible();
    expect(createdBody.name).toBe("Kettlebell");
  });

  test("exclui equipamento", async ({ page }) => {
    await setupApiMocks(page);

    let deleted = false;
    await page.route("**/api/v1/admin/catalog/equipment/eq1", async (route, request) => {
      if (request.method() === "DELETE") {
        deleted = true;
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: {} }) });
      } else {
        await route.fallback();
      }
    });

    await page.goto("/equipment");
    await page.getByRole("button", { name: /excluir/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /confirmar/i }).click();

    await expect(page.getByText(/sucesso|excluído/i)).toBeVisible();
    expect(deleted).toBe(true);
  });
});

test.describe("Grupos Musculares - CRUD", () => {
  test("cria grupo muscular", async ({ page }) => {
    await setupApiMocks(page);

    let createdBody: any = null;
    await page.route("**/api/v1/admin/catalog/muscle-groups/", async (route, request) => {
      if (request.method() === "POST") {
        createdBody = request.postDataJSON();
        await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({
          data: { id: "m3", ...createdBody },
        })});
      } else {
        await route.fallback();
      }
    });

    await page.goto("/muscle-groups");
    await page.getByRole("button", { name: /novo/i }).click();
    await page.getByPlaceholder(/nome/i).fill("Quadríceps");
    await page.getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso|criado/i)).toBeVisible();
    expect(createdBody.name).toBe("Quadríceps");
  });
});

test.describe("Grupos de Movimento - CRUD", () => {
  test("cria grupo de movimento", async ({ page }) => {
    await setupApiMocks(page);

    let createdBody: any = null;
    await page.route("**/api/v1/admin/catalog/movement-groups/", async (route, request) => {
      if (request.method() === "POST") {
        createdBody = request.postDataJSON();
        await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({
          data: { id: "mg3", ...createdBody },
        })});
      } else {
        await route.fallback();
      }
    });

    await page.goto("/movement-groups");
    await page.getByRole("button", { name: /novo/i }).click();
    await page.getByPlaceholder(/nome/i).fill("Agachar");
    await page.getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso|criado/i)).toBeVisible();
    expect(createdBody.name).toBe("Agachar");
  });
});
