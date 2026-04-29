import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/avisos.css";

const avisosIniciales = [
  {
    id: 1,
    titulo: "Periodo de reinscripción",
    categoria: "Académico",
    fecha: "2026-05-10",
    descripcion:
      "Consulta las fechas oficiales para realizar tu proceso de reinscripción del siguiente semestre.",
  },
  {
    id: 2,
    titulo: "Convocatoria de becas",
    categoria: "Becas",
    fecha: "2026-05-15",
    descripcion:
      "Ya se encuentra disponible la información para aplicar a los programas de apoyo estudiantil.",
  },
  {
    id: 3,
    titulo: "Semana de conferencias tecnológicas",
    categoria: "Eventos",
    fecha: "2026-05-22",
    descripcion:
      "Participa en conferencias, talleres y actividades enfocadas en innovación y desarrollo tecnológico.",
  },
];

function Avisos() {
  const [avisos, setAvisos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("avisosUniversitarios"));

    if (guardados && guardados.length > 0) {
      setAvisos(guardados);
    } else {
      localStorage.setItem(
        "avisosUniversitarios",
        JSON.stringify(avisosIniciales)
      );
      setAvisos(avisosIniciales);
    }
  }, []);

  const filtrados = avisos.filter((aviso) => {
    const texto = `${aviso.titulo} ${aviso.categoria} ${aviso.descripcion}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="announcements-page">
      <Navbar />

      <main className="announcements-container">
        <section className="announcements-hero">
          <div>
            <span className="announcements-label">Comunidad estudiantil</span>
            <h1>Avisos Universitarios</h1>
            <p>
              Consulta comunicados importantes, eventos, fechas académicas y
              noticias relevantes para estudiantes.
            </p>
          </div>

          <div className="announcements-hero-card">
            <span>Total de avisos</span>
            <h2>{avisos.length}</h2>
            <p>Comunicados disponibles</p>
          </div>
        </section>

        <section className="announcements-panel">
          <div className="announcements-toolbar">
            <div>
              <h2>Comunicados recientes</h2>
              <p>Busca por título, categoría o contenido.</p>
            </div>

            <input
              type="text"
              placeholder="Buscar aviso..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="announcements-grid">
            {filtrados.map((aviso) => (
              <article className="announcement-card" key={aviso.id}>
                <div className="announcement-top">
                  <span>{aviso.categoria}</span>
                  <small>{aviso.fecha}</small>
                </div>

                <h3>{aviso.titulo}</h3>
                <p>{aviso.descripcion}</p>
              </article>
            ))}
          </div>

          {filtrados.length === 0 && (
            <p className="announcements-empty">No se encontraron avisos.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Avisos;