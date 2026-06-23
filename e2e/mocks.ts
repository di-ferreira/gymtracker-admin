import type { Page } from "@playwright/test";
import {
  initialExercises as mockExercises,
  initialEquipment as mockEquipment,
  initialMuscleGroups as mockMuscleGroups,
  initialMovementGroups as mockMovementGroups,
  initialSubstitutions as mockSubstitutions,
  initialUsers as mockUsers,
} from "./mock-data";

export {
  mockExercises,
  mockEquipment,
  mockMuscleGroups,
  mockMovementGroups,
  mockSubstitutions,
  mockUsers,
};

export async function setupAuth(page: Page) {
  await page.context().addCookies([
    { name: "gymtracker_token", value: "fake-test-token", url: "http://localhost:3000" },
  ]);
}

export async function setupApiMocks(page: Page) {
  // Navigate to a page on the app to establish origin, then reset mock data
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => fetch("/api/mock/__reset"));
  await setupAuth(page);
}

export async function mockDelay(page: Page, ms: number) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.evaluate((d) => fetch(`/api/mock/__config?delay=${d}`), ms);
}

export async function mockEmptyMode(page: Page, enable: boolean) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.evaluate((e) => fetch(`/api/mock/__config?emptyMode=${e}`), enable);
}
