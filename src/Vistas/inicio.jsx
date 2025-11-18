import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./inicio.css";

export default function Login() {
  const navigate = useNavigate();
  const auth = getAuth();
  const correo = import.meta.env.VITE_EMAIL_SEGURO

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user.email === correo) {
          navigate("/productos");
        } else {
          setErrorMsg("No tienes permiso para acceder.");
        }
      })
      .catch(() => {
        setErrorMsg("Correo o contraseña incorrectos");
      });
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

          <button type="submit" className="btn-login">Ingresar</button>

          {errorMsg && <p className="error-login">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}
