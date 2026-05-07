function gerarIntervencaoAutomatica(
  perfilEmocional,
  heatmapData
) {

  const intervencoes = [];

  // =========================
  // SCORE CRÍTICO
  // =========================

  if (
    perfilEmocional.score < 30
  ) {

    intervencoes.push({
      prioridade: "alta",

      tipo:
        "intervencao_critica",

      titulo:
        "Apoio emocional intensivo",

      descricao:
        "Seu padrão emocional demonstra sinais importantes de exaustão emocional. Priorize desaceleração mental, descanso emocional e apoio humano.",
    });
  }

  // =========================
  // TENDÊNCIA DE PIORA
  // =========================

  if (
    perfilEmocional.tendencia ===
    "piora"
  ) {

    intervencoes.push({
      prioridade: "media",

      tipo:
        "prevencao_recaida",

      titulo:
        "Prevenção de recaída emocional",

      descricao:
        "Foi detectado aumento progressivo da intensidade emocional nos últimos registros.",
    });
  }

  // =========================
  // MADRUGADA CRÍTICA
  // =========================

  if (
    heatmapData.periodoCritico ===
    "madrugada"
  ) {

    intervencoes.push({
      prioridade: "media",

      tipo:
        "protecao_noturna",

      titulo:
        "Proteção emocional noturna",

      descricao:
        "Seus registros mostram maior vulnerabilidade emocional durante a madrugada. Evite excesso de pensamentos e estímulos nesse período.",
    });
  }

  // =========================
  // ANSIEDADE DOMINANTE
  // =========================

  if (
    perfilEmocional.emocaoDominante ===
    "ansiedade"
  ) {

    intervencoes.push({
      prioridade: "media",

      tipo:
        "regulacao_ansiedade",

      titulo:
        "Regulação do sistema nervoso",

      descricao:
        "Seu perfil emocional demonstra predominância de ansiedade. Técnicas respiratórias e desaceleração mental podem ajudar.",
    });
  }

  // =========================
  // TRISTEZA DOMINANTE
  // =========================

  if (
    perfilEmocional.emocaoDominante ===
    "tristeza"
  ) {

    intervencoes.push({
      prioridade: "media",

      tipo:
        "reconstrucao_emocional",

      titulo:
        "Reconstrução emocional",

      descricao:
        "Seu padrão emocional demonstra necessidade de acolhimento, reorganização emocional e fortalecimento interno.",
    });
  }

  // =========================
  // CULPA DOMINANTE
  // =========================

  if (
    perfilEmocional.emocaoDominante ===
    "culpa"
  ) {

    intervencoes.push({
      prioridade: "media",

      tipo:
        "ressignificacao",

      titulo:
        "Ressignificação emocional",

      descricao:
        "Seu sistema emocional demonstra excesso de autocrítica e autocobrança.",
    });
  }

  return intervencoes;
}

export default gerarIntervencaoAutomatica;
