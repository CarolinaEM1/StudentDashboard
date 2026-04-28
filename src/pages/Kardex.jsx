import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";

function Kardex() {
  const [kardex, setKardex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buscarArreglo = (obj) => {
    if (Array.isArray(obj)) return obj;

    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        const resultado = buscarArreglo(obj[key]);
        if (resultado.length) return resultado;
      }
    }

    return [];
  };

  useEffect(() => {
    const fetchKardex = async () => {
      try {
        const response = await siiApi.get("/movil/estudiante/kardex");

        console.log("RESPUESTA KARDEX:", response.data);

        const arreglo = buscarArreglo(response.data);

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

  if (loading) {
    return (
      <div>
        <Navbar />
        <h2>Cargando kardex...</h2>
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

      <h1>Kardex Académico</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Clave</th>
            <th>Semestre</th>
            <th>Créditos</th>
            <th>Periodo</th>
            <th>Calificación</th>
            <th>Tipo</th>
          </tr>
        </thead>

        <tbody>
          {kardex.map((item, index) => (
            <tr key={index}>
              <td>{item.nombre_materia}</td>
              <td>{item.clave_materia}</td>
              <td>{item.semestre}</td>
              <td>{item.creditos}</td>
              <td>{item.periodo}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color:
                    Number(item.calificacion) >= 90
                      ? "green"
                      : Number(item.calificacion) >= 70
                      ? "orange"
                      : "red",
                }}
              >
                {item.calificacion}
              </td>
              <td>{item.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {kardex.length === 0 && <p>No se encontraron materias en el kardex.</p>}
    </div>
  );
}

export default Kardex;