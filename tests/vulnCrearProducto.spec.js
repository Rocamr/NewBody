import { test, expect } from '@playwright/test';
import path from 'path';

// dummy image válida
const imagenValida = path.resolve('public/dummy.png');

test.setTimeout(40000);

test('Documentación de vulnerabilidades conocidas en el formulario de productos', async ({ page }) => {
  await page.goto('http://localhost:5173/productos');

  const vulnerabilidades = [];

  async function prepararModal(nombre) {
    await page.click('button.btn-success');
    await expect(page.locator('.modal.show')).toBeVisible();

    await page.fill('input[name="nombre"]', nombre);
    await page.fill('input[name="codigobarras"]', '999');
    await page.fill('input[name="precio"]', '100');
    await page.fill('input[name="descuento"]', '0');
    await page.fill('input[name="descripcionEN"]', 'desc');
    await page.fill('input[name="descripcionES"]', 'desc');

    await page.setInputFiles('input[type="file"]', imagenValida);
  }

  // 1. Código de barras NEGATIVO
  await prepararModal('TEST-CB-NEGATIVO');
  await page.fill('input[name="codigobarras"]', '-123');
  await page.click('button.btn-primary:has-text("Crear")');
  await page.waitForTimeout(600);

  if (await page.locator('td:has-text("TEST-CB-NEGATIVO")').first().isVisible()) {
    vulnerabilidades.push(' Código de barras permite valores negativos.');
  }

  // 2. Precio NEGATIVO
  await prepararModal('TEST-PRECIO-NEGATIVO');
  await page.fill('input[name="precio"]', '-50');
  await page.click('button.btn-primary:has-text("Crear")');
  await page.waitForTimeout(600);

  if (await page.locator('td:has-text("TEST-PRECIO-NEGATIVO")').first().isVisible()) {
    vulnerabilidades.push(' Precio permite valores negativos.');
  }

  // 3. Payload/XSS en descripción ES
  const payload = `<script>alert('XSS')</script>`;
  await prepararModal('TEST-XSS-ES');
  await page.fill('input[name="descripcionES"]', payload);
  await page.click('button.btn-primary:has-text("Crear")');
  await page.waitForTimeout(600);

  if (await page.locator('td:has-text("TEST-XSS-ES")').first().isVisible()) {
    vulnerabilidades.push(' Se acepta payload en descripción ES (XSS).');
  }

  // 4. Payload/XSS en descripción EN
  await prepararModal('TEST-XSS-EN');
  await page.fill('input[name="descripcionEN"]', payload);
  await page.click('button.btn-primary:has-text("Crear")');
  await page.waitForTimeout(600);

  if (await page.locator('td:has-text("TEST-XSS-EN")').first().isVisible()) {
    vulnerabilidades.push(' Se acepta payload en descripción EN (XSS).');
  }

  console.log('=== Vulnerabilidades detectadas ===');
  vulnerabilidades.forEach(v => console.log(v));

  // ⚠ Aquí viene la parte importante:
  // Si HAY vulnerabilidades => la prueba FALLA.
  expect(vulnerabilidades.length, vulnerabilidades.join('\n')).toBe(0);
});
