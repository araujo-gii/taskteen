require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('taskteen.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    categoria TEXT,
    data TEXT,
    feito INTEGER DEFAULT 0
  )
`);

// Listar todas as tarefas
app.get('/api/tarefas', (req, res) => {
  const tarefas = db.prepare('SELECT * FROM tarefas ORDER BY data').all();
  res.json(tarefas);
});

// Criar uma nova tarefa
app.post('/api/tarefas', (req, res) => {
  const { titulo, categoria, data } = req.body;
  const resultado = db.prepare(
    'INSERT INTO tarefas (titulo, categoria, data) VALUES (?, ?, ?)'
  ).run(titulo, categoria, data);
  res.json({ id: resultado.lastInsertRowid, titulo, categoria, data, feito: 0 });
});

// Marcar tarefa como feita (ou desfazer)
app.put('/api/tarefas/:id', (req, res) => {
  const { feito } = req.body;
  db.prepare('UPDATE tarefas SET feito = ? WHERE id = ?').run(feito ? 1 : 0, req.params.id);
  res.json({ sucesso: true });
});

// Apagar uma tarefa
app.delete('/api/tarefas/:id', (req, res) => {
  db.prepare('DELETE FROM tarefas WHERE id = ?').run(req.params.id);
  res.json({ sucesso: true });
}); 

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Servidor e banco de dados funcionando!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('✅ Banco de dados SQLite pronto (arquivo taskteen.db)');
});