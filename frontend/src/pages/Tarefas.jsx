import { useState, useEffect } from "react";

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("tarefa");
  const [data, setData] = useState("");

  function carregarTarefas() {
    fetch("http://localhost:3001/api/tarefas")
      .then((res) => res.json())
      .then((dados) => setTarefas(dados));
  }

  useEffect(() => {
    carregarTarefas();
  }, []);

  function alternarFeito(id, feitoAtual) {
    fetch(`http://localhost:3001/api/tarefas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feito: feitoAtual ? 0 : 1 }),
    }).then(() => carregarTarefas());
  }

  function apagarTarefa(id) {
    fetch(`http://localhost:3001/api/tarefas/${id}`, { method: "DELETE" }).then(
      () => carregarTarefas(),
    );
  }

  const cores = {
    tarefa: "#4A90D9",
    trabalho: "#D9534F",
    esporte: "#5CB85C",
    lazer: "#F0AD4E",
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!titulo || !data) {
      alert("Preencha pelo menos o título e a data!");
      return;
    }

    fetch("http://localhost:3001/api/tarefas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, categoria, data }),
    }).then(() => {
      setTitulo("");
      setData("");
      carregarTarefas();
    });
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "500px" }}>
      <h1>Minhas Tarefas de Hoje</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="O que você precisa fazer?"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="tarefa">Tarefa escolar</option>
            <option value="trabalho">Trabalho pra entregar</option>
            <option value="esporte">Esporte</option>
            <option value="lazer">Folga/Lazer</option>
          </select>

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          Adicionar Tarefa
        </button>
      </form>

      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa ainda.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tarefas.map((tarefa) => (
            <li
              key={tarefa.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px",
                marginBottom: "6px",
                borderLeft: `5px solid ${cores[tarefa.categoria] || "#999"}`,
                textDecoration: tarefa.feito ? "line-through" : "none",
                opacity: tarefa.feito ? 0.6 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={!!tarefa.feito}
                onChange={() => alternarFeito(tarefa.id, tarefa.feito)}
              />
              <span style={{ flex: 1 }}>
                {tarefa.titulo} ({tarefa.categoria}) - {tarefa.data}
              </span>
              <button onClick={() => apagarTarefa(tarefa.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tarefas;