import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  const [isAllowed, setIsAllowed] = useState(null);
  const correo = import.meta.env.VITE_EMAIL_SEGURO

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email === correo) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    });
  }, []);

  if (isAllowed === null) return null;

  return isAllowed ? children : <Navigate to="/login" replace />;
}
