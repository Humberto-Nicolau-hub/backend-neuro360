import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

import { createClient } from "@supabase/supabase-js";

import detectarEmocao from "./detector_emocional.js";

import gerarRespostaPNL from "./protocolos_pnl.js";

import calcularScoreEmocional from "./score_emocional.js";

import gerarHeatmapEmocional from "./heatmap_emocional.js";

import gerarRecomendacoes from "./recomendacoes_automaticas.js";

import gerarIntervencaoAutomatica from "./intervencoes_automaticas.js";

import gerarTrilhaTerapêutica from "./trilhas_terapeuticas.js";

import verificarPlano from "./controle_premium.js";

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

    const { data: memorias } =
      await supabase
        .from("memoria_emocional")
        .select("*");

    const scoreData =
      calcularScoreEmocional(
        memorias || []
      );

    const heatmapData =
      gerarHeatmapEmocional(
        memorias || []
      );

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

    res.json({
      totalUsuarios:
        usuariosUnicos.length || 0,

      premium,

      totalRegistros:
        memorias?.length || 0,

      totalMemorias:
        memorias?.length || 0,

      conversao:
        usuariosUnicos.length > 0
          ? (
              (premium /
                usuariosUnicos.length) *
              100
            ).toFixed(1)
          : 0,

      receita: premium * 47,

      emocaoDominante:
        scoreData.emocaoDominante,

      scoreEmocional:
        scoreData.score,

      tendencia:
        scoreData.tendencia,

      nivel:
        scoreData.nivel,

      periodoCritico:
        heatmapData.periodoCritico,

      heatmap:
        heatmapData.heatmap,
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
    // BUSCA MEMÓRIAS
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
        });

    // =========================
    // USUÁRIO
    // =========================

    const { data: usuario } =
      await supabase
        .from("usuarios")
        .select("*")
        .eq(
          "id",
          user_id || "anonimo"
        )
        .single();

    // =========================
    // CONTROLE PREMIUM
    // =========================

    const plano =
      verificarPlano(
        usuario || {},
        memoria?.length || 0
      );

    // =========================
    // LIMITE FREE
    // =========================

    if (
      plano.limiteAtingido
    ) {

      return res.json({
        premium: false,

        limite:
          true,

        resposta: `
Você atingiu o limite do plano gratuito do NeuroMapa360.

O plano premium libera:
✅ sessões ilimitadas
✅ memória emocional avançada
✅ trilhas terapêuticas premium
✅ intervenções inteligentes
✅ heatmap emocional
✅ acompanhamento emocional contínuo

Continue sua evolução emocional no plano premium.
        `,
      });
    }

    // =========================
    // DETECÇÃO EMOCIONAL
    // =========================

    const emocaoData =
      detectarEmocao(mensagem);

    // =========================
    // SCORE
    // =========================

    const scoreData =
      calcularScoreEmocional(
        memoria || []
      );

    // =========================
    // HEATMAP
    // =========================

    const heatmapData =
      gerarHeatmapEmocional(
        memoria || []
      );

    // =========================
    // RECOMENDAÇÕES
    // =========================

    const recomendacoes =
      gerarRecomendacoes(
        scoreData,
        emocaoData
      );

    // =========================
    // INTERVENÇÕES
    // =========================

    const intervencoes =
      gerarIntervencaoAutomatica(
        scoreData,
        heatmapData
      );

    // =========================
    // TRILHAS
    // =========================

    const trilha =
      gerarTrilhaTerapêutica(
        scoreData,
        emocaoData
      );

    // =========================
    // CONTEXTO
    // =========================

    let contextoAnterior = "";

    if (
      memoria &&
      memoria.length > 0
    ) {

      contextoAnterior =
        memoria
          .slice(0, 5)
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
    // PROTOCOLO PNL
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
- linguagem humana profunda
- método Renascimento da Mente

Você deve:
- aprofundar emocionalmente
- responder com empatia
- evitar respostas genéricas
- gerar segurança emocional
- parecer humana
- criar continuidade terapêutica

PLANO:
${plano.plano}

PERFIL EMOCIONAL:

Score emocional:
${scoreData.score}/100

Nível emocional:
${scoreData.nivel}

Tendência emocional:
${scoreData.tendencia}

Emoção dominante:
${scoreData.emocaoDominante}

Período crítico:
${heatmapData.periodoCritico}

EMOÇÃO ATUAL:
${emocaoData.emocao}

INTENSIDADE:
${emocaoData.intensidade}/10

CATEGORIA:
${emocaoData.categoria}

GATILHOS:
${emocaoData.gatilhos.join(", ")}

CONTEXTO ANTERIOR:
${contextoAnterior}

PROTOCOLO TERAPÊUTICO:
${respostaPNL}

RECOMENDAÇÕES:
${JSON.stringify(recomendacoes)}

INTERVENÇÕES:
${JSON.stringify(intervencoes)}

TRILHA TERAPÊUTICA:
${JSON.stringify(trilha)}
`;

    // =========================
    // OPENAI
    // =========================

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        temperature: 0.9,

        max_tokens: 1000,

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
      premium:
        plano.premium,

      plano:
        plano.plano,

      restante:
        plano.restante,

      resposta,

      emocao_detectada:
        emocaoData,

      perfil_emocional:
        scoreData,

      heatmap:
        heatmapData,

      recomendacoes,

      intervencoes,

      trilha,

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
