function detectarEmocao(texto = "") {
  const mensagem = texto.toLowerCase();

  const emocaoDetectada = {
    emocao: "neutro",
    intensidade: 1,
    vibracao: 200,
    categoria: "equilibrio",
    gatilhos: [],
  };

  // =========================
  // ANSIEDADE
  // =========================

  const ansiedade = [
    "ansiedade",
    "ansioso",
    "medo",
    "preocupado",
    "preocupação",
    "nervoso",
    "pânico",
    "panico",
    "não consigo respirar",
    "agonia",
    "aperto no peito",
    "desespero",
    "crise",
  ];

  // =========================
  // TRISTEZA
  // =========================

  const tristeza = [
    "triste",
    "desanimado",
    "sozinho",
    "solidão",
    "sem esperança",
    "vazio",
    "depressivo",
    "depressão",
    "não tenho vontade",
    "cansado da vida",
  ];

  // =========================
  // CULPA
  // =========================

  const culpa = [
    "culpa",
    "fracasso",
    "erro meu",
    "não sou suficiente",
    "me odeio",
    "não presto",
    "incapaz",
    "sou inútil",
  ];

  // =========================
  // PROCRASTINAÇÃO
  // =========================

  const procrastinacao = [
    "procrastinação",
    "não consigo agir",
    "adiando",
    "travado",
    "sem foco",
    "preguiça",
    "desmotivado",
  ];

  // =========================
  // RAIVA
  // =========================

  const raiva = [
    "raiva",
    "ódio",
    "odio",
    "irritado",
    "estressado",
    "revoltado",
    "nervoso",
  ];

  // =========================
  // DETECÇÃO
  // =========================

  function verificar(lista, emocao, intensidade, vibracao, categoria) {
    for (const palavra of lista) {
      if (mensagem.includes(palavra)) {
        emocaoDetectada.emocao = emocao;
        emocaoDetectada.intensidade = intensidade;
        emocaoDetectada.vibracao = vibracao;
        emocaoDetectada.categoria = categoria;
        emocaoDetectada.gatilhos.push(palavra);
      }
    }
  }

  verificar(ansiedade, "ansiedade", 8, 100, "sobrevivencia");
  verificar(tristeza, "tristeza", 7, 75, "desanimo");
  verificar(culpa, "culpa", 9, 50, "autopunicao");
  verificar(procrastinacao, "procrastinacao", 6, 150, "bloqueio");
  verificar(raiva, "raiva", 7, 150, "reatividade");

  // =========================
  // AJUSTE DE INTENSIDADE
  // =========================

  if (
    mensagem.includes("muito") ||
    mensagem.includes("demais") ||
    mensagem.includes("forte")
  ) {
    emocaoDetectada.intensidade += 1;
  }

  if (
    mensagem.includes("extrema") ||
    mensagem.includes("insuportável") ||
    mensagem.includes("não aguento")
  ) {
    emocaoDetectada.intensidade += 2;
  }

  // =========================
  // LIMITADOR
  // =========================

  if (emocaoDetectada.intensidade > 10) {
    emocaoDetectada.intensidade = 10;
  }

  return emocaoDetectada;
}

// =========================
// EXPORT ES MODULE
// =========================

export default detectarEmocao;
