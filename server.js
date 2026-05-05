
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend NeuroMapa360 rodando 🚀");
});

app.post("/ia", (req, res) => {
  res.json({ resposta: "IA funcionando (teste inicial)" });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});