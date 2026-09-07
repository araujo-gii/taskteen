require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("taskteen.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    categoria TEXT,
    data TEXT,
    feito INTEGER DEFAULT 0
  )
`);

db.exec(
  ` CREATE TABLE IF NOT EXISTS materias ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  nome TEXT NOT NULL, 
  cor TEXT DEFAULT '#4A90D9' ) `,
);

db.exec(
  ` CREATE TABLE IF NOT EXISTS notas ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  materia_id INTEGER NOT NULL,
  valor REAL NOT NULL, 
  bimestre INTEGER, FOREIGN KEY (materia_id) 
  REFERENCES materias(id) ) `,
);

// Listar todas as tarefas
app.get("/api/tarefas", (req, res) => {
  const tarefas = db.prepare("SELECT * FROM tarefas ORDER BY data").all();
  res.json(tarefas);
});

// Criar uma nova tarefa
app.post("/api/tarefas", (req, res) => {
  const { titulo, categoria, data } = req.body;
  const resultado = db
    .prepare("INSERT INTO tarefas (titulo, categoria, data) VALUES (?, ?, ?)")
    .run(titulo, categoria, data);
  res.json({
    id: resultado.lastInsertRowid,
    titulo,
    categoria,
    data,
    feito: 0,
  });
});

// Marcar tarefa como feita (ou desfazer)
app.put("/api/tarefas/:id", (req, res) => {
  const { feito } = req.body;
  db.prepare("UPDATE tarefas SET feito = ? WHERE id = ?").run(
    feito ? 1 : 0,
    req.params.id,
  );
  res.json({ sucesso: true });
});

// Apagar uma tarefa
app.delete("/api/tarefas/:id", (req, res) => {
  db.prepare("DELETE FROM tarefas WHERE id = ?").run(req.params.id);
  res.json({ sucesso: true });
});

// Listar matérias (já com a média de notas de cada uma)
app.get("/api/materias", (req, res) => {
  const materias = db.prepare("SELECT * FROM materias").all();
  const comMedia = materias.map((m) => {
    const notas = db
      .prepare("SELECT valor FROM notas WHERE materia_id = ?")
      .all(m.id);
    const media = notas.length
      ? notas.reduce((soma, n) => soma + n.valor, 0) / notas.length
      : null;
    return { ...m, media };
  });
  res.json(comMedia);
});

// Criar matéria
app.post("/api/materias", (req, res) => {
  const { nome, cor } = req.body;
  const resultado = db
    .prepare("INSERT INTO materias (nome, cor) VALUES (?, ?)")
    .run(nome, cor || "#4A90D9");
  res.json({ id: resultado.lastInsertRowid, nome, cor });
});

// Apagar matéria
app.delete("/api/materias/:id", (req, res) => {
  db.prepare("DELETE FROM notas WHERE materia_id = ?").run(req.params.id);
  db.prepare("DELETE FROM materias WHERE id = ?").run(req.params.id);
  res.json({ sucesso: true });
});

// Adicionar nota a uma matéria
app.post("/api/notas", (req, res) => {
  const { materia_id, valor, bimestre } = req.body;
  const resultado = db
    .prepare("INSERT INTO notas (materia_id, valor, bimestre) VALUES (?, ?, ?)")
    .run(materia_id, valor, bimestre || null);
  res.json({ id: resultado.lastInsertRowid, materia_id, valor, bimestre });
});

app.get('/api/clima', async (req, res) => {
  try {
    const resposta = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-22.01&longitude=-47.89&current=temperature_2m,weathercode&timezone=America%2FSao_Paulo'
    );
    const dados = await resposta.json();

    const codigo = dados.current.weathercode;
    const temperatura = dados.current.temperature_2m;

    let descricao = 'Tempo indefinido';
    let bomParaEsporte = true;

    if (codigo === 0) {
      descricao = 'Céu limpo ☀️';
    } else if ([1, 2, 3].includes(codigo)) {
      descricao = 'Parcialmente nublado ⛅';
    } else if ([45, 48].includes(codigo)) {
      descricao = 'Neblina 🌫️';
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(codigo)) {
      descricao = 'Chuva 🌧️';
      bomParaEsporte = false;
    } else if ([95, 96, 99].includes(codigo)) {
      descricao = 'Tempestade ⛈️';
      bomParaEsporte = false;
    }

    res.json({ temperatura, descricao, bomParaEsporte });
  } catch (erro) {
    res.status(500).json({ erro: 'Não foi possível buscar o clima' });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mensagem: "Servidor e banco de dados funcionando!",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("✅ Banco de dados SQLite pronto (arquivo taskteen.db)");
});
