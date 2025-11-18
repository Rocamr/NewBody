import React from "react";
import { render } from "@testing-library/react";
import { CartProvider } from "../Vistas/CarritoContex.jsx"

test("no se rompe ante un valor malicioso simulado en localStorage", () => {
  // Simulación de ataque: dato corrupto en lugar de JSON válido
  window.localStorage.setItem("cart", "<<<ATAQUE_INVALIDO>>>");

  expect(() =>
    render(
      <CartProvider>
        <div>test</div>
      </CartProvider>
    )
  ).not.toThrow();
});
