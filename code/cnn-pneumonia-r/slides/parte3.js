// Slides 16-20: prática, resultados, exercícios e encerramento.
const { COR, FONTE, L, texto, titulo, cartao, destaque, codigo } = require("./tema");

function pratica(pres) {
  const s = pres.addSlide(); s.background = { color: COR.escuro };
  texto(s, "Hora da prática", { x: L.margem, y: 1.0, w: L.util, h: 1.2, fontFace: FONTE.titulo, fontSize: 48, bold: true, color: COR.branco });
  texto(s, "Vamos rodar o script no RStudio, seção por seção", { x: L.margem, y: 2.2, w: L.util, h: 0.6, fontSize: 22, color: COR.sobreEscuro });
  const secoes = ["1 · pacotes", "2 · funções", "3 · dados", "4 · tensores", "5 · a CNN", "6 · treino", "7 · teste", "8 · em ação"];
  secoes.forEach((nome, i) => {
    const x = L.margem + (i % 4) * 3.1, y = 3.3 + Math.floor(i / 4) * 1.4;
    cartao(pres, s, x, y, 2.85, 1.1, "1A2A40");
    texto(s, nome, { x: x + 0.25, y, w: 2.4, h: 1.1, fontSize: 20, bold: true, color: COR.branco, valign: "middle" });
  });
  s.addNotes("[18:00–25:00] PRÁTICA NO RSTUDIO (câmera opcional aqui). Rode seção por seção com Ctrl+Enter e comente o que aparece: seção 3 mostra os 10 raios-X e o table() com 1214 × 3494; seção 5 imprime a rede e os 105.346 parâmetros; seção 6 mostra a perda caindo e a AUC da validação subindo a cada época; seção 7 dá a matriz de confusão; seção 8 mostra a rede diagnosticando raios-X do teste.");
}

function resultados(pres) {
  const s = pres.addSlide(); titulo(s, "Resultado no teste: 624 raios-X novos");
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ align: "center", valign: "middle" }, o) });
  s.addTable([
    [c(""), c("previsto: normal", { bold: true }), c("previsto: pneumonia", { bold: true })],
    [c("verdadeiro: normal", { bold: true }), c("158", { fill: { color: "C8EBDD" }, bold: true }), c("76", { fill: { color: "FAD3C2" }, bold: true })],
    [c("verdadeiro: pneumonia", { bold: true }), c("6", { fill: { color: "FAD3C2" }, bold: true }), c("384", { fill: { color: "C8EBDD" }, bold: true })],
  ], { x: L.margem, y: 1.6, w: 7.3, colW: [2.5, 2.4, 2.4], rowH: 1.0, fontFace: FONTE.corpo, fontSize: 18, border: { type: "solid", color: COR.branco, pt: 2 }, fill: { color: COR.cartao } });
  texto(s, "Verde: acertos · laranja: erros", { x: L.margem, y: 4.75, w: 7.3, h: 0.4, fontSize: 13, color: COR.tintaFraca });
  destaque(pres, s, 8.4, 1.6, 4.33, 1.55, "86,9%", "acurácia: 542 de 624 acertos", { tamanho: 32 });
  destaque(pres, s, 8.4, 3.3, 4.33, 1.55, "98,5%", "das pneumonias detectadas (384 de 390)", { tamanho: 32 });
  destaque(pres, s, 8.4, 5.0, 4.33, 1.55, "67,5%", "dos normais reconhecidos (158 de 234)", { tamanho: 32, corNumero: COR.destaque });
  s.addNotes("[25:00–26:15] Leia a matriz: a diagonal são os acertos. A rede quase não deixa passar pneumonia — só 6 em 390 —, mas dá alarme falso em 76 das 234 crianças saudáveis.");
}

function licoes(pres) {
  const s = pres.addSlide(); titulo(s, "O que o resultado ensina");
  cartao(pres, s, L.margem, 1.6, 5.9, 5.0);
  texto(s, "1. O viés vem dos dados", { x: L.margem + 0.3, y: 1.85, w: 5.3, h: 0.6, fontFace: FONTE.titulo, fontSize: 22, bold: true });
  texto(s, "Com 74% de pneumonia no treino, a rede aprendeu que, na dúvida, “pneumonia” costuma acertar. Resultado: 76 alarmes falsos contra 6 casos perdidos. Num diagnóstico, qual desses erros é pior?",
    { x: L.margem + 0.3, y: 2.6, w: 5.3, h: 3.6, fontSize: 17 });
  cartao(pres, s, 6.83, 1.6, 5.9, 5.0);
  texto(s, "2. Tamanho não é tudo", { x: 7.13, y: 1.85, w: 5.3, h: 0.6, fontFace: FONTE.titulo, fontSize: 22, bold: true });
  s.addTable([
    [{ text: "", options: {} }, { text: "pesos", options: { bold: true, align: "right" } }, { text: "acurácia", options: { bold: true, align: "right" } }],
    ["nossa CNN", { text: "105 mil", options: { align: "right" } }, { text: "86,9%", options: { align: "right" } }],
    ["ResNet-18", { text: "11,2 milhões", options: { align: "right" } }, { text: "87,2%", options: { align: "right" } }],
  ], { x: 7.13, y: 2.65, w: 5.3, colW: [1.8, 1.9, 1.6], rowH: 0.5, fontFace: FONTE.corpo, fontSize: 16, border: { type: "solid", color: COR.grade, pt: 1 } });
  texto(s, "A ResNet-18 é a rede de referência do artigo MedMNIST v2, treinada nesta mesma base. Uma CNN 100 vezes menor chega perto da mesma acurácia.",
    { x: 7.13, y: 4.4, w: 5.3, h: 2, fontSize: 16 });
  s.addNotes("[26:15–27:15] Duas lições. Primeira: a rede herdou o desbalanceamento dos dados. Segunda: para imagens pequenas assim, uma rede simples já chega perto de uma arquitetura de 11 milhões de parâmetros.");
}

function exercicios(pres) {
  const s = pres.addSlide(); titulo(s, "Exercícios");
  const ex = [
    ["1. Mude o corte", "Na seção 7, troque 0.5 por 0.9 em  p_teste > 0.5 . O que acontece com os alarmes falsos e com as pneumonias detectadas? (não precisa retreinar)"],
    ["2. Pese as classes", "Na seção 6, acrescente  weight = torch_tensor(c(1.94, 0.67))  na nnf_cross_entropy. A matriz de confusão fica mais equilibrada?"],
    ["3. Mais ou menos filtros", "Troque 16 e 32 por 8 e 16, depois por 32 e 64 (lembre de ajustar o 32 * 7 * 7 da fc1). Quantos pesos? E a acurácia?"],
    ["4. Provoque overfitting", "Tire o dropout e treine 30 épocas. Compare a perda do treino com a AUC da validação."],
  ];
  ex.forEach(([nome, desc], i) => {
    const x = L.margem + (i % 2) * 6.23, y = 1.55 + Math.floor(i / 2) * 2.7;
    cartao(pres, s, x, y, 5.9, 2.45);
    texto(s, nome, { x: x + 0.3, y: y + 0.2, w: 5.3, h: 0.5, fontFace: FONTE.titulo, fontSize: 20, bold: true, color: COR.destaque });
    texto(s, desc, { x: x + 0.3, y: y + 0.8, w: 5.3, h: 1.5, fontSize: 15 });
  });
  s.addNotes("[27:15–28:30] Proponha os exercícios. Dica para o 1: é a troca entre sensibilidade e especificidade. Os pesos do 2 são o inverso da frequência de cada classe no treino (4708 / (2 × 1214) e 4708 / (2 × 3494)).");
}

function encerramento(pres) {
  const s = pres.addSlide(); s.background = { color: COR.escuro };
  texto(s, "Resumindo", { x: L.margem, y: 0.7, w: 6, h: 0.4, fontSize: 14, color: COR.sobreEscuro, charSpacing: 2 });
  texto(s, [
    { text: "A CNN aprende filtros que encontram padrões na imagem, do simples ao complexo.", options: { bullet: true, breakLine: true } },
    { text: "Com torch, o R treina uma CNN de ponta a ponta, sem Python.", options: { bullet: true, breakLine: true } },
    { text: "Uma rede de 105 mil pesos acertou 86,9% dos raios-X de teste — e herdou o viés dos dados.", options: { bullet: true } },
  ], { x: L.margem, y: 1.2, w: L.util, h: 2.8, fontSize: 22, color: COR.branco, paraSpaceAfter: 12 });
  texto(s, [
    { text: "Referências", options: { bold: true, breakLine: true } },
    { text: "LeCun et al. Gradient-based learning applied to document recognition. Proc. IEEE 86(11), 1998.", options: { breakLine: true } },
    { text: "Goodfellow, Bengio, Courville. Deep Learning. MIT Press, 2016.", options: { breakLine: true } },
    { text: "Kermany et al. Identifying medical diagnoses and treatable diseases by image-based deep learning. Cell 172(5), 2018.", options: { breakLine: true } },
    { text: "Yang et al. MedMNIST v2. Scientific Data 10, 41, 2023.  ·  torch para R: torch.mlverse.org", options: {} },
  ], { x: L.margem, y: 4.3, w: L.util, h: 2.6, fontSize: 13, color: COR.sobreEscuro });
  s.addNotes("[28:30–29:00] Feche com o resumo em três frases e agradeça.");
}

module.exports = { pratica, resultados, licoes, exercicios, encerramento };
