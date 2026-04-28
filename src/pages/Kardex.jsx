import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";
import "../styles/kardex.css";

function Kardex() {
  const [kardex, setKardex] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [semestreFiltro, setSemestreFiltro] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buscarArregloKardex = (obj) => {
    if (Array.isArray(obj)) {
      if (obj.length > 0 && obj[0]?.nombre_materia) return obj;
    }

    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        const resultado = buscarArregloKardex(obj[key]);
        if (resultado) return resultado;
      }
    }

    return null;
  };

  useEffect(() => {
    const fetchKardex = async () => {
      try {
        const response = await siiApi.get("/movil/estudiante/kardex");
        const arreglo = buscarArregloKardex(response.data);

        if (!arreglo) {
          setError("No se encontró la información del kardex.");
          return;
        }

        setKardex(arreglo);
      } catch (err) {
        console.log("ERROR KARDEX:", err.response?.data || err.message);
        setError("No se pudo cargar el kardex.");
      } finally {
        setLoading(false);
      }
    };

    fetchKardex();
  }, []);

  const getEstadoClass = (calificacion) => {
    const cal = Number(calificacion);
    if (cal >= 90) return "kardex-badge excellent";
    if (cal >= 70) return "kardex-badge approved";
    return "kardex-badge risk";
  };

  const getEstadoText = (calificacion) => {
    const cal = Number(calificacion);
    if (cal >= 90) return "Excelente";
    if (cal >= 70) return "Aprobada";
    return "Riesgo";
  };

  const semestres = [
    ...new Set(kardex.map((item) => item.semestre).filter(Boolean)),
  ].sort((a, b) => Number(a) - Number(b));

  const filtradas = kardex.filter((item) => {
    const texto = `${item.nombre_materia} ${item.clave_materia} ${item.periodo} ${item.descripcion}`.toLowerCase();

    const coincideBusqueda = texto.includes(busqueda.toLowerCase());

    const coincideSemestre =
      semestreFiltro === "todos" ||
      String(item.semestre) === String(semestreFiltro);

    return coincideBusqueda && coincideSemestre;
  });

  const creditosTotales = kardex.reduce(
    (acc, item) => acc + Number(item.creditos || 0),
    0
  );

  const materiasAprobadas = kardex.filter(
    (item) => Number(item.calificacion) >= 70
  ).length;

  const promedioGeneral =
    kardex.length > 0
      ? (
          kardex.reduce((acc, item) => acc + Number(item.calificacion || 0), 0) /
          kardex.length
        ).toFixed(1)
      : "N/A";

  if (loading) {
    return (
      <div className="kardex-page">
        <Navbar />
        <div className="kardex-loader">Cargando historial académico...</div>
      </div>
    );
  }

  return (
    <div className="kardex-page">
      <Navbar />

      <main className="kardex-container">
        <section className="kardex-hero">
          <div>
            <span className="kardex-label">Historial académico</span>
            <h1>Kardex Académico</h1>
            <p>
              Consulta tu trayectoria escolar completa, materias cursadas,
              calificaciones, créditos y periodos académicos.
            </p>
          </div>

          <div className="kardex-hero-card">
            <span>Promedio histórico</span>
            <h2>{promedioGeneral}</h2>
            <p>Promedio general del kardex</p>
          </div>
        </section>

        <section className="kardex-stats">
          <div className="kardex-stat-card">
            <span>Materias registradas</span>
            <h3>{kardex.length}</h3>
            <p>Total en historial académico</p>
          </div>

          <div className="kardex-stat-card">
            <span>Materias aprobadas</span>
            <h3>{materiasAprobadas}</h3>
            <p>Con calificación aprobatoria</p>
          </div>

          <div className="kardex-stat-card">
            <span>Créditos acumulados</span>
            <h3>{creditosTotales}</h3>
            <p>Suma de créditos del kardex</p>
          </div>
        </section>

        <section className="kardex-panel">
          <div className="kardex-toolbar">
            <div>
              <h2>Detalle del historial</h2>
              <p>Filtra por materia, clave, periodo o semestre.</p>
            </div>

            <div className="kardex-filters">
              <input
                type="text"
                placeholder="Buscar materia..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <select
                value={semestreFiltro}
                onChange={(e) => setSemestreFiltro(e.target.value)}
              >
                <option value="todos">Todos los semestres</option>
                {semestres.map((semestre) => (
                  <option key={semestre} value={semestre}>
                    Semestre {semestre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="kardex-error">{error}</div>}

          <div className="kardex-table-wrapper">
            <table className="kardex-table">
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Semestre</th>
                  <th>Periodo</th>
                  <th>Créditos</th>
                  <th>Calificación</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {filtradas.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{item.nombre_materia}</strong>
                      <small>{item.clave_materia}</small>
                    </td>

                    <td>
                      <span className="semester-pill">{item.semestre}</span>
                    </td>

                    <td>{item.periodo}</td>

                    <td>
                      <span className="credits-pill">{item.creditos}</span>
                    </td>

                    <td>
                      <strong className="kardex-grade">
                        {item.calificacion}
                      </strong>
                    </td>

                    <td>{item.descripcion}</td>

                    <td>
                      <span className={getEstadoClass(item.calificacion)}>
                        {getEstadoText(item.calificacion)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtradas.length === 0 && (
            <p className="kardex-no-results">
              No se encontraron materias con esos filtros.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Kardex;