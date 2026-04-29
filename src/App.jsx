import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calificaciones from "./pages/Calificaciones";
import Kardex from "./pages/Kardex";
import Horario from "./pages/Horario";
import Avisos from "./pages/Avisos";
import AdminAvisos from "./pages/AdminAvisos";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/calificaciones"
          element={
            <PrivateRoute>
              <Calificaciones />
            </PrivateRoute>
          }
        />

        <Route
          path="/kardex"
          element={
            <PrivateRoute>
              <Kardex />
            </PrivateRoute>
          }
        />

        <Route
          path="/horario"
          element={
            <PrivateRoute>
              <Horario />
            </PrivateRoute>
          }
        />
        <Route
          path="/avisos"
          element={
            <PrivateRoute>
              <Avisos />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-avisos"
          element={
            <PrivateRoute>
              <AdminAvisos />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;