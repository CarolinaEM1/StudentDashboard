import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import siiApi from "../api/siiApi";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const response = await siiApi.post("/login", {
        email,
        password,
      });

      const token =
        response.data?.token ||
        response.data?.access_token ||
        response.data?.message?.token ||
        response.data?.message?.login?.token ||
        response.data?.data?.token;

      if (!token) {
        setError("No se encontró el token de autenticación.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      console.log("ERROR LOGIN:", err.response?.data || err.message);
      setError("Credenciales incorrectas o servidor no disponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-left">
        <div className="login-badge">SII ITC</div>

        <h1>Portal Académico Estudiantil</h1>

        <p>
          Consulta tu información académica, calificaciones, kardex y horario
          desde una interfaz moderna y sencilla.
        </p>

        <div className="login-features">
          <div>
            <span>✓</span>
            Acceso seguro con token
          </div>
          <div>
            <span>✓</span>
            Información académica en tiempo real
          </div>
          <div>
            <span>✓</span>
            Dashboard personalizado
          </div>
        </div>
      </section>

      <section className="login-right">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-icon">🎓</div>

          <h2>Iniciar sesión</h2>
          <p className="login-subtitle">
            Ingresa con tus credenciales institucionales
          </p>

          <label>Correo institucional</label>
          <input
            type="email"
            placeholder="20031299@celaya.tecnm.mx"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Entrar al sistema"}
          </button>

          <p className="login-footer">
            Sistema académico del Instituto Tecnológico de Celaya
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;