import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// -------------------------------
// FIX DE SEGURIDAD
// Validación estricta antes de subir archivos
// -------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB máximo

const uploadImageToStorage = async (file, folderName) => {
  // 1. Validar existencia
  if (!file || !file.type || !file.name) {
    throw new Error("Invalid file");
  }

  // 2. Validar tipo MIME
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  // 3. Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image file too large");
  }

  // 4. Sanitizar nombre
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");

  const storageRef = ref(storage, `${folderName}/${safeName}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

export { app, db, storage, uploadImageToStorage };