import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";

function Horario() {
  const [horario, setHorario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buscarArregloHorario = (obj) => {
    if (Array.isArray(obj)) {
      if (
        obj.length > 0 &&
        obj[0]?.nombre_materia &&
        (
          "lunes" in obj[0] ||
          "martes" in obj[0] ||
          "miercoles" in obj[0] ||
          "jueves" in obj[0] ||
          "viernes" in obj[0] ||
          "sabado" in obj[0]
        )
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

        console.log("RESPUESTA HORARIO:", response.data);

        const arreglo = buscarArregloHorario(response.data);

        if (!arreglo) {
          setError("No se encontró el horario.");
          setHorario([]);
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

  const mostrarClase = (hora, salon) => {
    if (!hora) return "Sin clase";

    return (
      <>
        <strong>{hora}</strong>
        <br />
        <small>{salon || "Sin salón"}</small>
      </>
    );
  };

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

              <td>{mostrarClase(item.lunes, item.lunes_clave_salon)}</td>
              <td>{mostrarClase(item.martes, item.martes_clave_salon)}</td>
              <td>{mostrarClase(item.miercoles, item.miercoles_clave_salon)}</td>
              <td>{mostrarClase(item.jueves, item.jueves_clave_salon)}</td>
              <td>{mostrarClase(item.viernes, item.viernes_clave_salon)}</td>
              <td>{mostrarClase(item.sabado, item.sabado_clave_salon)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {horario.length === 0 && <p>No se encontraron clases.</p>}
    </div>
  );
}

export default Horario;