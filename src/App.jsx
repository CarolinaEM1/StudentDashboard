import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calificaciones from "./pages/Calificaciones";
import Kardex from "./pages/Kardex";
import Horario from "./pages/Horario";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;