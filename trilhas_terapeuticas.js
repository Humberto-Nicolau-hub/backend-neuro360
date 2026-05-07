function gerarTrilhaTerapêutica(
  perfilEmocional,
  emocaoAtual
) {

  const trilha = {
    nome: "",
    objetivo: "",
    etapas: [],
  };

  // =========================
  // ANSIEDADE
  // =========================

  if (
    emocaoAtual.emocao ===
    "ansiedade"
  ) {

    trilha.nome =
      "Regulação da Ansiedade";

    trilha.objetivo =
      "Desacelerar mente e reorganizar segurança emocional.";

    trilha.etapas = [
      {
        titulo:
          "Respiração terapêutica",
        descricao:
          "Respire lentamente por 5 ciclos completos.",
      },

      {
        titulo:
          "Descompressão mental",
        descricao:
          "Reduza estímulos mentais e excesso de informação.",
      },

      {
        titulo:
          "Ancoragem emocional",
        descricao:
          "Lembre um momento de segurança emocional e conecte-se a essa sensação.",
      },

      {
        titulo:
          "Reestruturação cognitiva",
        descricao:
          "Questione pensamentos catastróficos automáticos.",
      },
    ];
  }

  // =========================
  // TRISTEZA
  // =========================

  if (
    emocaoAtual.emocao ===
    "tristeza"
  ) {

    trilha.nome =
      "Reconstrução Emocional";

    trilha.objetivo =
      "Fortalecer estabilidade emocional e reduzir sensação de vazio.";

    trilha.etapas = [
      {
        titulo:
          "Acolhimento emocional",
        descricao:
          "Permita sentir emoções sem julgamento.",
      },

      {
        titulo:
          "Reconexão interna",
        descricao:
          "Liste pequenas coisas que ainda possuem significado emocional.",
      },

      {
        titulo:
          "Ativação emocional leve",
        descricao:
          "Realize pequenas ações que tragam movimento emocional positivo.",
      },
    ];
  }

  // =========================
  // CULPA
  // =========================

  if (
    emocaoAtual.emocao ===
    "culpa"
  ) {

    trilha.nome =
      "Ressignificação Emocional";

    trilha.objetivo =
      "Reduzir autocrítica e reorganizar percepção emocional.";

    trilha.etapas = [
      {
        titulo:
          "Separar erro de identidade",
        descricao:
          "Você cometeu um erro, mas não é o erro.",
      },

      {
        titulo:
          "Reinterpretação emocional",
        descricao:
          "Transforme experiência em aprendizado emocional.",
      },

      {
        titulo:
          "Autocompaixão guiada",
        descricao:
          "Fale consigo da forma que falaria com alguém que ama.",
      },
    ];
  }

  // =========================
  // PROCRASTINAÇÃO
  // =========================

  if (
    emocaoAtual.emocao ===
    "procrastinacao"
  ) {

    trilha.nome =
      "Desbloqueio de Ação";

    trilha.objetivo =
      "Reduzir bloqueio emocional e iniciar movimento progressivo.";

    trilha.etapas = [
      {
        titulo:
          "Microação",
        descricao:
          "Escolha uma ação extremamente pequena.",
      },

      {
        titulo:
          "Quebra de sobrecarga",
        descricao:
          "Divida tarefas em partes mínimas.",
      },

      {
        titulo:
          "Movimento progressivo",
        descricao:
          "Foque em continuidade, não perfeição.",
      },
    ];
  }

  // =========================
  // RAIVA
  // =========================

  if (
    emocaoAtual.emocao ===
    "raiva"
  ) {

    trilha.nome =
      "Regulação da Reatividade";

    trilha.objetivo =
      "Reduzir impulsividade e reorganizar tensão emocional.";

    trilha.etapas = [
      {
        titulo:
          "Respiração lenta",
        descricao:
          "Reduza ativação fisiológica antes de agir.",
      },

      {
        titulo:
          "Distanciamento emocional",
        descricao:
          "Observe a emoção antes de reagir.",
      },

      {
        titulo:
          "Reorganização emocional",
        descricao:
          "Identifique qual dor emocional existe por trás da raiva.",
      },
    ];
  }

  // =========================
  // NEUTRO
  // =========================

  if (!trilha.nome) {

    trilha.nome =
      "Equilíbrio Emocional";

    trilha.objetivo =
      "Manter estabilidade emocional progressiva.";

    trilha.etapas = [
      {
        titulo:
          "Autopercepção",
        descricao:
          "Observe seus padrões emocionais diariamente.",
      },
    ];
  }

  return trilha;
}

export default gerarTrilhaTerapêutica;
