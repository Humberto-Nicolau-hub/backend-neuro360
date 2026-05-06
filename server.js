import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function calcularNivel(emocao) {
  const mapa = {
    deprimido: 1,
    desmotivado: 2,
    triste: 3,
    ansioso: 4,
    estressado: 5,
    procrastinador: 6,
    feliz: 8,
  };

  return mapa[emocao?.toLowerCase()] || 5;
}

app.get("/", (req, res) => {
  res.send("Backend NeuroMapa360 online 🚀");
});

app.get("/admin-metricas", async (req, res) => {
  try {
    const { count: usuarios } =
      await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        });

    const { count: registros } =
      await supabase
        .from("registros_emocionais")
        .select("*", {
          count: "exact",
          head: true,
        });

    const { count: ia } =
      await supabase
        .from("memoria_ia")
        .select("*", {
          count: "exact",
          head: true,
        });

    res.json({
      usuarios,
      registros,
      ia,
      status: "online",
    });

  } catch (e) {

    res.status(500).json({
      erro: e.message,
    });
  }
});

app.post("/ia", async (req, res) => {

  try {

    const {
      mensagem,
      emocao,
      user_id,
      modo,
      modoProfundo,
    } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        erro: "Mensagem obrigatória",
      });
    }

    const { data: memoria } =
      await supabase
        .from("memoria_ia")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", {
          ascending: false,
        })
        .limit(5);

    const contextoAnterior =
      memoria
        ?.map(
          (m) =>
            `
Usuário: ${m.mensagem_usuario}

IA: ${m.resposta_ia}
`
        )
        .join("\n");

    const promptSistema = `
Você é a IA terapêutica NeuroMapa360.

Seu papel é oferecer:
- apoio emocional
- acolhimento
- PNL terapêutica
- reestruturação emocional
- inteligência emocional
- orientação neuro sistêmica

IMPORTANTE:
- nunca seja fria
- nunca seja robótica
- nunca use respostas curtas
- fale de forma humana
- use empatia
- ajude emocionalmente

Estado emocional atual:
${emocao}

Modo:
${modo}

Terapia profunda:
${modoProfundo ? "ATIVADA" : "DESATIVADA"}

Histórico emocional recente:
${contextoAnterior}
`;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content: promptSistema,
          },

          {
            role: "user",
            content: mensagem,
          },
        ],

        temperature: 0.8,

        max_tokens: 700,
      });

    const resposta =
      completion.choices[0].message.content;

    await supabase
      .from("memoria_ia")
      .insert([
        {
          user_id,
          emocao,
          mensagem_usuario: mensagem,
          resposta_ia: resposta,
          nivel_emocional:
            calcularNivel(emocao),
        },
      ]);

    res.json({
      resposta,
    });

  } catch (e) {

    console.log(e);

    res.status(500).json({
      erro: e.message,
    });
  }
});

const PORT =
  process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(
    `Servidor rodando na porta ${PORT}`
  );
});
