import { describe, it, expect, vi } from "vitest";

// Mock necesario para que firebase.js cargue sin quejarse
vi.mock("firebase/storage", () => {
  return {
    getStorage: vi.fn(() => ({})),
    ref: vi.fn((storage, path) => ({ storage, path })),
    uploadBytes: vi.fn(async () => {}),
    getDownloadURL: vi.fn(async () => "https://fakeurl.test/file.png"),
  };
});

// Importar función real corregida
import { uploadImageToStorage } from "../src/Back/firebase.js";
import { uploadBytes } from "firebase/storage";

// -------------------------------
// PRUEBAS DESPUÉS DEL FIX
// -------------------------------

describe("uploadImageToStorage - PRUEBA DESPUÉS DEL FIX", () => {
  it("rechaza archivos que NO son imágenes", async () => {
    const fakeFile = {
      name: "malware.exe",
      type: "application/x-msdownload",
      size: 2048,
    };

    await expect(uploadImageToStorage(fakeFile, "testFolder")).rejects.toThrow(
      "Only image files are allowed"
    );

    expect(uploadBytes).not.toHaveBeenCalled();
  });

  it("acepta una imagen válida", async () => {
    const validFile = {
      name: "foto.png",
      type: "image/png",
      size: 1024,
    };

    await uploadImageToStorage(validFile, "testFolder");

    expect(uploadBytes).toHaveBeenCalled();
  });
});
