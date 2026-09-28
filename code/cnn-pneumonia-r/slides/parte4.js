// Slides 25-29: prática, resultados, lições, exercícios e encerramento.
const { COR, FONTE, L, texto, titulo, cartao, destaque, paragrafos } = require("./tema");

function pratica(pres) {
  const s = pres.addSlide(); s.background = { color: COR.escuro };
  texto(s, "Hora da prática", { x: L.margem, y: 0.8, w: L.util, h: 1.1, fontFace: FONTE.titulo, fontSize: 48, bold: true, color: COR.branco });
  texto(s, "O script cnn_pneumonia.R no RStudio, uma seção de cada vez (selecione e aperte Ctrl+Enter)", { x: L.margem, y: 1.95, w: L.util, h: 0.6, fontSize: 20, color: COR.sobreEscuro });
  const secoes = [["1 · pacotes", "carrega o torch"], ["2 · funções", "ler o arquivo, desenhar, AUC"], ["3 · dados", "ler e ver 10 raios-X"], ["4 · tensores", "preparar() e os lotes"],
    ["5 · a CNN", "montar a rede e contar os pesos"], ["6 · treino", "10 épocas, perda e AUC"], ["7 · teste", "acurácia e matriz de confusão"], ["8 · em ação", "8 raios-X com a resposta da rede"]];
  secoes.forEach(([nome, desc], i) => {
    const x = L.margem + (i % 4) * 3.1, y = 3.0 + Math.floor(i / 4) * 1.95;
    cartao(pres, s, x, y, 2.85, 1.65, COR.codigo);
    texto(s, nome, { x: x + 0.25, y: y + 0.2, w: 2.4, h: 0.5, fontSize: 20, bold: true, color: COR.branco });
    texto(s, desc, { x: x + 0.25, y: y + 0.75, w: 2.4, h: 0.75, fontSize: 14, color: COR.sobreEscuro });
  });
  s.addNotes("[21:50–25:20] PRÁTICA NO RSTUDIO (câmera opcional aqui). Rode seção por seção e comente o que aparece. Seção 3: os 10 raios-X e a contagem 1214 normal × 3494 pneumonia. Seção 5: a rede impressa e o total de 105.346 pesos. Seção 6: a cada época, a perda cai e a AUC da validação sobe. Seção 7: acurácia, AUC e matriz de confusão do teste. Seção 8: a rede dando a probabilidade de pneumonia de raios-X que ela nunca viu.");
}

function resultados(pres, notas) {
  const s = pres.addSlide(); titulo(s, "Resultado no teste: 624 raios-X novos");
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ align: "center", valign: "middle" }, o) });
  s.addTable([
    [c(""), c("previsto: normal", { bold: true }), c("previsto: pneumonia", { bold: true })],
    [c("real: normal", { bold: true }), c("158", { fill: { color: "C8EBDD" }, bold: true }), c("76", { fill: { color: "FAD3C2" }, bold: true })],
    [c("real: pneumonia", { bold: true }), c("6", { fill: { color: "FAD3C2" }, bold: true }), c("384", { fill: { color: "C8EBDD" }, bold: true })],
  ], { x: L.margem, y: 1.5, w: 7.3, colW: [2.5, 2.4, 2.4], rowH: 1.0, fontFace: FONTE.corpo, fontSize: 18, border: { type: "solid", color: COR.branco, pt: 2 }, fill: { color: COR.cartao } });
  paragrafos(s, [
    ["Matriz de confusão: ", "cada linha é o diagnóstico real; cada coluna, o que a rede previu. Verde: acertos. Laranja: erros."],
    ["76 alarmes falsos: ", "crianças saudáveis classificadas como pneumonia."],
    ["6 pneumonias perdidas: ", "crianças doentes classificadas como normais."],
  ], { x: L.margem, y: 4.75, w: 7.3, h: 2.3, fontSize: 16, paraSpaceAfter: 8 });
  destaque(pres, s, 8.4, 1.5, 4.33, 1.7, "86,9%", "acurácia: 542 acertos em 624", { tamanho: 32 });
  destaque(pres, s, 8.4, 3.35, 4.33, 1.7, "98,5%", "sensibilidade: das 390 pneumonias, 384 detectadas", { tamanho: 32 });
  destaque(pres, s, 8.4, 5.2, 4.33, 1.7, "67,5%", "especificidade: dos 234 normais, 158 reconhecidos", { tamanho: 32, corNumero: COR.destaque });
  s.addNotes(notas || "[25:20–26:15] Leia a matriz: a diagonal são os acertos. A rede quase não deixa passar pneumonia — só 6 em 390 —, mas dá alarme falso em 76 das 234 crianças saudáveis. Se a execução da gravação der números um pouco diferentes, leia os da tela.");
}

function licoes(pres) {
  const s = pres.addSlide(); titulo(s, "O que o resultado ensina");
  [["1. A rede herda o desequilíbrio dos dados",
    "74% dos raios-X de treino são de pneumonia. O treino diminui o erro médio, e como há quase 3 pneumonias para cada normal, os erros em pneumonias pesam mais nessa média. Os pesos ficam ajustados para favorecer pneumonia: em imagens de padrão pouco claro, a probabilidade calculada tende a passar de 50% para pneumonia. Daí 76 alarmes falsos contra 6 pneumonias perdidas."],
   ["2. O corte de 50% é uma escolha",
    "A rede entrega uma probabilidade. Quem decide a partir de quanto chamar de pneumonia é quem usa o modelo. Subir o corte reduz os alarmes falsos, mas deixa passar mais pneumonias. Em saúde, deixar passar uma doença costuma ser o erro mais grave. O exercício 1 explora essa troca."],
  ].forEach(([nome, desc], i) => {
    const x = L.margem + i * 6.23;
    cartao(pres, s, x, 1.5, 5.9, 5.4);
    texto(s, nome, { x: x + 0.3, y: 1.75, w: 5.3, h: 0.9, fontFace: FONTE.titulo, fontSize: 22, bold: true });
    texto(s, desc, { x: x + 0.3, y: 2.8, w: 5.3, h: 3.9, fontSize: 17 });
  });
  s.addNotes("[26:15–27:10] Duas lições. A primeira: a rede não tem opinião; ela aprendeu a diminuir o erro médio num treino em que a maioria é pneumonia, e isso a empurra para esse lado. A segunda: a probabilidade é da rede, mas o corte é uma decisão de quem usa o modelo, e depende do custo de cada tipo de erro.");
}

function exercicios(pres) {
  const s = pres.addSlide(); titulo(s, "Exercícios");
  const ex = [
    ["1. Mude o corte", "Na seção 7, troque 0.5 por 0.9 e rode a seção de novo (não precisa treinar):", "previsto <- as.integer(p_teste > 0.9)", "O que acontece com os alarmes falsos? E com as pneumonias perdidas?"],
    ["2. Pese as classes", "Na seção 6, troque a linha da perda por esta e rode de novo as seções 5, 6 e 7:", "perda <- nnf_cross_entropy(previsao, lote[[2]],\n  weight = torch_tensor(c(1.94, 0.67)))", "O peso maior vai para os normais, que são minoria. A matriz fica mais equilibrada?"],
    ["3. Mais filtros", "Na seção 5, dobre os filtros das duas convoluções e ajuste a entrada da camada densa:", "nn_conv2d(1, 32, ...)    nn_conv2d(32, 64, ...)\nself$densa <- nn_linear(64 * 7 * 7, 64)", "Quantos pesos a rede passa a ter? A acurácia melhora?"],
    ["4. Provoque overfitting", "Na seção 5, apague a linha do dropout no forward. Na seção 6, troque 1:10 por 1:30.", "x <- self$dropout(x)    # apagar esta linha", "A perda do treino continua caindo? E a AUC da validação?"],
  ];
  ex.forEach(([nome, oque, cod, pergunta], i) => {
    const x = L.margem + (i % 2) * 6.23, y = 1.35 + Math.floor(i / 2) * 2.95;
    cartao(pres, s, x, y, 5.9, 2.8);
    texto(s, nome, { x: x + 0.3, y: y + 0.15, w: 5.3, h: 0.45, fontFace: FONTE.titulo, fontSize: 20, bold: true, color: COR.destaque });
    texto(s, oque, { x: x + 0.3, y: y + 0.6, w: 5.3, h: 0.65, fontSize: 13 });
    cartao(pres, s, x + 0.3, y + 1.3, 5.3, 0.75, COR.codigo);
    texto(s, cod, { x: x + 0.45, y: y + 1.3, w: 5.0, h: 0.75, fontFace: FONTE.codigo, fontSize: 12, color: COR.branco, valign: "middle" });
    texto(s, pergunta, { x: x + 0.3, y: y + 2.1, w: 5.3, h: 0.6, fontSize: 13, italic: true });
  });
  s.addNotes("[27:10–28:15] Proponha os exercícios, do mais fácil ao mais difícil. Dica do 1: é a troca entre sensibilidade e especificidade. Os pesos do 2 são o inverso da frequência de cada classe no treino: 4708 / (2 × 1214) = 1,94 e 4708 / (2 × 3494) = 0,67.");
}

function encerramento(pres) {
  const s = pres.addSlide(); s.background = { color: COR.escuro };
  texto(s, "Resumindo", { x: L.margem, y: 0.6, w: 6, h: 0.4, fontSize: 14, color: COR.sobreEscuro, charSpacing: 2 });
  texto(s, [
    { text: "Uma CNN procura padrões na imagem com filtros aprendidos no treino e depois combina esses padrões para decidir.", options: { bullet: true, breakLine: true } },
    { text: "Ela aprende medindo o erro (entropia cruzada) e ajustando os pesos para diminuí-lo (backpropagation e Adam).", options: { bullet: true, breakLine: true } },
    { text: "Em R, o pacote torch monta e treina a rede: 105 mil pesos, 86,9% de acerto em raios-X nunca vistos.", options: { bullet: true, breakLine: true } },
    { text: "A rede herda o desequilíbrio dos dados: só a acurácia não basta para avaliar.", options: { bullet: true } },
  ], { x: L.margem, y: 1.1, w: L.util, h: 3.3, fontSize: 20, color: COR.branco, paraSpaceAfter: 10 });
  texto(s, [
    { text: "Referências", options: { bold: true, breakLine: true } },
    { text: "LeCun et al. Gradient-based learning applied to document recognition. Proc. IEEE 86(11), 1998.", options: { breakLine: true } },
    { text: "Goodfellow, Bengio, Courville. Deep Learning. MIT Press, 2016.", options: { breakLine: true } },
    { text: "Kermany et al. Identifying medical diagnoses and treatable diseases by image-based deep learning. Cell 172(5), 2018.", options: { breakLine: true } },
    { text: "Yang et al. MedMNIST v2. Scientific Data 10, 41, 2023.  ·  Pacote torch para R: torch.mlverse.org", options: {} },
  ], { x: L.margem, y: 4.7, w: L.util, h: 2.3, fontSize: 13, color: COR.sobreEscuro });
  s.addNotes("[28:15–28:40] Feche com o resumo e agradeça.");
}

module.exports = { pratica, resultados, licoes, exercicios, encerramento };
