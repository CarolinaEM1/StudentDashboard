import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import siiApi from "../api/siiApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 Si ya hay token, manda directo al dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Completa todos los campos");
    return;
  }

  try {
    setLoading(true);

    const response = await siiApi.post("/login", {
      email: email,
      password: password,
    });

    console.log("RESPUESTA LOGIN:", response.data);

    const token =
      response.data?.token ||
      response.data?.access_token ||
      response.data?.message?.token ||
      response.data?.message?.login?.token ||
      response.data?.data?.token;

    if (!token) {
      setError("Login correcto, pero no se encontró el token. Revisa la consola.");
      return;
    }

    localStorage.setItem("token", token);
    navigate("/dashboard");
  } catch (err) {
    console.log("ERROR LOGIN:", err.response?.data || err.message);
    setError("No se pudo iniciar sesión. Revisa la consola.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Login SII ITC</h1>

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;