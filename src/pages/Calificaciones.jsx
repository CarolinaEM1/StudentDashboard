import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";
import "../styles/calificaciones.css";

function Calificaciones() {
  const [calificaciones, setCalificaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buscarArregloCalificaciones = (obj) => {
    if (Array.isArray(obj)) {
      if (obj.length > 0 && obj[0]?.materia) return obj;
    }

    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        const resultado = buscarArregloCalificaciones(obj[key]);
        if (resultado) return resultado;
      }
    }

    return null;
  };

  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const response = await siiApi.get("/movil/estudiante/calificaciones");
        const arreglo = buscarArregloCalificaciones(response.data);

        if (!arreglo) {
          setError("No se encontró el arreglo de calificaciones.");
          return;
        }

        setCalificaciones(arreglo);
      } catch (err) {
        console.log("ERROR CALIFICACIONES:", err.response?.data || err.message);
        setError("No se pudieron cargar las calificaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalificaciones();
  }, []);

  const getPromedio = (lista) => {
    const validas = lista
      ?.map((item) => Number(item.calificacion))
      .filter((cal) => !isNaN(cal));

    if (!validas || validas.length === 0) return "Sin calificar";

    const suma = validas.reduce((acc, cal) => acc + cal, 0);
    return (suma / validas.length).toFixed(1);
  };

  const getEstado = (promedio) => {
    const cal = Number(promedio);

    if (isNaN(cal)) return "Pendiente";
    if (cal >= 90) return "Excelente";
    if (cal >= 70) return "Aprobado";
    return "Riesgo";
  };

  const getBadgeClass = (promedio) => {
    const cal = Number(promedio);

    if (isNaN(cal)) return "badge pending";
    if (cal >= 90) return "badge excellent";
    if (cal >= 70) return "badge approved";
    return "badge risk";
  };

  const filtradas = calificaciones.filter((item) => {
    const nombre = item.materia?.nombre_materia?.toLowerCase() || "";
    const clave = item.materia?.clave_materia?.toLowerCase() || "";
    const grupo = item.materia?.letra_grupo?.toLowerCase() || "";

    return (
      nombre.includes(busqueda.toLowerCase()) ||
      clave.includes(busqueda.toLowerCase()) ||
      grupo.includes(busqueda.toLowerCase())
    );
  });

  const materiasConPromedio = calificaciones.map((item) =>
    getPromedio(item.calificaiones || item.calificaciones || [])
  );

  const promediosValidos = materiasConPromedio
    .map(Number)
    .filter((num) => !isNaN(num));

  const promedioGeneral =
    promediosValidos.length > 0
      ? (
          promediosValidos.reduce((acc, num) => acc + num, 0) /
          promediosValidos.length
        ).toFixed(1)
      : "N/A";

  const materiasRiesgo = promediosValidos.filter((num) => num < 70).length;

  if (loading) {
    return (
      <div className="grades-page">
        <Navbar />
        <div className="grades-loader">Cargando calificaciones...</div>
      </div>
    );
  }

  return (
    <div className="grades-page">
      <Navbar />

      <main className="grades-container">
        <section className="grades-hero">
          <div>
            <span className="grades-badge">Seguimiento académico</span>
            <h1>Calificaciones</h1>
            <p>
              Consulta tus materias, calificaciones por unidad y desempeño
              general del semestre.
            </p>
          </div>

          <div className="grades-summary-card">
            <span>Promedio general</span>
            <h2>{promedioGeneral}</h2>
            <p>Calculado con las materias calificadas</p>
          </div>
        </section>

        <section className="grades-stats">
          <div className="grade-stat-card">
            <span>Total de materias</span>
            <h3>{calificaciones.length}</h3>
            <p>Materias registradas</p>
          </div>

          <div className="grade-stat-card">
            <span>Evaluadas</span>
            <h3>{promediosValidos.length}</h3>
            <p>Con al menos una calificación</p>
          </div>

          <div className="grade-stat-card danger">
            <span>En riesgo</span>
            <h3>{materiasRiesgo}</h3>
            <p>Promedio menor a 70</p>
          </div>
        </section>

        <section className="grades-panel">
          <div className="grades-toolbar">
            <div>
              <h2>Detalle por materia</h2>
              <p>Busca por nombre, clave o grupo.</p>
            </div>

            <input
              type="text"
              placeholder="Buscar materia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {error && <div className="grades-error">{error}</div>}

          <div className="grades-table-wrapper">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Grupo</th>
                  <th>Unidad 1</th>
                  <th>Unidad 2</th>
                  <th>Unidad 3</th>
                  <th>Unidad 4</th>
                  <th>Promedio</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {filtradas.map((item, index) => {
                  const lista =
                    item.calificaiones || item.calificaciones || [];

                  const promedio = getPromedio(lista);

                  return (
                    <tr key={index}>
                      <td>
                        <strong>{item.materia?.nombre_materia}</strong>
                        <small>{item.materia?.clave_materia}</small>
                      </td>

                      <td>
                        <span className="group-pill">
                          {item.materia?.letra_grupo || "N/A"}
                        </span>
                      </td>

                      {[0, 1, 2, 3].map((i) => (
                        <td key={i}>
                          <span
                            className={
                              lista[i]?.calificacion
                                ? "unit-grade"
                                : "unit-pending"
                            }
                          >
                            {lista[i]?.calificacion ?? "Pendiente"}
                          </span>
                        </td>
                      ))}

                      <td>
                        <strong className="average-text">{promedio}</strong>
                      </td>

                      <td>
                        <span className={getBadgeClass(promedio)}>
                          {getEstado(promedio)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtradas.length === 0 && (
            <p className="no-results">No se encontraron materias.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Calificaciones;