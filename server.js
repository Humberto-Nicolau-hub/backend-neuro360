import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

import { createClient } from "@supabase/supabase-js";

import detectarEmocao from "./detector_emocional.js";

import gerarRespostaPNL from "./protocolos_pnl.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// =========================
// OPENAI
// =========================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =========================
// SUPABASE
// =========================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
  res.send("NeuroMapa360 Backend Online 🚀");
});

// =========================
// DASHBOARD ADMIN
// =========================

app.get("/admin/dashboard", async (req, res) => {

  try {

    const { count: totalRegistros } =
      await supabase
        .from("memoria_emocional")
        .select("*", {
          count: "exact",
          head: true,
        });

    const { data: memorias } =
      await supabase
        .from("memoria_emocional")
        .select("*");

    const usuariosUnicos = [
      ...new Set(
        memorias?.map(
          (m) => m.user_id
        )
      ),
    ];

    const premium = Math.floor(
      usuariosUnicos.length * 0.25
    );

    let emocaoDominante =
      "equilibrio";

    let mapa = {
      ansiedade: 0,
      tristeza: 0,
      culpa: 0,
      procrastinacao: 0,
      raiva: 0,
    };

    memorias?.forEach((m) => {

      if (mapa[m.emocao] !== undefined) {
        mapa[m.emocao]++;
      }
    });

    emocaoDominante =
      Object.keys(mapa).reduce((a, b) =>
        mapa[a] > mapa[b] ? a : b
      );

    res.json({
      totalUsuarios:
        usuariosUnicos.length || 0,

      premium,

      totalRegistros:
        totalRegistros || 0,

      totalMemorias:
        totalRegistros || 0,

      conversao:
        usuariosUnicos.length > 0
          ? (
              (premium /
                usuariosUnicos.length) *
              100
            ).toFixed(1)
          : 0,

      receita: premium * 47,

      emocaoDominante,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      erro:
        "Erro dashboard admin",
    });
  }
});

// =========================
// IA TERAPÊUTICA
// =========================

app.post("/ia", async (req, res) => {

  try {

    const {
      mensagem,
      user_id,
    } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        erro:
          "Mensagem obrigatória",
      });
    }

    // =========================
    // DETECÇÃO EMOCIONAL
    // =========================

    const emocaoData =
      detectarEmocao(mensagem);

    // =========================
    // MEMÓRIA EMOCIONAL
    // =========================

    const { data: memoria } =
      await supabase
        .from("memoria_emocional")
        .select("*")
        .eq(
          "user_id",
          user_id || "anonimo"
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(5);

    // =========================
    // CONTEXTO ANTERIOR
    // =========================

    let contextoAnterior = "";

    if (
      memoria &&
      memoria.length > 0
    ) {

      contextoAnterior =
        memoria
          .map(
            (m) =>
              `
Usuário:
${m.mensagem_usuario}

IA:
${m.resposta_ia}

Emoção:
${m.emocao}
`
          )
          .join("\n");
    }

    // =========================
    // PROTOCOLO TERAPÊUTICO
    // =========================

    const respostaPNL =
      gerarRespostaPNL(
        emocaoData,
        mensagem
      );

    // =========================
    // SEGURANÇA EMOCIONAL
    // =========================

    const mensagemLower =
      mensagem.toLowerCase();

    const riscoElevado =
      mensagemLower.includes("suicídio") ||
      mensagemLower.includes("me matar") ||
      mensagemLower.includes("não quero viver") ||
      mensagemLower.includes("acabar com tudo");

    if (riscoElevado) {

      return res.json({
        resposta: `
Sinto muito que você esteja passando por uma dor tão intensa neste momento.

Você não precisa enfrentar isso sozinho.

Agora é importante buscar apoio humano imediato:
- alguém de confiança
- um familiar
- um profissional
- ou o CVV (188)

Sua vida importa.
E esse momento pode ser atravessado com apoio adequado.

Estou aqui com você.
        `,
      });
    }

    // =========================
    // PROMPT SISTEMA
    // =========================

    const promptSistema = `
Você é a IA terapêutica NeuroMapa360.

Você utiliza:
- PNL terapêutica
- terapia neuro sistêmica
- acolhimento emocional
- escuta ativa
- reestruturação emocional
- linguagem humana profunda
- princípios do método Renascimento da Mente

Você deve:
- responder de forma acolhedora
- evitar respostas genéricas
- ajudar emocionalmente
- gerar segurança emocional
- conduzir emocionalmente
- parecer humana
- aprofundar emocionalmente

Você NÃO deve:
- ser fria
- responder curto
- parecer robótica
- julgar
- gerar dependência emocional

DADOS EMOCIONAIS:

Emoção:
${emocaoData.emocao}

Categoria:
${emocaoData.categoria}

Intensidade:
${emocaoData.intensidade}/10

Vibração:
${emocaoData.vibracao}

Gatilhos:
${emocaoData.gatilhos.join(
  ", "
)}

CONTEXTO ANTERIOR:
${contextoAnterior}

PROTOCOLO TERAPÊUTICO BASE:
${respostaPNL}
`;

    // =========================
    // OPENAI
    // =========================

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        temperature: 0.85,

        max_tokens: 700,

        messages: [
          {
            role: "system",
            content:
              promptSistema,
          },

          {
            role: "user",
            content: mensagem,
          },
        ],
      });

    const resposta =
      completion
        .choices[0]
        .message.content;

    // =========================
    // SALVA MEMÓRIA
    // =========================

    await supabase
      .from("memoria_emocional")
      .insert([
        {
          user_id:
            user_id ||
            "anonimo",

          mensagem_usuario:
            mensagem,

          resposta_ia:
            resposta,

          emocao:
            emocaoData.emocao,

          intensidade:
            emocaoData.intensidade,
        },
      ]);

    // =========================
    // RESPOSTA FINAL
    // =========================

    res.json({
      resposta,

      emocao_detectada:
        emocaoData,

      memoria_ativa:
        memoria?.length > 0,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      erro:
        "Erro IA terapêutica",
    });
  }
});

// =========================
// START
// =========================

const PORT =
  process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(
    `Servidor rodando na porta ${PORT}`
  );
});
