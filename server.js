import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.send("Backend NeuroMapa360 online 🚀");
});

/* =========================
   IA TESTE
========================= */

app.post("/ia", async (req, res) => {
  try {
    const { mensagem } = req.body;

    console.log("Mensagem recebida:", mensagem);

    res.json({
      resposta: `IA respondeu: ${mensagem || "teste inicial"}`
    });

  } catch (error) {

    console.error("Erro IA:", error);

    res.status(500).json({
      erro: "Erro na IA"
    });
  }
});

/* =========================
   MÉTRICAS ADMIN
========================= */

app.get("/admin-metricas", async (req, res) => {
  try {

    res.json({
      usuarios: 10,
      registros: 20,
      ia: 1,
      status: "online"
    });

  } catch (error) {

    console.error("Erro admin métricas:", error);

    res.status(500).json({
      erro: "Erro backend"
    });
  }
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
