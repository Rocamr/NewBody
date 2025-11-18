import { test, expect } from '@playwright/test';

test('Vulnerabilidad: el formulario permite crear un producto con precio negativo', async ({ page }) => {
  await page.goto('http://localhost:5173/productos');

  // abrir modal Crear
  await page.click('button.btn-success');

  // asegurar modal abierto
  await expect(page.locator('.modal.show')).toBeVisible();

  // llenar formulario con un precio negativo
  await page.fill('input[name="nombre"]', 'NEGATIVE-TEST');
  await page.fill('input[name="codigobarras"]', '555');
  await page.fill('input[name="precio"]', '-50'); // VALOR INVÁLIDO
  await page.fill('input[name="descuento"]', '0');
  await page.fill('input[name="descripcionEN"]', 'desc en');
  await page.fill('input[name="descripcionES"]', 'desc es');
  await page.fill('input[name="ingredientesES"]', 'x');
  await page.fill('input[name="ingredientesEN"]', 'y');

  // confirmar creación
  await page.click('button.btn-primary:has-text("Crear")');

  // pequeña pausa por recarga
  await page.waitForTimeout(800);

  // buscar fila recién creada
  const fila = page.locator('tr', { hasText: 'NEGATIVE-TEST' });

  await expect(fila).toBeVisible();

  const precio = await fila.locator('td:nth-child(2)').textContent();

  console.log('Precio guardado:', precio);

  // vulnerabilidad confirmada: precio negativo aceptado
  expect(precio.trim()).toBe('-50');

  console.log('✓ Vulnerabilidad confirmada: se creó un producto con precio negativo.');
});
