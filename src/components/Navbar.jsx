import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav>
      <Link to="/dashboard">Inicio</Link>{" | "}
      <Link to="/calificaciones">Calificaciones</Link>{" | "}
      <Link to="/kardex">Kardex</Link>{" | "}
      <Link to="/horario">Horario</Link>{" | "}
      <button onClick={logout}>Cerrar sesión</button>
    </nav>
  );
}

export default Navbar;