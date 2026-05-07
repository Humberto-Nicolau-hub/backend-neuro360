function gerarRespostaPNL(emocaoData, mensagemUsuario) {
  const {
    emocao,
    intensidade,
    vibracao,
    categoria,
  } = emocaoData;

  // =========================
  // ANSIEDADE
  // =========================

  if (emocao === "ansiedade") {
    return `
Percebo que sua mente está acelerada neste momento.

Quando a ansiedade aumenta, normalmente o cérebro entra em modo de sobrevivência e começa a imaginar cenários futuros negativos.

Agora faça algo simples comigo:

1. Respire lentamente.
2. Inspire por 4 segundos.
3. Segure por 4 segundos.
4. Solte devagar.

Repita isso algumas vezes.

Você não é sua ansiedade.
Esse estado emocional é temporário.

Quero que me diga:
o que mais está pesando dentro de você agora?
`;
  }

  // =========================
  // TRISTEZA
  // =========================

  if (emocao === "tristeza") {
    return `
Sinto que existe um peso emocional importante dentro de você neste momento.

A tristeza profunda costuma fazer o cérebro acreditar que nada vai mudar, mas isso não é verdade.

Você não precisa resolver toda sua vida agora.

Neste momento:
- respire
- desacelere
- permita-se existir sem se cobrar tanto

Quero te fazer uma pergunta terapêutica:

qual situação mais machucou você recentemente?
`;
  }

  // =========================
  // CULPA
  // =========================

  if (emocao === "culpa") {
    return `
Percebo sinais de autocrítica muito forte.

A culpa excessiva faz o cérebro acreditar que você merece punição emocional.

Mas erros não definem quem você é.

Na PNL trabalhamos uma ideia importante:
todo comportamento teve uma intenção emocional positiva em algum nível.

Você pode aprender sem se destruir.

Me diga:
o que exatamente você sente que deveria ter feito diferente?
`;
  }

  // =========================
  // PROCRASTINAÇÃO
  // =========================

  if (emocao === "procrastinacao") {
    return `
O que você chama de procrastinação muitas vezes é sobrecarga emocional silenciosa.

Seu cérebro pode estar tentando evitar dor, pressão ou medo de falhar.

Então vamos reduzir o peso disso.

Não pense na tarefa inteira.

Qual seria o menor passo possível que você conseguiria fazer agora em menos de 5 minutos?
`;
  }

  // =========================
  // RAIVA
  // =========================

  if (emocao === "raiva") {
    return `
Existe uma carga emocional intensa dentro de você agora.

A raiva geralmente aparece quando alguma dor interna não foi acolhida.

Antes de reagir:
respire.

Nem toda emoção precisa virar ação imediata.

Quero entender:
o que aconteceu que despertou essa revolta em você?
`;
  }

  // =========================
  // NEUTRO
  // =========================

  return `
Estou aqui com você.

Pode me contar com calma o que está acontecendo dentro da sua mente neste momento.

Quero compreender melhor suas emoções para te ajudar de forma mais profunda.
`;
}

export default gerarRespostaPNL;
