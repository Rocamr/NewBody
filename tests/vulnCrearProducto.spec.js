import { test, expect } from '@playwright/test';

test.setTimeout(30000);

test('Validaciones del modal Crear Producto', async ({ page }) => {

  // 1. Login
  await page.goto('http://localhost:5173/productos');
  await page.fill('input[type="email"]', 'ventas@newbody.cr');
  await page.fill('input[type="password"]', 'RDmb12..');
  await page.click('button.btn-login');

  // 2. Esperar ruta correcta
  await page.waitForURL('http://localhost:5173/productos');

  // 3. Reload porque tu app lo necesita para existir
  await page.reload();
  await page.waitForTimeout(3000);

  // 4. Abrir modal
  await page.locator('button.btn-success:has-text("Crear")').click();
  const modal = page.locator('.modal.show');
  await expect(modal).toBeVisible();

  // CAMPOS
  const campoPrecio = modal.locator('input[name="precio"]');
  const campoCB = modal.locator('input[name="codigobarras"]');
  const descES = modal.locator('input[name="descripcionES"]');
  const descEN = modal.locator('input[name="descripcionEN"]');

  // BOTÓN CREAR
  const botonCrear = modal.locator('button.btn-primary:has-text("Crear")');

  // -------------------------------
  // 1) CÓDIGO DE BARRAS NEGATIVO
  // -------------------------------
  await campoCB.fill('-123');
  await page.waitForTimeout(300);

  // tu modal borra el valor si es negativo → eso probamos
  await expect(campoCB).toHaveValue('');

  // -------------------------------
  // 2) PRECIO NEGATIVO
  // -------------------------------
  await campoPrecio.fill('-50');
  await page.waitForTimeout(300);

  await expect(campoPrecio).toHaveValue('');

  // -------------------------------
  // 3) PAYLOAD / XSS EN DESCRIPCIÓN (ES)
  // -------------------------------
  const payload = `<script>alert('XSS')</script>`;

  await descES.fill(payload);
  await page.waitForTimeout(300);

  // tu modal NO deja escribir, así que debe quedar vacío
  await expect(descES).toHaveValue('');

  // -------------------------------
  // 4) PAYLOAD / XSS EN DESCRIPCIÓN (EN)
  // -------------------------------
  await descEN.fill(payload);
  await page.waitForTimeout(300);

  await expect(descEN).toHaveValue('');

  // -------------------------------
  // 5) Verificar que NO permita crear
  //    (ya que los campos están vacíos)
  // -------------------------------
  await botonCrear.click();
  await page.waitForTimeout(500);

  // si el modal sigue visible, NO lo dejó crear
  await expect(modal).toBeVisible();

  // FIN
  await page.waitForTimeout(2000);
});
