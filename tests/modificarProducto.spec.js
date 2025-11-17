import { test, expect } from '@playwright/test';

test('Intento de modificación del producto produ2 sin autenticación', async ({ page }) => {
  // 1. Abrir la página real
  await page.goto('http://localhost:5173/productos');

  // 2. Esperar la tabla
  await page.waitForSelector('table');

  // 3. Localizar la fila del producto por CB
  const fila = page.locator('tr', {
    has: page.locator('td', { hasText: '123124' })
  });

  await expect(fila).toBeVisible();

  // 4. Abrir modal de edición
  await fila.locator('button:has-text("Editar")').click();

  // 5. Esperar campos del modal
  await page.waitForSelector('input[name="precio"]');

  // 6. Modificar el precio
  await page.fill('input[name="precio"]', '777');

  // 7. Clic al botón Editar dentro del modal (type="button", no submit)
  await page.locator('.modal-footer button.btn.btn-primary:has-text("Editar")').click();

  // 8. Esperar alertas o cambios
  await page.waitForTimeout(1500);

  const successAlert = page.locator('.alert-success');
  const errorAlert = page.locator('.alert-danger, .alert');

  const success = await successAlert.isVisible();
  const error = await errorAlert.isVisible();

  // Si hubo éxito, Firestore dejó editar sin auth => inseguro
  expect(success).toBeFalsy();

  // Debe dar error o no permitir nada
  expect(error || !success).toBeTruthy();
});
