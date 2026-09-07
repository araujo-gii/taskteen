import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Agenda from "./pages/Agenda";
import Materias from "./pages/Materias";
import Tarefas from "./pages/Tarefas";
import Perfil from "./pages/Perfil";
const abas = [
  { to: "/", label: "Início", icone: "🏠", fim: true },
  { to: "/agenda", label: "Agenda", icone: "📅" },
  { to: "/materias", label: "Matérias", icone: "📚" },
  { to: "/tarefas", label: "Tarefas", icone: "✅" },
  { to: "/perfil", label: "Perfil", icone: "👤" },
];
function App() {
  return (
    <BrowserRouter>
      {" "}
      <header
        style={{
          background: "linear-gradient(90deg, #6C5CE7, #a29bfe)",
          padding: "16px 20px",
          textAlign: "center",
        }}
      >
        {" "}
        <h1 style={{ margin: 0, color: "white", fontSize: "26px" }}>
          🌟 TaskTeen
        </h1>{" "}
      </header>{" "}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "10px",
          background: "#23233a",
          position: "sticky",
          top: 0,
          zIndex: 10,
          flexWrap: "wrap",
          gap: "6px",
        }}
      >
        {" "}
        {abas.map((aba) => (
          <NavLink
            key={aba.to}
            to={aba.to}
            end={aba.fim}
            style={({ isActive }) => ({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "8px 14px",
              textDecoration: "none",
              color: isActive ? "white" : "#aaa",
              background: isActive ? "#6C5CE7" : "transparent",
              borderRadius: "12px",
              fontWeight: isActive ? "bold" : "normal",
              fontSize: "13px",
              minWidth: "60px",
            })}
          >
            {" "}
            <span style={{ fontSize: "20px" }} aria-hidden="true">
              {aba.icone}
            </span>{" "}
            {aba.label}{" "}
          </NavLink>
        ))}{" "}
      </nav>{" "}
      <main> <Routes>
        {" "}
        <Route path="/" element={<Inicio />} />{" "}
        <Route path="/agenda" element={<Agenda />} />{" "}
        <Route path="/materias" element={<Materias />} />{" "}
        <Route path="/tarefas" element={<Tarefas />} />{" "}
        <Route path="/perfil" element={<Perfil />} />{" "}
      </Routes> </main>{" "}
    </BrowserRouter>
  );
}
export default App;
