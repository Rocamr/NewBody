import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_SEGURO_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_SEGURO_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_SEGURO_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_SEGURO_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SEGURO_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_SEGURO_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_SEGURO_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const uploadImageToStorage = async (file, folderName) => {
  const storageRef = ref(storage, `${folderName}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export { app, db, auth, storage, uploadImageToStorage };
