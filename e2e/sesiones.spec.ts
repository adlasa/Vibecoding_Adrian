import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("apuntar una sesión la muestra en la lista", async ({ page }) => {
  await page.getByLabel("Asignatura").fill("Matemáticas");
  await page.getByLabel("Fecha").fill("2026-11-02");
  await page.getByLabel("Horas").fill("1");
  await page.getByLabel("Minutos").fill("30");
  await page.getByRole("button", { name: "Apuntar sesión" }).click();

  await expect(page.getByRole("list", { name: "Sesiones apuntadas" })).toHaveText(
    "02/11/2026 · Matemáticas · 1 h 30 min",
  );
  await expect(page.getByRole("alert", { name: "Errores del formulario" })).toHaveCount(0);
  await expect(page.getByLabel("Asignatura")).toHaveValue("");
});

test("una duración de 0 h 0 min avisa y no añade nada", async ({ page }) => {
  await page.getByLabel("Asignatura").fill("Matemáticas");
  await page.getByLabel("Fecha").fill("2026-11-02");
  await page.getByLabel("Horas").fill("0");
  await page.getByLabel("Minutos").fill("0");
  await page.getByRole("button", { name: "Apuntar sesión" }).click();

  await expect(page.getByRole("alert", { name: "Errores del formulario" })).toContainText(
    "La duración debe ser de al menos 1 minuto.",
  );
  await expect(
    page.getByRole("list", { name: "Sesiones apuntadas" }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Todavía no has apuntado ninguna sesión."),
  ).toBeVisible();
});

test("al recargar la lista se vacía, porque aún no se guarda", async ({
  page,
}) => {
  await page.getByLabel("Asignatura").fill("Historia");
  await page.getByLabel("Fecha").fill("2026-11-04");
  await page.getByLabel("Horas").fill("2");
  await page.getByRole("button", { name: "Apuntar sesión" }).click();
  await expect(page.getByRole("list", { name: "Sesiones apuntadas" })).toBeVisible();

  await page.reload();

  await expect(
    page.getByText("Todavía no has apuntado ninguna sesión."),
  ).toBeVisible();
});
