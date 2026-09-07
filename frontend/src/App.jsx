import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Agenda from "./pages/Agenda";
import Materias from "./pages/Materias";
import Tarefas from "./pages/Tarefas";
import Perfil from "./pages/Perfil";
const linkStyle = ({ isActive }) => ({
  padding: "10px 16px",
  textDecoration: "none",
  color: isActive ? "#fff" : "#ccc",
  background: isActive ? "#4A90D9" : "transparent",
  borderRadius: "8px",
  fontWeight: isActive ? "bold" : "normal",
});
function App() {
  return (
    <BrowserRouter>
      {" "}
      <nav
        style={{
          display: "flex",
          gap: "8px",
          padding: "12px",
          borderBottom: "1px solid #444",
        }}
      >
        {" "}
        <NavLink to="/" style={linkStyle} end>
          Início
        </NavLink>{" "}
        <NavLink to="/agenda" style={linkStyle}>
          Agenda
        </NavLink>{" "}
        <NavLink to="/materias" style={linkStyle}>
          Matérias
        </NavLink>{" "}
        <NavLink to="/tarefas" style={linkStyle}>
          Tarefas
        </NavLink>{" "}
        <NavLink to="/perfil" style={linkStyle}>
          Perfil
        </NavLink>{" "}
      </nav>{" "}
      <Routes>
        {" "}
        <Route path="/" element={<Inicio />} />{" "}
        <Route path="/agenda" element={<Agenda />} />{" "}
        <Route path="/materias" element={<Materias />} />{" "}
        <Route path="/tarefas" element={<Tarefas />} />{" "}
        <Route path="/perfil" element={<Perfil />} />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}
export default App;
