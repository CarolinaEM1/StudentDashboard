import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">🎓</div>
        <div>
          <h2>SII ITC</h2>
          <span>Student Portal</span>
        </div>
      </div>

      <nav className="navbar-links">
        <NavLink to="/dashboard">Inicio</NavLink>
        <NavLink to="/calificaciones">Calificaciones</NavLink>
        <NavLink to="/kardex">Kardex</NavLink>
        <NavLink to="/horario">Horario</NavLink>
        <NavLink to="/avisos">Avisos</NavLink>
        <NavLink to="/admin-avisos">Admin</NavLink>
      </nav>

      <button className="logout-btn" onClick={logout}>
        Cerrar sesión
      </button>
    </header>
  );
}

export default Navbar;