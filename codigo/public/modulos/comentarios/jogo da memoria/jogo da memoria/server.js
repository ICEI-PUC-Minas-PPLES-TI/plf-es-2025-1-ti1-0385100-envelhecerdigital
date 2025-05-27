const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "db.json");

// Middleware
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Se não encontrar rota, envia index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Utilitários de leitura e escrita do JSON
function readDB() {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Endpoint GET /ranking
app.get("/ranking", (req, res) => {
  const db = readDB();
  const ranking = db.ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  res.json(ranking);
});

// Endpoint POST /ranking
app.post("/ranking", (req, res) => {
  const { nome, pontuacao } = req.body;

  if (!nome || pontuacao == null) {
    return res.status(400).json({ error: "Nome e pontuação são obrigatórios." });
  }

  const db = readDB();
  db.ranking.push({
    nome,
    pontuacao,
    data: new Date().toISOString().split("T")[0]
  });

  writeDB(db);
  res.status(201).json({ message: "Pontuação salva com sucesso." });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
