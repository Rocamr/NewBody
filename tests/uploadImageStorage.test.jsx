import { describe, it, expect, vi } from "vitest";

// Mock de firebase/storage para evitar llamadas reales
vi.mock("firebase/storage", () => {
  return {
    getStorage: vi.fn(() => ({})), // ESTA FALTABA
    ref: vi.fn((storage, path) => ({ storage, path })),
    uploadBytes: vi.fn(async () => {}),
    getDownloadURL: vi.fn(async () => "https://fakeurl.test/file.png")
  };
});

// Importamos la función real existente
import { uploadImageToStorage } from "../src/Back/firebase.js";
import { uploadBytes } from "firebase/storage";

describe("uploadImageToStorage - PRUEBA ANTES DEL FIX", () => {
  it("DEBERÍA rechazar archivos no imagen... pero NO lo hace (vulnerable)", async () => {
    const fakeFile = {
      name: "malware.exe",
      type: "application/x-msdownload",
      size: 2048
    };

    let error = null;

    try {
      await uploadImageToStorage(fakeFile, "testFolder");
    } catch (e) {
      error = e;
    }

    // ❌ Esperábamos un error... pero la función vulnerable no lo lanza
    expect(error).not.toBeNull();

    // ❌ Y aun así intenta subirlo
    expect(uploadBytes).not.toHaveBeenCalled();
  });
});