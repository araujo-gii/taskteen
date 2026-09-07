import { useState, useEffect } from "react";

const cores = {
  tarefa: "#4A90D9",
  trabalho: "#D9534F",
  esporte: "#5CB85C",
  lazer: "#F0AD4E",
};

function Inicio() {
  const [tarefas, setTarefas] = useState([]);
  const [clima, setClima] = useState(null);

  function carregarTarefas() {
    fetch("http://localhost:3001/api/tarefas")
      .then((res) => res.json())
      .then((dados) => setTarefas(dados));
  }

  useEffect(() => {
    carregarTarefas();
    fetch("http://localhost:3001/api/clima")
      .then((res) => res.json())
      .then((dados) => setClima(dados))
      .catch(() => setClima(null));
  }, []);

  function alternarFeito(id, feitoAtual) {
    fetch(`http://localhost:3001/api/tarefas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feito: feitoAtual ? 0 : 1 }),
    }).then(() => carregarTarefas());
  }

  const hoje = new Date().toISOString().split("T")[0];
  const tarefasDeHoje = tarefas.filter((t) => t.data === hoje);
  const feitas = tarefasDeHoje.filter((t) => t.feito).length;
  const total = tarefasDeHoje.length;

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h1>Olá! 👋</h1>
      <p>
        Hoje é{" "}
        {new Date(hoje + "T00:00:00").toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </p>

      {clima && (
        <div
          style={{
            background: "#2a2a2a",
            padding: "10px 14px",
            borderRadius: "8px",
            margin: "10px 0",
          }}
        >
          <p style={{ margin: 0 }}>
            {clima.descricao} — {Math.round(clima.temperatura)}°C
          </p>
          {tarefasDeHoje.some((t) => t.categoria === "esporte") && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "14px",
                color: clima.bomParaEsporte ? "#5CB85C" : "#D9534F",
              }}
            >
              {clima.bomParaEsporte
                ? "✅ Bom dia pra treinar ao ar livre!"
                : "⚠️ Talvez seja melhor treinar em local coberto hoje."}
            </p>
          )}
        </div>
      )}

      {total > 0 && (
        <div style={{ margin: "16px 0" }}>
          <div
            style={{
              background: "#333",
              borderRadius: "8px",
              overflow: "hidden",
              height: "16px",
            }}
          >
            <div
              style={{
                width: `${(feitas / total) * 100}%`,
                background: "#5CB85C",
                height: "100%",
                transition: "width 0.3s",
              }}
            />
          </div>
          <p style={{ fontSize: "14px", marginTop: "4px" }}>
            {feitas} de {total} tarefas concluídas hoje
          </p>
        </div>
      )}

      <h2>Afazeres de hoje</h2>
      {tarefasDeHoje.length === 0 ? (
        <p>Nenhuma tarefa para hoje. Aproveite! 🎉</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tarefasDeHoje.map((tarefa) => (
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
                aria-label={`Marcar "${tarefa.titulo}" como feita`}
              />
              <span>
                {tarefa.titulo} ({tarefa.categoria})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Inicio;
