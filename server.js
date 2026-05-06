import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function detectarEmocao(texto) {
  const t = texto.toLowerCase();

  if (
    t.includes("ansiedade") ||
    t.includes("ansioso") ||
    t.includes("medo") ||
    t.includes("pânico")
  ) {
    return "ansiedade";
  }

  if (
    t.includes("triste") ||
    t.includes("depressão") ||
    t.includes("sozinho")
  ) {
    return "tristeza";
  }

  if (
    t.includes("cansado") ||
    t.includes("desmotivado") ||
    t.includes("procrastinação")
  ) {
    return "desmotivação";
  }

  return "emocional";
}

function gerarResposta(emocao, mensagem, memoriaAnterior) {

  if (emocao === "ansiedade") {

    if (memoriaAnterior?.emocao === "ansiedade") {
      return `
Percebo que essa ansiedade continua retornando, e isso mostra que sua mente está em estado constante de alerta emocional.

Vamos desacelerar juntos agora.

Quero que você observe:
- o que mais tem consumido sua energia mental
- quais pensamentos ficam repetindo
- qual sensação física aparece primeiro

Você não precisa resolver tudo imediatamente.
Seu corpo primeiro precisa sentir segurança novamente.

Respire lentamente.
Estou aqui com você.
      `;
    }

    return `
Entendo que essa ansiedade esteja pesando dentro de você agora.

Seu sistema emocional provavelmente entrou em estado de sobrecarga mental, e isso pode gerar:
- pensamentos acelerados
- tensão física
- medo do futuro
- sensação de perda de controle

Mas seu corpo pode voltar ao equilíbrio.

Quero que você faça algo simples:
respire profundamente por 4 segundos,
segure por 4 segundos,
e solte lentamente.

Seu cérebro precisa perceber que você está seguro.
      `;
  }

  if (emocao === "tristeza") {
    return `
Sinto muito que você esteja carregando essa tristeza.

Às vezes a mente entra em exaustão emocional silenciosa.
E quando emoções ficam guardadas por muito tempo, o corpo começa a sentir tudo mais pesado.

Não tente lutar contra sua emoção agora.
Primeiro permita sentir.

Depois vamos reconstruindo aos poucos sua energia emocional.
Você não está sozinho.
    `;
  }

  if (emocao === "desmotivação") {
    return `
A desmotivação geralmente não significa preguiça.

Na maioria das vezes ela é resultado de:
- excesso emocional
- frustração acumulada
- mente cansada
- pressão interna constante

Você não precisa recuperar toda sua energia hoje.

Só precisa dar um pequeno próximo passo.
Pequenos movimentos começam a destravar grandes mudanças.
    `;
  }

  return `
Estou aqui com você.

Quero entender melhor:
o que mais está pesando emocionalmente dentro de você hoje?
  `;
}

app.get("/", (req, res) => {
  res.send("Backend NeuroMapa360 online 🚀");
});

app.post("/ia", async (req, res) => {

  try {

    const { mensagem, user_id } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        erro: "Mensagem obrigatória"
      });
    }

    const emocao = detectarEmocao(mensagem);

    const { data: memoriaAnterior } = await supabase
      .from("memoria_emocional")
      .select("*")
      .eq("user_id", user_id || "anonimo")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const resposta = gerarResposta(
      emocao,
      mensagem,
      memoriaAnterior
    );

    await supabase
      .from("memoria_emocional")
      .insert([
        {
          user_id: user_id || "anonimo",
          mensagem_usuario: mensagem,
          resposta_ia: resposta,
          emocao,
          intensidade: 7
        }
      ]);

    res.json({
      resposta,
      emocao,
      memoria_ativa: !!memoriaAnterior
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      erro: "Erro interno IA"
    });
  }
});

app.get("/admin/dashboard", async (req, res) => {

  try {

    const { count: totalMemorias } = await supabase
      .from("memoria_emocional")
      .select("*", { count: "exact", head: true });

    const { data: memorias } = await supabase
      .from("memoria_emocional")
      .select("*");

    let ansiedade = 0;
    let tristeza = 0;
    let desmotivacao = 0;

    memorias?.forEach((m) => {

      if (m.emocao === "ansiedade") ansiedade++;
      if (m.emocao === "tristeza") tristeza++;
      if (m.emocao === "desmotivação") desmotivacao++;
    });

    let emocaoDominante = "emocional";

    if (ansiedade >= tristeza && ansiedade >= desmotivacao) {
      emocaoDominante = "ansiedade";
    }

    if (tristeza >= ansiedade && tristeza >= desmotivacao) {
      emocaoDominante = "tristeza";
    }

    if (desmotivacao >= ansiedade && desmotivacao >= tristeza) {
      emocaoDominante = "desmotivação";
    }

    res.json({
      totalUsuarios: 10,
      premium: 4,
      totalRegistros: totalMemorias || 0,
      totalMemorias: totalMemorias || 0,
      conversao: 40,
      receita: 297,
      emocaoDominante
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      erro: "Erro dashboard"
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
