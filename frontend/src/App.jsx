import { useState, useEffect } from "react";
function App() {
  const [tarefas, setTarefas] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/api/tarefas")
      .then((res) => res.json())
      .then((dados) => setTarefas(dados));
  }, []);
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {" "}
      <h1>Minhas Tarefas de Hoje</h1>{" "}
      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa ainda.</p>
      ) : (
        <ul>
          {" "}
          {tarefas.map((tarefa) => (
            <li key={tarefa.id}>
              {" "}
              {tarefa.titulo} ({tarefa.categoria}) - {tarefa.data}{" "}
            </li>
          ))}{" "}
        </ul>
      )}{" "}
    </div>
  );
}
export default App;
