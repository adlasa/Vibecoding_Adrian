import { expect, test } from "@playwright/test";

test("la app se abre, muestra su nombre y no da errores", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (error) => errores.push(error.message));
  page.on("console", (mensaje) => {
    if (mensaje.type() === "error") errores.push(mensaje.text());
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Horas de Estudio" }),
  ).toBeVisible();
  await expect(page).toHaveTitle("Horas de Estudio");
  expect(errores).toEqual([]);
});
