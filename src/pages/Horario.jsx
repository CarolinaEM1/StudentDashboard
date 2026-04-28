import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";
import "../styles/horario.css";

function Horario() {
  const [horario, setHorario] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dias = [
    { key: "lunes", label: "Lunes", salon: "lunes_clave_salon" },
    { key: "martes", label: "Martes", salon: "martes_clave_salon" },
    { key: "miercoles", label: "Miércoles", salon: "miercoles_clave_salon" },
    { key: "jueves", label: "Jueves", salon: "jueves_clave_salon" },
    { key: "viernes", label: "Viernes", salon: "viernes_clave_salon" },
    { key: "sabado", label: "Sábado", salon: "sabado_clave_salon" },
  ];

  const buscarArregloHorario = (obj) => {
    if (Array.isArray(obj)) {
      if (
        obj.length > 0 &&
        obj[0]?.nombre_materia &&
        ("lunes" in obj[0] ||
          "martes" in obj[0] ||
          "miercoles" in obj[0] ||
          "jueves" in obj[0] ||
          "viernes" in obj[0] ||
          "sabado" in obj[0])
      ) {
        return obj;
      }
    }

    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        const resultado = buscarArregloHorario(obj[key]);
        if (resultado) return resultado;
      }
    }

    return null;
  };

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const response = await siiApi.get("/movil/estudiante/horarios");

        const arreglo = buscarArregloHorario(response.data);

        if (!arreglo) {
          setError("No se encontró el horario.");
          return;
        }

        setHorario(arreglo);
      } catch (err) {
        console.log("ERROR HORARIO:", err.response?.data || err.message);
        setError("No se pudo cargar el horario.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorario();
  }, []);

  const filtradas = horario.filter((item) => {
    const texto = `${item.nombre_materia} ${item.clave_materia} ${item.letra_grupo}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const totalMaterias = horario.length;

  const clasesAsignadas = horario.reduce((acc, item) => {
    const count = dias.filter((dia) => item[dia.key]).length;
    return acc + count;
  }, 0);

  const materiasSinHorario = horario.filter(
    (item) => !dias.some((dia) => item[dia.key])
  ).length;

  const clasesPorDia = dias.map((dia) => ({
    ...dia,
    total: horario.filter((item) => item[dia.key]).length,
  }));

  const renderClase = (item, dia) => {
    const hora = item[dia.key];
    const salon = item[dia.salon];

    if (!hora) {
      return <span className="schedule-empty">No asignado</span>;
    }

    return (
      <div className="schedule-time-card">
        <strong>{hora}</strong>
        <small>{salon || "Sin salón"}</small>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="schedule-page">
        <Navbar />
        <div className="schedule-loader">Cargando horario...</div>
      </div>
    );
  }

  return (
    <div className="schedule-page">
      <Navbar />

      <main className="schedule-container">
        <section className="schedule-hero">
          <div>
            <span className="schedule-label">Agenda académica</span>
            <h1>Horario del semestre</h1>
            <p>
              Visualiza tus materias organizadas por día, hora y salón para
              consultar rápidamente tu agenda semanal.
            </p>
          </div>

          <div className="schedule-hero-card">
            <span>Clases asignadas</span>
            <h2>{clasesAsignadas}</h2>
            <p>Registros de horario durante la semana</p>
          </div>
        </section>

        <section className="schedule-stats">
          <div className="schedule-stat-card">
            <span>Materias</span>
            <h3>{totalMaterias}</h3>
            <p>Total registradas</p>
          </div>

          <div className="schedule-stat-card">
            <span>Con horario</span>
            <h3>{totalMaterias - materiasSinHorario}</h3>
            <p>Materias con al menos un día asignado</p>
          </div>

          <div className="schedule-stat-card warning">
            <span>Sin horario</span>
            <h3>{materiasSinHorario}</h3>
            <p>Materias no asignadas en el sistema</p>
          </div>
        </section>

        <section className="week-overview">
          <div className="week-title">
            <h2>Resumen semanal</h2>
            <p>Distribución de clases por día.</p>
          </div>

          <div className="week-grid">
            {clasesPorDia.map((dia) => (
              <div className="day-card" key={dia.key}>
                <span>{dia.label}</span>
                <strong>{dia.total}</strong>
                <small>{dia.total === 1 ? "clase" : "clases"}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="schedule-panel">
          <div className="schedule-toolbar">
            <div>
              <h2>Detalle del horario</h2>
              <p>Busca por materia, clave o grupo.</p>
            </div>

            <input
              type="text"
              placeholder="Buscar materia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {error && <div className="schedule-error">{error}</div>}

          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Grupo</th>
                  {dias.map((dia) => (
                    <th key={dia.key}>{dia.label}</th>
                  ))}
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
                      <span className="schedule-group">
                        {item.letra_grupo || "N/A"}
                      </span>
                    </td>

                    {dias.map((dia) => (
                      <td key={dia.key}>{renderClase(item, dia)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtradas.length === 0 && (
            <p className="schedule-no-results">
              No se encontraron materias con ese filtro.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Horario;