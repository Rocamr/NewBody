import { test, expect } from '@playwright/test';

test.setTimeout(120000); // ampliamos tiempo porque hay delays reales

test('Prueba de fuerza bruta con tiempo por intento (20 intentos, solo passwords incorrectas)', async ({ page }) => {
  const URL = 'http://localhost:5173/login';
  const intentos = 10;

  const startGlobal = Date.now();
  let bloqueoDetectado = false;
  let intentoBloqueo = null;

  for (let i = 1; i <= intentos; i++) {
    console.log(`\nIntento #${i}`);

    await page.goto(URL);

    const randomEmail = `fuerza_${Math.random().toString(36).slice(2)}@mail.com`;
    await page.fill('input[type="email"]', randomEmail);
    await page.fill('input[type="password"]', `pw_incorrecta_${i}`);

    const startIntento = Date.now();

    // Si el botón ya NO está habilitado antes de enviar → bloqueo total
    const btn = page.locator('button.btn-login');
    const enabledBefore = await btn.isEnabled();

    if (!enabledBefore) {
      console.log(`🔒 Bloqueo detectado ANTES de enviar en el intento #${i}`);
      bloqueoDetectado = true;
      intentoBloqueo = i;
      break;
    }

    // Esperar que esté habilitado (primer carga)
    await page.waitForSelector('button.btn-login:not([disabled])');

    await page.click('button.btn-login'); // enviar

    // Botón debe deshabilitarse durante el delay progresivo
    await page.waitForSelector('button.btn-login[disabled]', { timeout: 10000 });

    // Ahora esperamos que vuelva a habilitarse O se declare bloqueo
    let botonSeHabilita = true;
    try {
      await page.waitForSelector('button.btn-login:not([disabled])', { timeout: 20000 });
    } catch {
      botonSeHabilita = false;
    }

    if (!botonSeHabilita) {
      console.log(`🔒 Bloqueo total detectado en intento #${i}`);
      bloqueoDetectado = true;
      intentoBloqueo = i;
      break;
    }

    // Validar error visible
    const errorVisible = await page.locator('.error-login').isVisible();
    console.log(`Tiempo del intento: ${(Date.now() - startIntento) / 1000} segundos`);
    expect(errorVisible).toBeTruthy();
  }

  const totalTime = (Date.now() - startGlobal) / 1000;

  console.log(`\nTiempo total de la prueba: ${totalTime} segundos`);
  console.log(`Bloqueo detectado: ${bloqueoDetectado}`);
  if (intentoBloqueo) console.log(`Bloqueo ocurrió en el intento #${intentoBloqueo}`);

  // Si hubo bloqueo → prueba exitosa
  if (bloqueoDetectado) {
    expect(bloqueoDetectado).toBeTruthy();
    return;
  }

  // Si no hubo bloqueo → debe tardar bastante por delays crecientes
  expect(totalTime).toBeGreaterThan(8);
});
