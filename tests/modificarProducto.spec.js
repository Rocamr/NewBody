import { test, expect } from '@playwright/test';

test('Modificación de producto con credenciales ADMIN debe funcionar', async ({ page }) => {

  // 1. Ir a productos (redirige a login si no hay sesión)
  await page.goto('http://localhost:5173/productos');

  // 2. Esperar formulario de login
  await page.waitForSelector('.form-login');

  // 3. Completar credenciales admin
  await page.fill('input[type="email"]', 'ventas@newbody.cr');
  await page.fill('input[type="password"]', 'RDmb12..');

  // 4. Enviar formulario
  await Promise.all([
    page.waitForNavigation(),
    page.click('.btn-login')
  ]);

  // 5. Debe entrar a productos
  await expect(page).toHaveURL(/productos/);

  // 6. Esperar tabla
  await page.waitForSelector('table');

  // 7. Localizar la fila del producto por CB
  const fila = page.locator('tr', {
    has: page.locator('td', { hasText: '123124' })
  });

  await expect(fila).toBeVisible();

  // 8. Abrir modal de editar
  await fila.locator('button:has-text("Editar")').click();

  // 9. Esperar modal
  await page.waitForSelector('input[name="precio"]');

  // 10. Modificar precio
  await page.fill('input[name="precio"]', '777');

  // 11. Guardar
  await Promise.all([
    page.waitForSelector('.alert'), // Esperar alerta
    page.locator('.modal-footer button.btn.btn-primary:has-text("Editar")').click()
  ]);

  // 12. Esperar unos ms por animaciones
  await page.waitForTimeout(1200);

  const successAlert = page.locator('.alert-success');
  const errorAlert = page.locator('.alert-danger');

  const success = await successAlert.isVisible();
  const error = await errorAlert.isVisible();

  // 13. Validaciones:
  // Admin => modificación debe ser exitosa
  expect(success).toBeTruthy();
  expect(error).toBeFalsy();
});
