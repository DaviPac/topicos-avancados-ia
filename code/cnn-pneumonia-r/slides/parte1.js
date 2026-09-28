// Slides 1-8: abertura, o que é uma rede neural e uma CNN, convolução e filtros.
const { COR, FONTE, L, img, texto, titulo, cartao, paragrafos, grade, cinza, seta } = require("./tema");

function capa(pres) {
  const s = pres.addSlide(); s.background = { color: COR.escuro };
  texto(s, "Análise de Dados · 1ª VA", { x: L.margem, y: 0.9, w: 7, h: 0.4, fontSize: 14, color: COR.sobreEscuro, charSpacing: 2 });
  texto(s, "Redes Neurais Convolucionais", { x: L.margem, y: 1.5, w: 8.6, h: 1.8, fontFace: FONTE.titulo, fontSize: 50, bold: true, color: COR.branco, valign: "middle" });
  texto(s, "Classificando raios-X de tórax (normal ou pneumonia) com o pacote torch do R", { x: L.margem, y: 3.45, w: 8, h: 1, fontSize: 24, color: COR.sobreEscuro });
  texto(s, "Davi Pires Aquino de Carvalho · UFRPE", { x: L.margem, y: 6.3, w: 8, h: 0.4, fontSize: 14, color: COR.sobreEscuro });
  s.addImage({ path: img("raiox_um.png"), x: 9.4, y: 1.5, w: 3.3, h: 3.3 });
  s.addNotes("[0:00–0:30] Apresente-se: nome, curso, disciplina. Gancho: 'Um computador consegue olhar um raio-X de tórax e dizer se a criança tem pneumonia? Nesta aula eu mostro como, com uma rede neural convolucional treinada em R.'");
}

function roteiro(pres) {
  const s = pres.addSlide(); titulo(s, "Roteiro da aula");
  const itens = [["1", "O que é uma CNN", "a ideia e cada uma das peças"], ["2", "Como ela aprende", "medir o erro e ajustar os pesos"],
    ["3", "Os dados", "raios-X de tórax de crianças"], ["4", "O código em R", "o pacote torch, linha a linha"],
    ["5", "Prática e resultados", "o script rodando no RStudio"], ["6", "Exercícios", "para praticar sozinho"]];
  itens.forEach(([n, nome, sub], i) => {
    const x = L.margem + (i % 3) * 4.1, y = 1.6 + Math.floor(i / 3) * 2.6;
    cartao(pres, s, x, y, 3.8, 2.3);
    texto(s, n, { x: x + 0.3, y: y + 0.2, w: 1, h: 0.8, fontFace: FONTE.titulo, fontSize: 36, bold: true, color: COR.destaque });
    texto(s, nome, { x: x + 0.3, y: y + 1.0, w: 3.2, h: 0.5, fontSize: 20, bold: true });
    texto(s, sub, { x: x + 0.3, y: y + 1.5, w: 3.2, h: 0.6, fontSize: 15, color: COR.tintaFraca });
  });
  s.addNotes("[0:30–1:00] Mostre o roteiro: primeiro a teoria (o que é uma CNN e como ela aprende), depois os dados, o código em R, a prática com os resultados e, no final, exercícios.");
}

function problema(pres) {
  const s = pres.addSlide(); titulo(s, "O problema: este raio-X mostra pneumonia?");
  s.addImage({ path: img("raiox_um.png"), x: L.margem, y: 1.6, w: 2.6, h: 2.6 });
  texto(s, "entrada: raio-X de tórax, 28 × 28 pixels", { x: L.margem, y: 4.3, w: 2.6, h: 0.7, fontSize: 13, color: COR.tintaFraca, align: "center" });
  seta(pres, s, 3.5, 2.75);
  cartao(pres, s, 4.3, 1.9, 3.0, 2.0, COR.escuro);
  texto(s, "CNN", { x: 4.3, y: 1.9, w: 3.0, h: 2.0, fontFace: FONTE.titulo, fontSize: 40, bold: true, color: COR.branco, align: "center", valign: "middle" });
  seta(pres, s, 7.6, 2.75);
  cartao(pres, s, 8.4, 1.9, 4.33, 2.0);
  texto(s, "probabilidade de pneumonia", { x: 8.7, y: 2.05, w: 3.8, h: 0.5, fontSize: 15, color: COR.tintaFraca });
  texto(s, "ex.: 87% → pneumonia", { x: 8.7, y: 2.6, w: 3.8, h: 1.0, fontFace: FONTE.titulo, fontSize: 28, bold: true, color: COR.destaque, valign: "middle" });
  paragrafos(s, [
    ["Classificação: ", "o modelo coloca cada raio-X em uma de duas classes: normal ou pneumonia."],
    ["Aprendizado supervisionado: ", "o modelo aprende a partir de milhares de raios-X que já têm o diagnóstico dado por médicos."],
  ], { x: L.margem, y: 5.2, w: L.util, h: 1.9, fontSize: 17 });
  s.addNotes("[1:00–1:50] Defina a tarefa: entra uma imagem, sai a probabilidade de pneumonia. É um problema de classificação: duas classes possíveis. O modelo aprende com exemplos já diagnosticados.");
}

function neuronio(pres) {
  const s = pres.addSlide(); titulo(s, "Antes da CNN: o que é uma rede neural?");
  const cy = [1.9, 3.2, 4.5];
  cy.forEach((y, i) => {
    s.addShape(pres.shapes.OVAL, { x: L.margem, y: y - 0.35, w: 0.7, h: 0.7, fill: { color: COR.cartao }, line: { color: COR.tintaFraca, width: 1 } });
    texto(s, "x" + "₁₂₃"[i], { x: L.margem, y: y - 0.35, w: 0.7, h: 0.7, fontSize: 18, bold: true, align: "center", valign: "middle" });
    const o = { x: 1.3, y: Math.min(y, 3.2), w: 2.1, h: Math.abs(y - 3.2), line: { color: COR.tintaFraca, width: 1.5 } };
    s.addShape(pres.shapes.LINE, i === 2 ? Object.assign(o, { flipV: true }) : o);
    texto(s, "w" + "₁₂₃"[i], { x: 2.0, y: (y + 3.2) / 2 - (i === 1 ? 0.45 : 0.4), w: 0.6, h: 0.4, fontSize: 16, bold: true, color: COR.destaque, align: "center" });
  });
  s.addShape(pres.shapes.OVAL, { x: 3.4, y: 2.75, w: 0.9, h: 0.9, fill: { color: COR.escuro }, line: { color: COR.escuro } });
  texto(s, "Σ", { x: 3.4, y: 2.75, w: 0.9, h: 0.9, fontSize: 26, bold: true, color: COR.branco, align: "center", valign: "middle" });
  seta(pres, s, 4.4, 3.03, 0.4);
  cartao(pres, s, 4.9, 2.8, 1.5, 0.8, "FAD3C2");
  texto(s, "saída", { x: 4.9, y: 2.8, w: 1.5, h: 0.8, fontSize: 18, bold: true, align: "center", valign: "middle" });
  texto(s, "b + w₁x₁ + w₂x₂ + w₃x₃", { x: L.margem, y: 5.3, w: 5.8, h: 0.6, fontFace: FONTE.titulo, fontSize: 24, bold: true, align: "center" });
  texto(s, "um neurônio", { x: L.margem, y: 5.9, w: 5.8, h: 0.4, fontSize: 14, color: COR.tintaFraca, align: "center" });
  paragrafos(s, [
    ["Neurônio: ", "multiplica cada entrada por um peso e soma tudo (isso se chama soma ponderada), mais um número fixo, b. Ex.: entradas 2, 1, 3 e pesos 0,5, −1, 2 → 1 − 1 + 6 = 6, mais b."],
    ["Pesos: ", "não são escolhidos à mão: começam sorteados e são ajustados no treino, a partir dos exemplos."],
    ["Rede neural: ", "muitos neurônios organizados em camadas. A saída de uma camada é a entrada da próxima."],
    ["Camada densa: ", "camada em que cada neurônio recebe todas as saídas da camada anterior."],
  ], { x: 7.0, y: 1.6, w: 5.73, h: 5.2, fontSize: 17, paraSpaceAfter: 14 });
  s.addNotes("[1:50–3:10] Antes da CNN, a peça básica. Um neurônio é uma soma ponderada: pega as entradas, multiplica cada uma por um peso, soma, e soma mais um número fixo. Faça a conta do exemplo. A rede neural junta muitos desses em camadas. Os pesos começam sorteados e são ajustados no treino, a partir dos exemplos. Camada densa é o nome da camada em que cada neurônio olha todas as entradas.");
}

function oQueECNN(pres) {
  const s = pres.addSlide(); titulo(s, "O que é uma CNN?");
  paragrafos(s, [
    ["Rede Neural Convolucional ", "(CNN, do inglês Convolutional Neural Network) é uma rede neural feita para imagens. Em vez de tratar os 784 pixels como 784 colunas soltas, ela procura padrões em pedaços pequenos da imagem — bordas, texturas, manchas — em qualquer lugar em que apareçam."],
  ], { x: L.margem, y: 1.4, w: L.util, h: 1.3, fontSize: 18 });
  const partes = [["Parte 1 · encontrar padrões", ["convolução", "ReLU", "pooling"], "repetida 2 vezes. Transforma a imagem em mapas que mostram onde cada padrão aparece."],
    ["Parte 2 · decidir", ["achatar", "camada densa", "saída"], "combina os padrões encontrados e dá a probabilidade de cada classe."]];
  partes.forEach(([nome, pecas, desc], i) => {
    const x = L.margem + i * 6.23;
    cartao(pres, s, x, 3.0, 5.9, 3.3);
    texto(s, nome, { x: x + 0.3, y: 3.2, w: 5.3, h: 0.5, fontFace: FONTE.titulo, fontSize: 22, bold: true, color: COR.destaque });
    pecas.forEach((p, j) => {
      cartao(pres, s, x + 0.3 + j * 1.8, 3.95, 1.5, 0.75, COR.branco);
      texto(s, p, { x: x + 0.3 + j * 1.8, y: 3.95, w: 1.5, h: 0.75, fontSize: 15, bold: true, align: "center", valign: "middle" });
      if (j < 2) texto(s, "→", { x: x + 1.8 + j * 1.8, y: 3.95, w: 0.3, h: 0.75, fontSize: 18, align: "center", valign: "middle" });
    });
    texto(s, desc, { x: x + 0.3, y: 4.95, w: 5.3, h: 1.2, fontSize: 16, color: COR.tintaFraca });
    if (i === 0) seta(pres, s, 6.53, 4.15, 0.27);
  });
  texto(s, "Nos próximos slides, cada peça, uma de cada vez.", { x: L.margem, y: 6.55, w: L.util, h: 0.5, fontFace: FONTE.titulo, fontSize: 18, italic: true });
  s.addNotes("[3:10–4:20] Dê a visão geral antes dos detalhes. Uma CNN é uma rede neural especializada em imagens. Ela tem duas partes: a primeira procura padrões na imagem, com três peças — convolução, ReLU e pooling — repetidas; a segunda pega os padrões encontrados e decide. Por que não uma rede comum? Ela veria os pixels como colunas soltas, sem saber quem é vizinho de quem, e teria de aprender de novo o mesmo padrão em cada posição da imagem.");
}

function imagemNumeros(pres) {
  const s = pres.addSlide(); titulo(s, "Para o computador, imagem é uma tabela");
  s.addImage({ path: img("raiox_um.png"), x: L.margem, y: 1.5, w: 4.6, h: 4.6 });
  const pixels = [[84, 57, 50, 38, 57, 62], [85, 65, 54, 49, 69, 70], [80, 68, 59, 51, 72, 67],
    [79, 68, 56, 58, 80, 72], [83, 72, 51, 51, 74, 66], [57, 48, 62, 71, 77, 79]];
  seta(pres, s, 5.55, 3.6);
  grade(pres, s, 6.3, 1.5, pixels, 0.62, cinza);
  paragrafos(s, ["Um recorte de 6 × 6 pixels deste raio-X, como o R o lê.", "Cada número é o tom de cinza de um pixel: 0 é preto, 255 é branco.",
    ["Cada imagem: 28 × 28 = 784 números.", ""]], { x: 10.3, y: 1.6, w: 2.43, h: 4.5, fontSize: 16 });
  s.addNotes("[4:20–5:00] O computador não vê um pulmão, vê uma matriz de números. Estes são pixels reais deste raio-X, lidos pelo script em R. A CNN vai procurar padrões nessa matriz.");
}

function convolucao(pres) {
  const s = pres.addSlide(); titulo(s, "Convolução: um filtro que desliza pela imagem");
  const janela = [[10, 10, 200], [10, 10, 200], [10, 10, 200]];
  const filtro = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
  texto(s, "pedaço da imagem", { x: 0.9, y: 1.45, w: 2.7, h: 0.4, fontSize: 14, color: COR.tintaFraca, align: "center" });
  grade(pres, s, 0.9, 1.9, janela, 0.9, cinza);
  texto(s, "×", { x: 3.75, y: 2.85, w: 0.7, h: 0.8, fontSize: 40, bold: true, align: "center", valign: "middle" });
  texto(s, "filtro 3 × 3 (pesos)", { x: 4.6, y: 1.45, w: 2.7, h: 0.4, fontSize: 14, color: COR.tintaFraca, align: "center" });
  grade(pres, s, 4.6, 1.9, filtro, 0.9, (v) => [v < 0 ? "CADCFC" : v > 0 ? "FAD3C2" : COR.cartao, COR.tinta]);
  texto(s, "=", { x: 7.45, y: 2.85, w: 0.7, h: 0.8, fontSize: 40, bold: true, align: "center", valign: "middle" });
  cartao(pres, s, 8.3, 1.9, 4.43, 2.7);
  texto(s, "570", { x: 8.6, y: 2.1, w: 3.8, h: 1.1, fontFace: FONTE.titulo, fontSize: 48, bold: true, color: COR.destaque, valign: "middle" });
  texto(s, "valor alto: aqui existe uma borda vertical (escuro à esquerda, claro à direita)", { x: 8.6, y: 3.25, w: 3.8, h: 1.1, fontSize: 14, color: COR.tintaFraca });
  paragrafos(s, [
    ["Filtro: ", "uma pequena tabela de pesos, 3 × 3. Ele é colocado sobre um pedaço da imagem; multiplica casa por casa e soma: 3 × (−10 + 0 + 200) = 570. Numa região lisa, o resultado seria perto de zero."],
    ["Deslizar: ", "o filtro anda uma casa para o lado e repete a conta, até cobrir a imagem inteira. Cada conta vira um pixel de uma nova imagem, o mapa, que mostra onde o padrão aparece."],
  ], { x: L.margem, y: 5.0, w: L.util, h: 2.0, fontSize: 17 });
  s.addNotes("[5:00–6:15] O coração da CNN. Explique a conta devagar: casa por casa, multiplica e soma. Com este filtro, a coluna da esquerda entra com sinal negativo e a da direita com positivo: se a direita é mais clara, o resultado é alto. Numa região lisa, os dois lados se cancelam. Depois o filtro desliza e repete a conta por toda a imagem; o resultado é uma nova imagem, chamada mapa.");
}

function filtrosAprendidos(pres) {
  const s = pres.addSlide(); titulo(s, "De onde vêm os números dos filtros?");
  s.addImage({ path: img("raiox_um.png"), x: L.margem, y: 1.5, w: 3.0, h: 3.0 });
  seta(pres, s, 3.75, 2.85);
  s.addImage({ path: img("mapa_filtro.png"), x: 4.4, y: 1.5, w: 3.0, h: 3.0 });
  texto(s, "raio-X", { x: L.margem, y: 4.55, w: 3.0, h: 0.4, fontSize: 14, color: COR.tintaFraca, align: "center" });
  texto(s, "mapa do filtro de borda vertical", { x: 4.4, y: 4.55, w: 3.0, h: 0.4, fontSize: 14, color: COR.tintaFraca, align: "center" });
  paragrafos(s, [["laranja: ", "valor positivo (escuro → claro)"], ["azul: ", "valor negativo (claro → escuro)"], ["branco: ", "nenhuma borda"]],
    { x: L.margem, y: 5.1, w: 6.8, h: 1.3, fontSize: 14, paraSpaceAfter: 2 });
  paragrafos(s, [
    ["Ninguém escreve esses números. ", "No início do treino, os pesos de cada filtro são sorteados — o filtro ainda não detecta nada útil."],
    ["O treino ajusta os pesos ", "pouco a pouco, para diminuir o erro da rede. Assim, cada filtro vira um detector de algum padrão que ajuda a separar normal de pneumonia."],
    ["Um filtro é só um conjunto de 9 pesos, ", "iguais aos pesos do neurônio do começo da aula — por isso é aprendido do mesmo jeito."],
    "A rede deste vídeo aprende 16 filtros na 1ª convolução e 32 na 2ª. O filtro de borda ao lado foi escolhido à mão só para ilustrar.",
  ], { x: 7.8, y: 1.5, w: 4.93, h: 5.5, fontSize: 16, paraSpaceAfter: 12 });
  s.addNotes("[6:15–7:15] Ponto central: os filtros não são programados. Começam com números aleatórios e o treino os ajusta — como, eu mostro daqui a pouco. Aqui, à esquerda, o resultado real de passar um filtro de borda vertical, escolhido à mão, por este raio-X: o mapa acende nas bordas das costelas e dos pulmões. Na rede, são 16 filtros diferentes, cada um gerando o seu mapa.");
}

module.exports = { capa, roteiro, problema, neuronio, oQueECNN, imagemNumeros, convolucao, filtrosAprendidos };
