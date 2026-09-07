import { useState, useEffect } from "react";
function Materias() {
  const [materias, setMaterias] = useState([]);
  const [nomeNovo, setNomeNovo] = useState("");
  const [notaInput, setNotaInput] = useState({});
  function carregarMaterias() {
    fetch("http://localhost:3001/api/materias")
      .then((res) => res.json())
      .then((dados) => setMaterias(dados));
  }
  useEffect(() => {
    carregarMaterias();
  }, []);
  function adicionarMateria(e) {
    e.preventDefault();
    if (!nomeNovo) return;
    fetch("http://localhost:3001/api/materias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nomeNovo }),
    }).then(() => {
      setNomeNovo("");
      carregarMaterias();
    });
  }
  function apagarMateria(id) {
    fetch(`http://localhost:3001/api/materias/${id}`, {
      method: "DELETE",
    }).then(() => carregarMaterias());
  }
  function adicionarNota(materiaId) {
    const valor = notaInput[materiaId];
    if (!valor) return;
    fetch("http://localhost:3001/api/notas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materia_id: materiaId, valor: parseFloat(valor) }),
    }).then(() => {
      setNotaInput({ ...notaInput, [materiaId]: "" });
      carregarMaterias();
    });
  }
  const piorMedia = materias
    .filter((m) => m.media !== null)
    .sort((a, b) => a.media - b.media)[0];
  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      {" "}
      <h1>Matérias & Notas</h1>{" "}
      <form
        onSubmit={adicionarMateria}
        style={{ display: "flex", gap: "8px", marginBottom: "20px" }}
      >
        {" "}
        <input
          type="text"
          placeholder="Nome da matéria (ex: Matemática)"
          value={nomeNovo}
          onChange={(e) => setNomeNovo(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />{" "}
        <button type="submit">Adicionar</button>{" "}
      </form>{" "}
      {piorMedia && (
        <p
          style={{
            background: "#5a3a1a",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {" "}
          💡 {piorMedia.nome} está com a média mais baixa (
          {piorMedia.media.toFixed(1)}) — pode ser bom reforçar essa
          matéria.{" "}
        </p>
      )}{" "}
      {materias.map((materia) => (
        <div
          key={materia.id}
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "10px",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {" "}
            <strong>{materia.nome}</strong>{" "}
            <button onClick={() => apagarMateria(materia.id)}>🗑️</button>{" "}
          </div>{" "}
          <p>
            {" "}
            Média:{" "}
            {materia.media !== null
              ? materia.media.toFixed(1)
              : "sem notas ainda"}{" "}
          </p>{" "}
          <div style={{ display: "flex", gap: "8px" }}>
            {" "}
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="Nota (0-10)"
              value={notaInput[materia.id] || ""}
              onChange={(e) =>
                setNotaInput({ ...notaInput, [materia.id]: e.target.value })
              }
              style={{ width: "100px", padding: "6px" }}
            />{" "}
            <button onClick={() => adicionarNota(materia.id)}>
              Lançar nota
            </button>{" "}
          </div>{" "}
        </div>
      ))}{" "}
    </div>
  );
}
export default Materias;
