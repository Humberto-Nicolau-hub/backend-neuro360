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

function detectarEmocao(texto) {
  const t = texto.toLowerCase();

  if (
    t.includes("ansiedade") ||
    t.includes("ansioso") ||
    t.includes("medo") ||
    t.includes("pânico")
  ) {
    return {
      emocao: "ansiedade",
      intensidade: 8,
    };
  }

  if (
    t.includes("triste") ||
    t.includes("depressão") ||
    t.includes("sozinho")
  ) {
    return {
      emocao: "tristeza",
      intensidade: 9,
    };
  }

  if (
    t.includes("cansado") ||
    t.includes("desmotivado") ||
    t.includes("procrastinação")
  ) {
    return {
      emocao: "desmotivacao",
      intensidade: 6,
    };
  }

  return {
    emocao: "neutro",
    intensidade: 3,
  };
}

app.get("/", (req, res) => {
  res.send("Backend NeuroMapa360 online 🚀");
});

app.get("/admin-metricas", async (req, res) => {
  const { count } = await supabase
    .from("memoria_emocional")
    .select("*", { count: "exact", head: true });

  res.json({
    memoria_salva: count || 0,
    status: "online",
  });
});

app.post("/ia", async (req, res) => {
  try {
    const { mensagem, user_id } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        erro: "Mensagem obrigatória",
      });
    }

    const emocaoDetectada = detectarEmocao(mensagem);

    const { data: memorias } = await supabase
      .from("memoria_emocional")
      .select("*")
      .eq("user_id", user_id || "anonimo")
      .order("created_at", { ascending: false })
      .limit(5);

    let contextoMemoria = "";

    if (memorias && memorias.length > 0) {
      contextoMemoria = memorias
        .map(
          (m) =>
            `Usuário: ${m.mensagem_usuario}\nIA: ${m.resposta_ia}\nEmoção: ${m.emocao}`
        )
        .join("\n\n");
    }

    const promptSistema = `
Você é a IA terapêutica do NeuroMapa360.

Seu papel:
- oferecer apoio emocional humano
- utilizar linguagem acolhedora
- aplicar princípios terapêuticos suaves
- utilizar abordagem inspirada em PNL e terapia neuro sistêmica
- nunca incentivar autolesão
- nunca recomendar violência
- nunca substituir profissionais de saúde
- agir com empatia profunda

Contexto emocional anterior:
${contextoMemoria}

Emoção atual detectada:
${emocaoDetectada.emocao}

Intensidade emocional:
${emocaoDetectada.intensidade}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
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
      max_tokens: 500,
    });

    const respostaIA =
      completion.choices[0].message.content ||
      "Estou aqui para te apoiar.";

    await supabase.from("memoria_emocional").insert([
      {
        user_id: user_id || "anonimo",
        mensagem_usuario: mensagem,
        resposta_ia: respostaIA,
        emocao: emocaoDetectada.emocao,
        intensidade: emocaoDetectada.intensidade,
      },
    ]);

    res.json({
      resposta: respostaIA,
      emocao: emocaoDetectada.emocao,
      intensidade: emocaoDetectada.intensidade,
      memoria_ativa: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro interno IA",
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
