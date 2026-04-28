import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";

function Calificaciones() {
  const [calificaciones, setCalificaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getValue = (obj, keys) => {
    for (let key of keys) {
      if (obj?.[key] !== undefined && obj?.[key] !== null) return obj[key];
    }
    return "No disponible";
  };

  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const response = await siiApi.get("/movil/estudiante/calificaciones");

        console.log("RESPUESTA CALIFICACIONES:", response.data);

        const data =
          response.data?.message?.calificaciones ||
          response.data?.calificaciones ||
          response.data?.data ||
          response.data?.message ||
          response.data;

        setCalificaciones(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("ERROR CALIFICACIONES:", err.response?.data || err.message);
        setError("No se pudieron cargar las calificaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalificaciones();
  }, []);

  const filtradas = calificaciones.filter((item) => {
    const materia = String(
      getValue(item, ["materia", "nombre_materia", "asignatura", "nombre"])
    ).toLowerCase();

    const periodo = String(
      getValue(item, ["periodo", "periodo_academico", "Periodo"])
    ).toLowerCase();

    return (
      materia.includes(busqueda.toLowerCase()) ||
      periodo.includes(busqueda.toLowerCase())
    );
  });

  const getColor = (calificacion) => {
    const cal = Number(calificacion);

    if (cal >= 90) return "green";
    if (cal >= 70) return "orange";
    return "red";
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <h2>Cargando calificaciones...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <h1>Calificaciones</h1>

      <input
        type="text"
        placeholder="Buscar por materia o periodo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Periodo</th>
            <th>Calificación final</th>
          </tr>
        </thead>

        <tbody>
          {filtradas.map((item, index) => {
            const materia = getValue(item, [
              "materia",
              "nombre_materia",
              "asignatura",
              "nombre",
            ]);

            const periodo = getValue(item, [
              "periodo",
              "periodo_academico",
              "Periodo",
            ]);

            const calificacion = getValue(item, [
              "calificacion",
              "calificacion_final",
              "final",
              "promedio",
            ]);

            return (
              <tr key={index}>
                <td>{materia}</td>
                <td>{periodo}</td>
                <td style={{ color: getColor(calificacion), fontWeight: "bold" }}>
                  {calificacion}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filtradas.length === 0 && <p>No se encontraron calificaciones.</p>}
    </div>
  );
}

export default Calificaciones;