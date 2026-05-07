function calcularScoreEmocional(memorias = []) {

  if (!memorias || memorias.length === 0) {

    return {
      score: 50,
      nivel: "neutro",
      tendencia: "estavel",
      emocaoDominante: "equilibrio",
    };
  }

  let soma = 0;

  let mapa = {
    ansiedade: 0,
    tristeza: 0,
    culpa: 0,
    procrastinacao: 0,
    raiva: 0,
  };

  memorias.forEach((m) => {

    soma += Number(m.intensidade || 0);

    if (mapa[m.emocao] !== undefined) {
      mapa[m.emocao]++;
    }
  });

  const media =
    soma / memorias.length;

  // =========================
  // SCORE
  // =========================

  let score = 100 - media * 8;

  if (score < 0) score = 0;

  if (score > 100) score = 100;

  // =========================
  // NÍVEL
  // =========================

  let nivel = "equilibrado";

  if (score < 30) {
    nivel = "critico";
  } else if (score < 50) {
    nivel = "fragil";
  } else if (score < 70) {
    nivel = "instavel";
  }

  // =========================
  // TENDÊNCIA
  // =========================

  let tendencia = "estavel";

  const ultimos =
    memorias.slice(0, 3);

  if (ultimos.length >= 2) {

    const recente =
      ultimos[0].intensidade;

    const anterior =
      ultimos[1].intensidade;

    if (recente > anterior) {
      tendencia = "piora";
    }

    if (recente < anterior) {
      tendencia = "melhora";
    }
  }

  // =========================
  // EMOÇÃO DOMINANTE
  // =========================

  const emocaoDominante =
    Object.keys(mapa).reduce(
      (a, b) =>
        mapa[a] > mapa[b]
          ? a
          : b
    );

  return {
    score: Math.round(score),
    nivel,
    tendencia,
    emocaoDominante,
  };
}

export default calcularScoreEmocional;
