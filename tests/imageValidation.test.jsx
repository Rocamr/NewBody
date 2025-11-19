import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock Navbar
vi.mock("../src/Extras/navbar.jsx", () => ({
  default: () => <div data-testid="navbar-mock"></div>
}));

// Mock Firestore
vi.mock("firebase/firestore", () => {
  return {
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    where: vi.fn()
  };
});

import { getDocs } from "firebase/firestore";
import ProductosControl from "../src/Vistas/ProductosControl.jsx";

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe("ProductosControl - PRUEBA DESPUÉS DEL FIX", () => {

  it("bloquea URLs externas no autorizadas", async () => {

    const productoMalicioso = {
      id: "123",
      data: () => ({
        nombre: "Test",
        precio: 100,
        descuento: 0,
        descripcionES: "desc",
        descripcionEN: "desc",
        codigobarras: "111",
        imagen: "https://malicioso.com/track"
      })
    };

    // React ejecuta el useEffect DOS veces → dos mocks
    getDocs
      .mockResolvedValueOnce({ docs: [productoMalicioso] })
      .mockResolvedValueOnce({ docs: [productoMalicioso] });

    render(<ProductosControl />);

    const msg = await screen.findByText(/Imagen no válida/i);
    expect(msg).toBeTruthy();

    const badImg = screen.queryByRole("img");
    expect(badImg).toBeNull();
  });

  it("permite imágenes válidas del dominio autorizado", async () => {

    const productoValido = {
      id: "456",
      data: () => ({
        nombre: "TestOK",
        precio: 50,
        descuento: 0,
        descripcionES: "desc",
        descripcionEN: "desc",
        codigobarras: "222",
        imagen: "https://firebasestorage.googleapis.com/imagen.png"
      })
    };

    // React ejecuta el useEffect DOS veces → dos mocks
    getDocs
      .mockResolvedValueOnce({ docs: [productoValido] })
      .mockResolvedValueOnce({ docs: [productoValido] });

    render(<ProductosControl />);

    const img = await screen.findByRole("img");
    expect(img).not.toBeNull();
  });
});