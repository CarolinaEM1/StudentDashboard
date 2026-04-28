import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await siiApi.get("/movil/estudiante");

        console.log("RESPUESTA ESTUDIANTE:", response.data);

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
      <div>
        <Navbar />
        <h2>Cargando información...</h2>
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

      <h1>Dashboard del estudiante</h1>

      <p>
        <strong>Nombre:</strong> {student.persona}
      </p>

      <p>
        <strong>No. Control:</strong> {student.numero_control}
      </p>

      <p>
        <strong>Correo:</strong> {student.email}
      </p>

      <p>
        <strong>Semestre:</strong> {student.semestre}
      </p>

      <p>
        <strong>Créditos acumulados:</strong> {student.creditos_acumulados}
      </p>

      <p>
        <strong>Promedio ponderado:</strong>{" "}
        {Number(student.promedio_ponderado).toFixed(2)}
      </p>

      <p>
        <strong>Avance de carrera:</strong> {student.porcentaje_avance}%
      </p>
    </div>
  );
}

export default Dashboard;