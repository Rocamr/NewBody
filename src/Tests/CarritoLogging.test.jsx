import React from "react";
import { render } from "@testing-library/react";
import { CartProvider } from "../Vistas/CarritoContex.jsx";

test("genera trazas de seguridad cuando el cart es inválido", () => {
  localStorage.clear();
  localStorage.setItem("cart", "<<<ATAQUE_INVALIDO>>>");

  render(
    <CartProvider>
      <div>test</div>
    </CartProvider>
  );

  const raw = localStorage.getItem("securityLogs");
  const logs = raw ? JSON.parse(raw) : [];

  console.log("TRACE securityLogs:", logs); 

  expect(Array.isArray(logs)).toBe(true);
  expect(logs.length).toBeGreaterThan(0);

  const last = logs[logs.length - 1];
  expect(last.type).toBe("INVALID_CART_JSON");
});
