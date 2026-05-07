function verificarPlano(
  usuario = {},
  totalMensagens = 0
) {

  // =========================
  // PREMIUM
  // =========================

  if (usuario.premium === true) {

    return {
      premium: true,

      limiteAtingido: false,

      plano:
        "premium",

      recursos: {
        memoriaAvancada: true,
        trilhasPremium: true,
        scoreEmocional: true,
        heatmap: true,
        intervencoes: true,
        sessoesIlimitadas: true,
      },
    };
  }

  // =========================
  // FREE
  // =========================

  const limiteFree = 20;

  const restante =
    limiteFree - totalMensagens;

  if (
    totalMensagens >= limiteFree
  ) {

    return {
      premium: false,

      limiteAtingido: true,

      plano:
        "free",

      restante: 0,

      recursos: {
        memoriaAvancada: false,
        trilhasPremium: false,
        scoreEmocional: false,
        heatmap: false,
        intervencoes: false,
        sessoesIlimitadas: false,
      },
    };
  }

  return {
    premium: false,

    limiteAtingido: false,

    plano:
      "free",

    restante,

    recursos: {
      memoriaAvancada: false,
      trilhasPremium: false,
      scoreEmocional: true,
      heatmap: false,
      intervencoes: false,
      sessoesIlimitadas: false,
    },
  };
}

export default verificarPlano;
