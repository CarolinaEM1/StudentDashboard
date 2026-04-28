import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";

function Horario() {
  const [horario, setHorario] = useState([]);
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
    const fetchHorario = async () => {
      try {
        const response = await siiApi.get("/movil/estudiante/horarios");

        console.log("RESPUESTA HORARIO:", response.data);

        const arreglo = buscarArreglo(response.data);
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

  if (loading) {
    return (
      <div>
        <Navbar />
        <h2>Cargando horario...</h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <h1>Horario del semestre</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Grupo</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
            <th>Sábado</th>
          </tr>
        </thead>

        <tbody>
          {horario.map((item, index) => (
            <tr key={index}>
              <td>
                <strong>{item.nombre_materia}</strong>
                <br />
                <small>{item.clave_materia}</small>
              </td>

              <td>{item.letra_grupo}</td>

              <td>
                {item.lunes || "Sin clase"}
                <br />
                <small>{item.lunes_clave_salon || ""}</small>
              </td>

              <td>
                {item.martes || "Sin clase"}
                <br />
                <small>{item.martes_clave_salon || ""}</small>
              </td>

              <td>
                {item.miercoles || "Sin clase"}
                <br />
                <small>{item.miercoles_clave_salon || ""}</small>
              </td>

              <td>
                {item.jueves || "Sin clase"}
                <br />
                <small>{item.jueves_clave_salon || ""}</small>
              </td>

              <td>
                {item.viernes || "Sin clase"}
                <br />
                <small>{item.viernes_clave_salon || ""}</small>
              </td>

              <td>
                {item.sabado || "Sin clase"}
                <br />
                <small>{item.sabado_clave_salon || ""}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {horario.length === 0 && <p>No se encontraron clases.</p>}
    </div>
  );
}

export default Horario;