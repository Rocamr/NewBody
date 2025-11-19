import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock correcto: esta ruta DEBE coincidir con el import real dentro de ProductosControl.jsx
vi.mock("../src/Extras/navbar.jsx", () => ({
  default: () => <div data-testid="navbar-mock" />
}));

// Importamos tu componente real
import ProductosControl from "../src/Vistas/ProductosControl.jsx";

describe("ProductosControl - PRUEBA ANTES DEL FIX", () => {
  it("DEBERÍA bloquear URLs externas maliciosas... pero NO lo hace (vulnerable)", () => {

    const fakeProduct = {
      id: "123",
      nombre: "Producto Test",
      descripcion: "Desc",
      imagen: "https://malicioso.com/track"
    };

    render(<ProductosControl productos={[fakeProduct]} />);

    // Esperaríamos en una versión segura que NO se renderice la imagen
    const img = screen.queryByRole("img");

    // Pero la versión vulnerable la renderiza -> generamos fallo
    expect(img).toBeNull();
  });
});