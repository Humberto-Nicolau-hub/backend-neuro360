function gerarHeatmapEmocional(memorias = []) {

  const heatmap = {
    madrugada: {
      ansiedade: 0,
      tristeza: 0,
      culpa: 0,
      procrastinacao: 0,
      raiva: 0,
    },

    manha: {
      ansiedade: 0,
      tristeza: 0,
      culpa: 0,
      procrastinacao: 0,
      raiva: 0,
    },

    tarde: {
      ansiedade: 0,
      tristeza: 0,
      culpa: 0,
      procrastinacao: 0,
      raiva: 0,
    },

    noite: {
      ansiedade: 0,
      tristeza: 0,
      culpa: 0,
      procrastinacao: 0,
      raiva: 0,
    },
  };

  memorias.forEach((m) => {

    const data =
      new Date(m.created_at);

    const hora =
      data.getHours();

    let periodo = "manha";

    if (hora >= 0 && hora < 6) {
      periodo = "madrugada";
    }

    if (hora >= 6 && hora < 12) {
      periodo = "manha";
    }

    if (hora >= 12 && hora < 18) {
      periodo = "tarde";
    }

    if (hora >= 18) {
      periodo = "noite";
    }

    if (
      heatmap[periodo][m.emocao] !== undefined
    ) {
      heatmap[periodo][m.emocao]++;
    }
  });

  // =========================
  // DETECTA PADRÃO DOMINANTE
  // =========================

  let periodoCritico = "nenhum";

  let maior = 0;

  Object.keys(heatmap).forEach((periodo) => {

    const total =
      Object.values(
        heatmap[periodo]
      ).reduce((a, b) => a + b, 0);

    if (total > maior) {
      maior = total;
      periodoCritico = periodo;
    }
  });

  return {
    heatmap,
    periodoCritico,
  };
}

export default gerarHeatmapEmocional;
