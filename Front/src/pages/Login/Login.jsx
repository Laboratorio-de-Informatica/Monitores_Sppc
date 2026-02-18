import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginApi } from "../../services/authService";
import { getUserFromToken } from "../../utils/jwt";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi(email, password);
      login(data.token);

      // Redirigir según rol
      const user = getUserFromToken(data.token);
      const dest = user?.role === "ADMIN" ? "/admin" : "/sessions";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.logo}>MoniTrack</h1>
        <p className={styles.subtitle}>Inicia sesión para continuar</p>

        <div className={styles.field}>
          <label htmlFor="email">Correo institucional</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="monitor@escuelaing.edu.co"
            autoComplete="username"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Ingresando…" : "Iniciar Sesión"}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
}
