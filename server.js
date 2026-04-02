
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend NeuroMapa360 rodando 🚀");
});

app.post("/ia", (req, res) => {
  res.json({ resposta: "IA funcionando (teste inicial)" });
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});