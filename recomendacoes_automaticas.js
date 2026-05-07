function gerarRecomendacoes(
  perfilEmocional,
  emocaoAtual
) {

  const recomendacoes = [];

  // =========================
  // SCORE BAIXO
  // =========================

  if (perfilEmocional.score < 40) {

    recomendacoes.push({
      tipo: "protocolo_urgente",
      titulo:
        "Regulação emocional imediata",
      descricao:
        "Seu sistema emocional demonstra sinais de exaustão. Priorize desacelerar e reduzir sobrecarga mental hoje.",
    });
  }

  // =========================
  // TENDÊNCIA DE PIORA
  // =========================

  if (
    perfilEmocional.tendencia ===
    "piora"
  ) {

    recomendacoes.push({
      tipo: "prevencao_recaida",
      titulo:
        "Prevenção de recaída emocional",
      descricao:
        "Foi detectado aumento progressivo da intensidade emocional. Busque pausas mentais e reorganização emocional nas próximas horas.",
    });
  }

  // =========================
  // ANSIEDADE
  // =========================

  if (
    emocaoAtual.emocao ===
    "ansiedade"
  ) {

    recomendacoes.push({
      tipo: "respiracao_guiada",
      titulo:
        "Respiração terapêutica",
      descricao:
        "Faça ciclos respiratórios lentos: inspire por 4 segundos, segure por 4 segundos e solte lentamente.",
    });

    recomendacoes.push({
      tipo: "desaceleracao_mental",
      titulo:
        "Desaceleração cognitiva",
      descricao:
        "Evite excesso de informação e reduza estímulos mentais por alguns minutos.",
    });
  }

  // =========================
  // TRISTEZA
  // =========================

  if (
    emocaoAtual.emocao ===
    "tristeza"
  ) {

    recomendacoes.push({
      tipo: "acolhimento",
      titulo:
        "Acolhimento emocional",
      descricao:
        "Permita-se sentir sem se julgar. Emoções precisam ser processadas, não reprimidas.",
    });
  }

  // =========================
  // CULPA
  // =========================

  if (
    emocaoAtual.emocao ===
    "culpa"
  ) {

    recomendacoes.push({
      tipo: "ressignificacao",
      titulo:
        "Ressignificação emocional",
      descricao:
        "Erros não definem identidade. Reorganize a experiência como aprendizado emocional.",
    });
  }

  // =========================
  // PROCRASTINAÇÃO
  // =========================

  if (
    emocaoAtual.emocao ===
    "procrastinacao"
  ) {

    recomendacoes.push({
      tipo: "microacao",
      titulo:
        "Microação imediata",
      descricao:
        "Escolha uma tarefa extremamente pequena e execute agora por apenas 5 minutos.",
    });
  }

  // =========================
  // RAIVA
  // =========================

  if (
    emocaoAtual.emocao ===
    "raiva"
  ) {

    recomendacoes.push({
      tipo: "descompressao",
      titulo:
        "Descompressão emocional",
      descricao:
        "Evite reagir impulsivamente. Respire e permita o corpo reduzir tensão antes de agir.",
    });
  }

  return recomendacoes;
}

export default gerarRecomendacoes;
