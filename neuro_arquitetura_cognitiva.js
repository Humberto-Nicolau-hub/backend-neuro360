function analisarArquiteturaCognitiva(texto = "") {
  const mensagem = texto.toLowerCase();

  const analise = {
    crencas: [],
    sabotadores: [],
    distorcoes: [],
    feridas: [],
    padraoMental: [],
    nivelRisco: "baixo",
    resumoTerapeutico: "",
  };

  // ======================================================
  // CRENÇAS LIMITANTES
  // ======================================================

  const crencas = [
    {
      termos: [
        "não sou capaz",
        "sou incapaz",
        "não consigo",
        "sou fraco",
      ],
      tipo: "incapacidade",
    },

    {
      termos: [
        "ninguém me ama",
        "sou sozinho",
        "ninguem liga",
        "não sou importante",
      ],
      tipo: "abandono",
    },

    {
      termos: [
        "sou um fracasso",
        "fracassei",
        "não presto",
        "sou inútil",
      ],
      tipo: "desvalorizacao",
    },

    {
      termos: [
        "tenho medo",
        "vai dar errado",
        "algo ruim",
      ],
      tipo: "medo_do_futuro",
    },
  ];

  // ======================================================
  // SABOTADORES
  // ======================================================

  const sabotadores = [
    {
      termos: [
        "perfeição",
        "perfeito",
        "erro",
        "falhar",
      ],
      tipo: "perfeccionismo",
    },

    {
      termos: [
        "adiando",
        "procrastinação",
        "depois eu faço",
      ],
      tipo: "procrastinacao",
    },

    {
      termos: [
        "culpa",
        "erro meu",
        "me odeio",
      ],
      tipo: "autopunicao",
    },
  ];

  // ======================================================
  // DISTORÇÕES COGNITIVAS
  // ======================================================

  const distorcoes = [
    {
      termos: [
        "sempre",
        "nunca",
        "tudo dá errado",
      ],
      tipo: "generalizacao",
    },

    {
      termos: [
        "ninguém gosta de mim",
        "todos me odeiam",
      ],
      tipo: "leitura_mental",
    },

    {
      termos: [
        "vai acontecer algo ruim",
        "não vai dar certo",
      ],
      tipo: "catastrofizacao",
    },
  ];

  // ======================================================
  // FERIDAS EMOCIONAIS
  // ======================================================

  const feridas = [
    {
      termos: [
        "abandono",
        "sozinho",
        "ninguém ficou",
      ],
      tipo: "abandono",
    },

    {
      termos: [
        "humilhado",
        "me diminuíram",
        "não fui suficiente",
      ],
      tipo: "rejeicao",
    },

    {
      termos: [
        "traído",
        "mentiram",
        "enganado",
      ],
      tipo: "traicao",
    },
  ];

  // ======================================================
  // FUNÇÃO DE DETECÇÃO
  // ======================================================

  function detectar(lista, destino, chave) {
    lista.forEach(item => {
      item.termos.forEach(termo => {
        if (mensagem.includes(termo)) {
          destino.push(item.tipo);
        }
      });
    });
  }

  detectar(crencas, analise.crencas);
  detectar(sabotadores, analise.sabotadores);
  detectar(distorcoes, analise.distorcoes);
  detectar(feridas, analise.feridas);

  // ======================================================
  // PADRÃO MENTAL
  // ======================================================

  if (
    analise.crencas.includes("desvalorizacao") &&
    analise.sabotadores.includes("autopunicao")
  ) {
    analise.padraoMental.push("autodestrutivo");
  }

  if (
    analise.crencas.includes("medo_do_futuro") &&
    analise.distorcoes.includes("catastrofizacao")
  ) {
    analise.padraoMental.push("hipervigilancia");
  }

  if (
    analise.sabotadores.includes("perfeccionismo")
  ) {
    analise.padraoMental.push("autocobranca_extrema");
  }

  // ======================================================
  // NÍVEL DE RISCO
  // ======================================================

  const total =
    analise.crencas.length +
    analise.sabotadores.length +
    analise.distorcoes.length +
    analise.feridas.length;

  if (total >= 7) {
    analise.nivelRisco = "alto";
  } else if (total >= 4) {
    analise.nivelRisco = "medio";
  }

  // ======================================================
  // RESUMO TERAPÊUTICO
  // ======================================================

  const partes = [];

  if (analise.crencas.length > 0) {
    partes.push(
      `crenças de ${analise.crencas.join(", ")}`
    );
  }

  if (analise.sabotadores.length > 0) {
    partes.push(
      `sabotadores como ${analise.sabotadores.join(", ")}`
    );
  }

  if (analise.feridas.length > 0) {
    partes.push(
      `feridas emocionais de ${analise.feridas.join(", ")}`
    );
  }

  analise.resumoTerapeutico =
    partes.length > 0
      ? `O usuário demonstra ${partes.join(" e ")}.`
      : "Sem padrões cognitivos profundos identificados.";

  return analise;
}

module.exports = analisarArquiteturaCognitiva;
