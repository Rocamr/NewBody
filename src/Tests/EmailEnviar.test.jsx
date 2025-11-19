import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de emailjs-com
vi.mock("emailjs-com", () => ({
  default: {
    send: vi.fn(() => Promise.resolve()),
  },
}));

// Mock de sweetalert2 para que no intente abrir modales reales en test
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock de los datos de configuración de EmailJS
vi.mock("../Back/emaill_data", () => ({
  wasa_email: {
    servicio: "test_service",
    template: "test_template",
    llave: "test_key",
  },
}));

import emailjs from "emailjs-com";
import sendConfirmationEmail from "../Extras/EmailEnviar";

describe("sendConfirmationEmail", () => {
  beforeEach(() => {
    emailjs.send.mockClear();
  });

  it("no debería enviar saltos de línea ni payload crudo al servicio de correo", async () => {
    const cart = [
      {
        imagen: "http://example.com/img.png",
        nombre: "Producto\n\n===== ALERTA FALSA =====\n\n",
        quantity: 2,
        precio: 10,
      },
    ];

    const buyer = {
      contactValue: "victima@example.com\nCC: atacante@example.com",
    };

    const showAlert = vi.fn();

    // IMPORTANTE: la función devuelve la Promise de emailjs.send
    await sendConfirmationEmail(cart, 20, buyer, showAlert);

    expect(emailjs.send).toHaveBeenCalledTimes(1);
    const [, , emailParams] = emailjs.send.mock.calls[0];

    // Con el código corregido, estos expects deben pasar
    expect(emailParams.email).not.toMatch(/[\r\n]/);
    emailParams.orders.forEach((order) => {
      expect(order.name).not.toMatch(/[\r\n]/);
    });
  });
});
