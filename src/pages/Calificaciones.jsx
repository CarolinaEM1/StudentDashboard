import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";

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

        console.log("RESPUESTA CALIFICACIONES:", response.data);

        const arreglo = buscarArregloCalificaciones(response.data);

        if (!arreglo) {
          setError("No se encontró el arreglo de calificaciones.");
          setCalificaciones([]);
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

  const getColor = (promedio) => {
    const cal = Number(promedio);

    if (isNaN(cal)) return "gray";
    if (cal >= 90) return "green";
    if (cal >= 70) return "orange";
    return "red";
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

  if (loading) {
    return (
      <div>
        <Navbar />
        <h2>Cargando calificaciones...</h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <h1>Calificaciones</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Buscar por materia, clave o grupo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Clave</th>
            <th>Grupo</th>
            <th>Unidad 1</th>
            <th>Unidad 2</th>
            <th>Unidad 3</th>
            <th>Unidad 4</th>
            <th>Promedio</th>
          </tr>
        </thead>

        <tbody>
          {filtradas.map((item, index) => {
            const listaCalificaciones =
              item.calificaiones || item.calificaciones || [];

            const promedio = getPromedio(listaCalificaciones);

            return (
              <tr key={index}>
                <td>{item.materia?.nombre_materia || "No disponible"}</td>
                <td>{item.materia?.clave_materia || "No disponible"}</td>
                <td>{item.materia?.letra_grupo || "No disponible"}</td>

                {[0, 1, 2, 3].map((i) => (
                  <td key={i}>
                    {listaCalificaciones[i]?.calificacion ?? "Pendiente"}
                  </td>
                ))}

                <td style={{ color: getColor(promedio), fontWeight: "bold" }}>
                  {promedio}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filtradas.length === 0 && <p>No se encontraron materias.</p>}
    </div>
  );
}

export default Calificaciones;