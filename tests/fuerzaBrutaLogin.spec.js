import { test, expect } from '@playwright/test';

test('Fuerza bruta con correo y contraseña totalmente aleatorios (20 intentos)', async ({ page }) => {
  const URL = 'http://localhost:5173/login';

  const intentos = 20;
  let exito = false;

  const startTotal = Date.now();

  for (let i = 1; i <= intentos; i++) {
    const intentoStart = Date.now();

    console.log(`\nIntento #${i}`);

    const correoRandom = `${Math.random().toString(36).substring(2, 10)}@test.com`;
    const passRandom = `pass_${Math.random().toString(36).substring(2, 12)}`;

    await page.goto(URL);

    await page.fill('input[type="email"]', correoRandom);
    await page.fill('input[type="password"]', passRandom);

    await page.click('button.btn-login');

    await page.waitForTimeout(300);

    const errorVisible = await page.locator('.error-login').isVisible();

    const intentoTime = ((Date.now() - intentoStart) / 1000).toFixed(3);
    console.log(`Tiempo del intento: ${intentoTime} segundos`);

    // Si por alguna razón **NO aparece el error**, significa que el login aceptó credenciales basura
    if (!errorVisible) {
      exito = true;
      console.log(`⚠️ Login aceptado con correo y password RANDOM en el intento #${i}`);
      break;
    }
  }

  const totalTime = (Date.now() - startTotal) / 1000;

  console.log(`\nTiempo total de la prueba: ${totalTime} segundos`);
  console.log(`Login exitoso inesperado: ${exito}`);

  expect(exito).toBeFalsy();
  expect(totalTime).toBeLessThan(5);
});
