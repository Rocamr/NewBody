import { render, act } from "@testing-library/react";
import React from "react";
import { CartProvider, CartContext } from "../Vistas/CarritoContex";
import { sha256 } from "js-sha256";
import { act } from "@testing-library/react";
jest.spyOn(console, "warn").mockImplementation(() => {});
const TestReader = ({ callback }) => {
  const ctx = React.useContext(CartContext);
  callback(ctx);
  return null;
};

let ctx = null;

function setup() {
  ctx = null;
  Storage.prototype.getItem = jest.fn(() => null);
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();

  render(
    <CartProvider>
      <TestReader callback={(c) => (ctx = c)} />
    </CartProvider>
  );
}
//
// TEST  – Sanitización: no permite strings peligrosos
//
test("sanitiza strings que contienen código HTML peligroso", () => {
  setup();

  act(() => {
    ctx.addToCart({
      id: "1",
      nombre: "<script>alert('XSS')</script>",
      precio: 10,
      imagen: "<img src=x onerror=alert(1)>",
    });
  });

  expect(ctx.cart[0].nombre.includes("<")).toBe(false);
  expect(ctx.cart[0].imagen.includes("<")).toBe(false);
});

//
// TEST 8 – Integridad en localStorage: escribe hash válido
//
test("saveCart guarda un hash válido de la data", () => {
  setup();

  act(() => {
    ctx.addToCart({ id: "1", nombre: "Y", precio: 10 }, 1);
  });

  const savedCart = Storage.prototype.setItem.mock.calls.find(
    (call) => call[0] === "secure_cart"
  )[1];

  const savedHash = Storage.prototype.setItem.mock.calls.find(
    (call) => call[0] === "secure_cart_hash"
  )[1];

  expect(savedHash).toBe(sha256(savedCart)); // coincide el hash exacto
});
