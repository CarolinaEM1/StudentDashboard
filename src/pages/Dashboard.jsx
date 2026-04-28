import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await siiApi.get("/movil/estudiante");
        setStudent(response.data.data);
      } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        setError("No se pudo cargar la información del estudiante.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="loader">Cargando información académica...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="error-box">{error}</div>
      </div>
    );
  }

  const promedio = Number(student.promedio_ponderado).toFixed(2);
  const avance = Number(student.porcentaje_avance || 0);

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">
        <section className="hero-card">
          <div className="hero-info">
            <span className="hero-badge">Portal Académico</span>
            <h1>Bienvenida, Carolina</h1>
            <p>
              Aquí puedes consultar tu información académica, avance de carrera,
              calificaciones, kardex y horario en un solo lugar.
            </p>

            <div className="hero-actions">
              <Link to="/calificaciones">Ver calificaciones</Link>
              <Link to="/horario" className="secondary-btn">Ver horario</Link>
            </div>
          </div>

          <div className="student-card">
            {student.foto ? (
              <img
                src={`data:image/jpeg;base64,${student.foto}`}
                alt="Foto del estudiante"
              />
            ) : (
              <div className="avatar-placeholder">🎓</div>
            )}

            <h2>{student.persona}</h2>
            <p>{student.numero_control}</p>
            <span>{student.email}</span>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card blue">
            <span>Semestre</span>
            <h3>{student.semestre}</h3>
            <p>Semestre actual registrado</p>
          </div>

          <div className="stat-card green">
            <span>Promedio</span>
            <h3>{promedio}</h3>
            <p>Promedio ponderado</p>
          </div>

          <div className="stat-card purple">
            <span>Créditos</span>
            <h3>{student.creditos_acumulados}</h3>
            <p>Créditos acumulados</p>
          </div>

          <div className="stat-card orange">
            <span>Materias</span>
            <h3>{student.materias_aprobadas}</h3>
            <p>Materias aprobadas</p>
          </div>
        </section>

        <section className="content-grid">
          <div className="progress-card">
            <div className="section-title">
              <h2>Avance académico</h2>
              <span>{avance}%</span>
            </div>

            <div className="progress-bar">
              <div style={{ width: `${avance}%` }}></div>
            </div>

            <div className="progress-details">
              <p>
                <strong>Materias cursadas:</strong> {student.materias_cursadas}
              </p>
              <p>
                <strong>Materias aprobadas:</strong> {student.materias_aprobadas}
              </p>
              <p>
                <strong>Materias reprobadas:</strong>{" "}
                {student.materias_reprobadas}
              </p>
            </div>
          </div>

          <div className="quick-card">
            <h2>Accesos rápidos</h2>

            <Link to="/calificaciones" className="quick-item">
              <div>📊</div>
              <span>Calificaciones</span>
              <small>Consulta tus unidades y promedio</small>
            </Link>

            <Link to="/kardex" className="quick-item">
              <div>📚</div>
              <span>Kardex</span>
              <small>Historial académico completo</small>
            </Link>

            <Link to="/horario" className="quick-item">
              <div>🗓️</div>
              <span>Horario</span>
              <small>Clases organizadas por día</small>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;