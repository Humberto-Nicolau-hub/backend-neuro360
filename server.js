import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// SUPABASE
// =========================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// =========================
// OPENAI
// =========================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =========================
// DETECTOR EMOCIONAL
// =========================

import detectarEmocao from "./detector_emocional.js";

// =========================
// ROTA PRINCIPAL
// =========================

app.get("/", (req, res) => {
  res.send("NeuroMapa360 Backend Online 🚀");
});

// =========================
// DASHBOARD ADMIN
// =========================

app.get("/admin/dashboard", async (req, res) => {
  try {
    const { count: usuarios } = await supabase
      .from("usuarios")
      .select("*", { count: "exact", head: true });

    const { count: registros } = await supabase
      .from("memoria_emocional")
      .select("*", { count: "exact", head: true });

    const { count: premium } = await supabase
      .from("usuarios")
      .select("*", { count: "exact", head: true })
      .eq("premium", true);

    res.json({
      totalUsuarios: usuarios || 0,
      totalRegistros: registros || 0,
      premium: premium || 0,
      conversao: usuarios
        ? ((premium / usuarios) * 100).toFixed(1)
        : 0,
      receita: (premium || 0) * 47,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      erro: "Erro dashboard",
    });
  }
});

// =========================
// IA TERAPÊUTICA
// =========================

app.post("/ia", async (req, res) => {
  try {
    const { mensagem, user_id } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        erro: "Mensagem obrigatória",
      });
    }

    // =========================
    // DETECÇÃO EMOCIONAL
    // =========================

    const emocao = detectarEmocao(mensagem);

    // =========================
    // BUSCA MEMÓRIA RECENTE
    // =========================

    const { data: memoria } = await supabase
      .from("memoria_emocional")
      .select("*")
      .eq("user_id", user_id || "anonimo")
      .order("created_at", { ascending: false })
      .limit(5);

    const contextoAnterior =
      memoria && memoria.length > 0
        ? memoria
            .map(
              (m) =>
                `Usuário: ${m.mensagem_usuario}\nIA: ${m.resposta_ia}`
            )
            .join("\n")
        : "Sem histórico emocional.";

    // =========================
    // PROMPT TERAPÊUTICO
    // =========================

    const promptSistema = `
Você é a IA terapêutica do NeuroMapa360.

Seu papel:
- acolher emocionalmente
- usar PNL
- usar linguagem humana
- aplicar terapia neuro sistêmica
- evitar respostas genéricas
- ajudar emocionalmente
- conduzir com profundidade

Você NÃO deve:
- responder friamente
- parecer robótico
- dar respostas rasas
- julgar
- incentivar dependência emocional

Você deve:
- identificar padrões mentais
- ajudar a reorganizar pensamentos
- usar tom acolhedor
- gerar segurança emocional
- usar micro técnicas terapêuticas

EMOÇÃO DETECTADA:
${emocao.emocao}

INTENSIDADE:
${emocao.intensidade}/10

CATEGORIA:
${emocao.categoria}

VIBRAÇÃO:
${emocao.vibracao}

CONTEXTO ANTERIOR:
${contextoAnterior}
`;

    // =========================
    // OPENAI
    // =========================

    const respostaIA = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
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
    });

    const resposta =
      respostaIA.choices[0].message.content;

    // =========================
    // SALVA MEMÓRIA
    // =========================

    await supabase.from("memoria_emocional").insert([
      {
        user_id: user_id || "anonimo",
        mensagem_usuario: mensagem,
        resposta_ia: resposta,
        emocao: emocao.emocao,
        intensidade: emocao.intensidade,
      },
    ]);

    // =========================
    // RETORNO
    // =========================

    res.json({
      resposta,
      emocao_detectada: emocao,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      erro: "Erro IA terapêutica",
    });
  }
});

// =========================
// START
// =========================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
