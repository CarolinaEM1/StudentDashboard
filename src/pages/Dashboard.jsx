import { useEffect, useState } from "react";
import siiApi from "../api/siiApi";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getValue = (obj, keys) => {
    for (let key of keys) {
      if (obj?.[key]) return obj[key];
    }
    return "No disponible";
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await siiApi.get("/movil/estudiante");

        console.log("RESPUESTA ESTUDIANTE:", response.data);

        const data =
          response.data?.message?.estudiante ||
          response.data?.message ||
          response.data?.estudiante ||
          response.data?.data ||
          response.data;

        setStudent(data);
      } catch (err) {
        console.log("ERROR ESTUDIANTE:", err.response?.data || err.message);
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

      <div>
        <h2>{getValue(student, ["nombre", "Nombre", "name", "full_name"])}</h2>

        <p>
          <strong>No. Control:</strong>{" "}
          {getValue(student, [
            "no_control",
            "NoControl",
            "numero_control",
            "control",
            "nocontrol",
            "matricula",
          ])}
        </p>

        <p>
          <strong>Carrera:</strong>{" "}
          {getValue(student, ["carrera", "Carrera", "career", "programa"])}
        </p>

        <p>
          <strong>Correo:</strong>{" "}
          {getValue(student, ["email", "correo", "Correo"])}
        </p>

        <p>
          <strong>Semestre:</strong>{" "}
          {getValue(student, ["semestre", "Semestre", "semester"])}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;