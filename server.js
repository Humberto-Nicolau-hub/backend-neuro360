import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* =========================
   OPENAI
========================= */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.send("Backend NeuroMapa360 online 🚀");
});

/* =========================
   IA REAL
========================= */

app.post("/ia", async (req, res) => {

  try {

    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        erro: "Mensagem não enviada"
      });
    }

    console.log("Pergunta:", mensagem);

    const respostaIA = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é a IA terapêutica NeuroMapa360, especializada em apoio emocional, PNL, clareza mental e desenvolvimento humano."
        },
        {
          role: "user",
          content: mensagem
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const resposta =
      respostaIA.choices[0].message.content;

    res.json({
      resposta
    });

  } catch (error) {

    console.error("ERRO OPENAI:", error);

    res.status(500).json({
      erro: "Erro ao conectar IA"
    });
  }
});

/* =========================
   ADMIN MÉTRICAS
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

    console.error(error);

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
