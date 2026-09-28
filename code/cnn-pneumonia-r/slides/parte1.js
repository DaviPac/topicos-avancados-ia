// Slides 1-10: abertura e teoria da CNN.
const { COR, FONTE, L, img, texto, titulo, cartao, destaque, grade, cinza, seta } = require("./tema");

function capa(pres) {
  const s = pres.addSlide(); s.background = { color: COR.escuro };
  texto(s, "Análise de Dados · 1ª VA", { x: L.margem, y: 0.9, w: 7, h: 0.4, fontSize: 14, color: COR.sobreEscuro, charSpacing: 2 });
  texto(s, "Redes Neurais Convolucionais", { x: L.margem, y: 1.5, w: 8.6, h: 1.8, fontFace: FONTE.titulo, fontSize: 50, bold: true, color: COR.branco, valign: "middle" });
  texto(s, "Diagnosticando pneumonia em raios-X com torch no R", { x: L.margem, y: 3.45, w: 8, h: 1, fontSize: 24, color: COR.sobreEscuro });
  texto(s, "Davi Pires Aquino de Carvalho · UFRPE", { x: L.margem, y: 6.3, w: 8, h: 0.4, fontSize: 14, color: COR.sobreEscuro });
  s.addImage({ path: img("raiox_um.png"), x: 9.4, y: 1.5, w: 3.3, h: 3.3 });
  s.addNotes("[0:00–0:45] Apresente-se. Gancho: 'Uma rede neural consegue olhar um raio-X de 28 por 28 pixels e dizer se a criança tem pneumonia? Hoje vamos construir uma, do zero, em R.'");
}

function roteiro(pres) {
  const s = pres.addSlide(); titulo(s, "O que vamos ver");
  const itens = [["1", "Teoria", "como uma CNN enxerga"], ["2", "Os dados", "raios-X de tórax"], ["3", "torch no R", "a ferramenta"],
    ["4", "Prática", "o código rodando"], ["5", "Resultados", "o que a rede acertou"], ["6", "Exercícios", "para você praticar"]];
  itens.forEach(([n, nome, sub], i) => {
    const x = L.margem + i * 2.05;
    cartao(pres, s, x, 2.3, 1.85, 2.6);
    texto(s, n, { x, y: 2.5, w: 1.85, h: 0.9, fontFace: FONTE.titulo, fontSize: 40, bold: true, color: COR.destaque, align: "center" });
    texto(s, nome, { x: x + 0.1, y: 3.5, w: 1.65, h: 0.5, fontSize: 18, bold: true, align: "center" });
    texto(s, sub, { x: x + 0.1, y: 4.0, w: 1.65, h: 0.7, fontSize: 13, color: COR.tintaFraca, align: "center" });
  });
  s.addNotes("[0:45–1:30] Mostre o roteiro: primeiro a teoria, depois os dados, a ferramenta, a prática no RStudio, os resultados e exercícios no final.");
}

function imagemNumeros(pres) {
  const s = pres.addSlide(); titulo(s, "Para o computador, imagem é uma tabela");
  s.addImage({ path: img("raiox_um.png"), x: L.margem, y: 1.5, w: 4.6, h: 4.6 });
  const pixels = [[84, 57, 50, 38, 57, 62], [85, 65, 54, 49, 69, 70], [80, 68, 59, 51, 72, 67],
    [79, 68, 56, 58, 80, 72], [83, 72, 51, 51, 74, 66], [57, 48, 62, 71, 77, 79]];
  seta(pres, s, 5.55, 3.6);
  grade(pres, s, 6.3, 1.5, pixels, 0.62, cinza);
  texto(s, [
    { text: "Um recorte de 6 × 6 pixels deste raio-X, como o R o lê.", options: { breakLine: true } },
    { text: "0 é preto, 255 é branco.", options: { breakLine: true } },
    { text: "Cada imagem: 28 × 28 = 784 números.", options: { bold: true } },
  ], { x: 10.3, y: 1.6, w: 2.43, h: 3.6, fontSize: 16 });
  s.addNotes("[1:30–2:45] A ideia central: o computador não vê um pulmão, vê números. Estes são pixels reais deste raio-X, lidos pelo nosso script em R. O desafio é encontrar padrões nesses 784 números.");
}

function porQueCNN(pres) {
  const s = pres.addSlide(); titulo(s, "Por que não uma rede neural comum?");
  destaque(pres, s, L.margem, 1.6, 5.9, 3.0, "784 pesos", "por neurônio numa rede densa comum: ela achata a imagem numa fila de 784 números e perde a noção de vizinhança — quem está ao lado de quem.", { tamanho: 44 });
  destaque(pres, s, 6.83, 1.6, 5.9, 3.0, "9 pesos", "por filtro numa CNN: ele olha pedaços 3 × 3 e é reaproveitado na imagem inteira, então reconhece o mesmo padrão em qualquer posição.", { tamanho: 44, corNumero: COR.destaque });
  texto(s, "A CNN aproveita a estrutura da imagem: pixels vizinhos têm relação.", { x: L.margem, y: 5.1, w: L.util, h: 0.6, fontFace: FONTE.titulo, fontSize: 22, italic: true });
  s.addNotes("[2:45–4:00] Uma rede comum trata cada pixel como uma variável solta. A CNN olha pedaços pequenos e reaproveita o mesmo detector na imagem toda — muito menos pesos e respeito à vizinhança dos pixels.");
}

function convolucao(pres) {
  const s = pres.addSlide(); titulo(s, "Convolução: um filtro que desliza pela imagem");
  const janela = [[10, 10, 200], [10, 10, 200], [10, 10, 200]];
  const filtro = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
  texto(s, "pedaço da imagem", { x: 0.9, y: 1.45, w: 2.7, h: 0.4, fontSize: 14, color: COR.tintaFraca, align: "center" });
  grade(pres, s, 0.9, 1.9, janela, 0.9, cinza);
  texto(s, "×", { x: 3.75, y: 2.85, w: 0.7, h: 0.8, fontSize: 40, bold: true, align: "center", valign: "middle" });
  texto(s, "filtro 3 × 3", { x: 4.6, y: 1.45, w: 2.7, h: 0.4, fontSize: 14, color: COR.tintaFraca, align: "center" });
  grade(pres, s, 4.6, 1.9, filtro, 0.9, (v) => [v < 0 ? "CADCFC" : v > 0 ? "FAD3C2" : COR.cartao, COR.tinta]);
  texto(s, "=", { x: 7.45, y: 2.85, w: 0.7, h: 0.8, fontSize: 40, bold: true, align: "center", valign: "middle" });
  destaque(pres, s, 8.3, 1.9, 4.43, 2.7, "570", "valor alto: o filtro achou uma borda vertical (escuro à esquerda, claro à direita)", { tamanho: 48, corNumero: COR.destaque });
  texto(s, [
    { text: "Multiplica casa por casa e soma: 3 × (−10 + 0 + 200) = 570. Numa região lisa, o resultado seria perto de zero.", options: { breakLine: true } },
    { text: "O filtro desliza pela imagem inteira e gera um mapa de onde o padrão aparece.", options: { breakLine: true } },
    { text: "Na CNN ninguém escolhe esses números: eles são aprendidos no treino.", options: { bold: true } },
  ], { x: L.margem, y: 5.0, w: L.util, h: 1.9, fontSize: 17, paraSpaceAfter: 6 });
  s.addNotes("[4:00–6:00] Este é o coração da CNN. Explique a conta devagar. Depois: numa região lisa, os valores da esquerda e da direita se cancelam e o resultado fica perto de zero. O filtro percorre a imagem toda e marca onde encontrou o padrão. E o ponto principal: a rede aprende sozinha quais filtros são úteis.");
}

function hierarquia(pres) {
  const s = pres.addSlide(); titulo(s, "Camadas em sequência: do simples ao complexo");
  const etapas = [["1ª camada", "bordas e contrastes", "16 filtros na nossa rede"], ["2ª camada", "texturas e formas", "32 filtros, combinando os mapas da 1ª"],
    ["camadas finais", "padrões que indicam o diagnóstico", "ex.: pulmão mais opaco"]];
  etapas.forEach(([nome, oque, obs], i) => {
    const x = L.margem + i * 4.2;
    cartao(pres, s, x, 2.0, 3.7, 3.2);
    texto(s, nome, { x: x + 0.3, y: 2.25, w: 3.1, h: 0.5, fontSize: 16, color: COR.tintaFraca });
    texto(s, oque, { x: x + 0.3, y: 2.8, w: 3.1, h: 1.3, fontFace: FONTE.titulo, fontSize: 24, bold: true });
    texto(s, obs, { x: x + 0.3, y: 4.2, w: 3.1, h: 0.8, fontSize: 14, color: COR.tintaFraca });
    if (i < 2) seta(pres, s, x + 3.75, 3.4, 0.4);
  });
  s.addNotes("[6:00–7:00] Cada camada trabalha sobre os mapas da anterior. As primeiras enxergam coisas simples; as seguintes combinam essas coisas em padrões mais complexos. É parecido com o jeito como a gente reconhece um objeto: de traços a formas.");
}

function reluPooling(pres) {
  const s = pres.addSlide(); titulo(s, "ReLU e pooling");
  texto(s, "ReLU: zera o que é negativo", { x: L.margem, y: 1.5, w: 5.6, h: 0.5, fontFace: FONTE.titulo, fontSize: 22, bold: true });
  grade(pres, s, L.margem + 0.5, 2.3, [[-3, 0, 2, 5]], 1.0, () => [COR.cartao, COR.tinta]);
  texto(s, "↓  max(0, x)", { x: L.margem + 0.5, y: 3.35, w: 4, h: 0.5, fontSize: 18, align: "center" });
  grade(pres, s, L.margem + 0.5, 3.9, [[0, 0, 2, 5]], 1.0, (v) => [v > 0 ? "FAD3C2" : COR.cartao, COR.tinta]);
  texto(s, "Simples, mas é o que deixa a rede aprender relações não lineares.", { x: L.margem, y: 5.2, w: 5.4, h: 1, fontSize: 15, color: COR.tintaFraca });
  texto(s, "Max pooling 2 × 2: resume cada região", { x: 6.8, y: 1.5, w: 6, h: 0.5, fontFace: FONTE.titulo, fontSize: 22, bold: true });
  const tons = ["CADCFC", "FAD3C2", "C8EBDD", "DDD8F4"];
  const quadrante = (i, j) => tons[(i < 2 ? 0 : 2) + (j < 2 ? 0 : 1)];
  grade(pres, s, 6.9, 2.3, [[1, 3, 2, 1], [4, 6, 5, 0], [3, 1, 1, 2], [0, 2, 7, 4]], 0.7, (v, i, j) => [quadrante(i, j), COR.tinta]);
  seta(pres, s, 9.85, 3.55);
  grade(pres, s, 10.6, 2.95, [[6, 5], [3, 7]], 0.7, (v, i, j) => [tons[i * 2 + j], COR.tinta]);
  texto(s, "Guarda o maior valor de cada bloco: a imagem cai pela metade, e o sinal mais forte fica.", { x: 6.8, y: 5.2, w: 5.9, h: 1, fontSize: 15, color: COR.tintaFraca });
  s.addNotes("[7:00–8:30] ReLU: depois de cada convolução, valores negativos viram zero. Pooling: de cada bloco 2 por 2, fica só o maior valor — a imagem encolhe pela metade (28 → 14 → 7 na nossa rede) e o que importa é preservado.");
}

function daImagemADecisao(pres) {
  const s = pres.addSlide(); titulo(s, "Da imagem à decisão");
  const passos = [["raio-X", "1 × 28 × 28"], ["conv + ReLU + pool", "16 × 14 × 14"], ["conv + ReLU + pool", "32 × 7 × 7"],
    ["achata", "1.568 números"], ["camada densa", "64"], ["saída", "2 notas"]];
  passos.forEach(([nome, forma], i) => {
    const x = L.margem + i * 2.07;
    cartao(pres, s, x, 1.7, 1.75, 1.6, i === 5 ? "FAD3C2" : COR.cartao);
    texto(s, nome, { x: x + 0.1, y: 1.85, w: 1.55, h: 0.7, fontSize: 14, color: COR.tintaFraca, align: "center" });
    texto(s, forma, { x: x + 0.1, y: 2.5, w: 1.55, h: 0.6, fontSize: 16, bold: true, align: "center" });
    if (i < 5) seta(pres, s, x + 1.77, 2.35, 0.28);
  });
  texto(s, "Softmax: transforma as 2 notas em probabilidades", { x: L.margem, y: 3.9, w: L.util, h: 0.5, fontFace: FONTE.titulo, fontSize: 22, bold: true });
  destaque(pres, s, L.margem, 4.6, 5.9, 2.2, "1,2  e  3,1", "notas que a rede deu para normal e pneumonia", { tamanho: 36 });
  destaque(pres, s, 6.83, 4.6, 5.9, 2.2, "13%  ·  87%", "normal · pneumonia — a resposta é a maior", { tamanho: 36, corNumero: COR.destaque });
  s.addNotes("[8:30–10:00] Percorra o caminho de um raio-X pela nossa rede, com os formatos reais. No fim, a rede dá duas notas; o softmax as transforma em probabilidades que somam 100%. Com notas 1,2 e 3,1, sai 13% normal e 87% pneumonia.");
}

module.exports = { capa, roteiro, imagemNumeros, porQueCNN, convolucao, hierarquia, reluPooling, daImagemADecisao };
