import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./inicio.css";

export default function Login() {
  const navigate = useNavigate();
  const auth = getAuth();
  const correoSeguro = import.meta.env.VITE_EMAIL_SEGURO;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Intentos fallidos que sobreviven recargas
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(localStorage.getItem("failedAttempts") || "0", 10);
  });

  // Bloqueo temporal del botón mientras se ejecuta delay
  const [locked, setLocked] = useState(false);

  // Logout automático apenas se entra a la pantalla
  useEffect(() => {
    auth.signOut();
  }, []);

  const saveAttempts = (v) => {
    setFailedAttempts(v);
    localStorage.setItem("failedAttempts", v.toString());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Bloqueo duro por demasiados intentos
    if (failedAttempts >= 6) {
      setErrorMsg("Demasiados intentos fallidos. Intenta de nuevo más tarde.");
      return;
    }

    setLocked(true);

    // Delay progresivo antes de enviar
    if (failedAttempts > 0) {
      const delay = Math.min(failedAttempts * 1500, 8000);
      await new Promise((res) => setTimeout(res, delay));
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      if (
        correoSeguro &&
        user.email &&
        user.email.trim().toLowerCase() === correoSeguro.trim().toLowerCase()
      ) {
        saveAttempts(0); // reset
        navigate("/productos");
      } else {
        saveAttempts(failedAttempts + 1);
        auth.signOut();
        setErrorMsg("No tienes permiso para acceder.");
      }
    } catch (err) {
      saveAttempts(failedAttempts + 1);
      setErrorMsg("Correo o contraseña incorrectos");
    }

    setLocked(false);
  };

  return (
    <div className="container-login">
      <div className="card-login">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin} className="form-login">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-login"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-login"
            required
          />

          <button type="submit" className="btn-login" disabled={locked}>
            {locked ? "Procesando..." : "Ingresar"}
          </button>

          {errorMsg && <p className="error-login">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}
