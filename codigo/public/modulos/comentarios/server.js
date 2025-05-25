const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const DB_PATH = path.join(__dirname, "db", "comentarios.json");

app.use(express.json());
app.use(express.static("public"));

// GET
app.get("/api/comentarios", (req, res) => {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  res.json(JSON.parse(data));
});

// POST
app.post("/api/comentarios", (req, res) => {
  const { jogo, nota, comentario } = req.body;
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

  const novo = {
    id: Date.now(), // gera id único
    jogo,
    nota,
    comentario
  };

  data.push(novo);
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.status(201).json(novo);
});

// PUT (editar)
app.put("/api/comentarios/:id", (req, res) => {
  const { id } = req.params;
  const { jogo, nota, comentario } = req.body;
  let data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

  const index = data.findIndex(c => c.id == id);
  if (index === -1) return res.status(404).json({ erro: "Comentário não encontrado" });

  data[index] = { id: Number(id), jogo, nota, comentario };
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.json(data[index]);
});

// DELETE
app.delete("/api/comentarios/:id", (req, res) => {
  const { id } = req.params;
  let data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

  const novoData = data.filter(c => c.id != id);
  if (data.length === novoData.length) return res.status(404).json({ erro: "Comentário não encontrado" });

  fs.writeFileSync(DB_PATH, JSON.stringify(novoData, null, 2));
  res.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});