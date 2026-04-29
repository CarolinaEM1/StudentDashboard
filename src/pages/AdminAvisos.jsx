import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/avisos.css";

function AdminAvisos() {
  const [avisos, setAvisos] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    categoria: "",
    fecha: "",
    descripcion: "",
  });

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("avisosUniversitarios"));
    setAvisos(guardados || []);
  }, []);

  const guardarEnStorage = (nuevosAvisos) => {
    localStorage.setItem("avisosUniversitarios", JSON.stringify(nuevosAvisos));
    setAvisos(nuevosAvisos);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const agregarAviso = (e) => {
    e.preventDefault();

    if (!form.titulo || !form.categoria || !form.fecha || !form.descripcion) {
      alert("Completa todos los campos.");
      return;
    }

    const nuevoAviso = {
      id: Date.now(),
      ...form,
    };

    guardarEnStorage([nuevoAviso, ...avisos]);

    setForm({
      titulo: "",
      categoria: "",
      fecha: "",
      descripcion: "",
    });
  };

  const eliminarAviso = (id) => {
    const nuevosAvisos = avisos.filter((aviso) => aviso.id !== id);
    guardarEnStorage(nuevosAvisos);
  };

  return (
    <div className="announcements-page">
      <Navbar />

      <main className="announcements-container">
        <section className="announcements-hero admin-hero">
          <div>
            <span className="announcements-label">Panel de administración</span>
            <h1>Administrar Avisos</h1>
            <p>
              Crea y elimina comunicados universitarios para mantener informada
              a la comunidad estudiantil.
            </p>
          </div>

          <div className="announcements-hero-card">
            <span>Avisos creados</span>
            <h2>{avisos.length}</h2>
            <p>Registros administrados</p>
          </div>
        </section>

        <section className="admin-grid">
          <form className="admin-form" onSubmit={agregarAviso}>
            <h2>Nuevo aviso</h2>

            <label>Título</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej. Pago de reinscripción"
            />

            <label>Categoría</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
            >
              <option value="">Selecciona una categoría</option>
              <option value="Académico">Académico</option>
              <option value="Becas">Becas</option>
              <option value="Eventos">Eventos</option>
              <option value="Pagos">Pagos</option>
              <option value="General">General</option>
            </select>

            <label>Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
            />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Escribe la información del aviso..."
            />

            <button type="submit">Publicar aviso</button>
          </form>

          <section className="admin-list">
            <h2>Avisos registrados</h2>

            {avisos.map((aviso) => (
              <div className="admin-item" key={aviso.id}>
                <div>
                  <span>{aviso.categoria}</span>
                  <h3>{aviso.titulo}</h3>
                  <p>{aviso.fecha}</p>
                </div>

                <button onClick={() => eliminarAviso(aviso.id)}>
                  Eliminar
                </button>
              </div>
            ))}

            {avisos.length === 0 && (
              <p className="announcements-empty">
                Todavía no hay avisos registrados.
              </p>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default AdminAvisos;