// Slide "A rede completa": desenho da CNN inteira, com o tamanho e o nome no código de cada camada.
// Escala dos mapas: 28 pixels = 1 polegada, então um mapa 14 × 14 aparece com metade do lado.
const { COR, FONTE, img, texto, titulo, cartao, paragrafos, seta } = require("./tema");

const CY = 3.2;                                   // linha central do desenho
const TONS = ["CADCFC", "FAD3C2", "C8EBDD", "DDD8F4"];

function linha(pres, s, x1, y1, x2, y2, cor = COR.grade, largura = 0.75) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipV: (x2 - x1) * (y2 - y1) < 0, line: { color: cor, width: largura } });
}

// n mapas de lado `lado`, empilhados na diagonal; o da frente pode ser uma figura real. Devolve a posição do da frente.
function pilha(pres, s, cx, lado, n, desloc, figura) {
  const tam = lado + (n - 1) * desloc, esq = cx - tam / 2, topo = CY - tam / 2;
  for (let k = 0; k < n; k++) {
    const x = esq + (n - 1 - k) * desloc, y = topo + k * desloc, frente = k === n - 1;
    if (frente && figura) s.addImage({ path: img(figura), x, y, w: lado, h: lado });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: lado, h: lado, line: { color: COR.destaque, width: 0.75 },
      fill: frente && figura ? { type: "none" } : { color: "FAD3C2" } });
  }
  return { x: esq, y: topo + (n - 1) * desloc };
}

function legenda(s, cx, nome, forma, cod) {
  const w = 1.25, x = cx - w / 2;
  texto(s, nome, { x, y: 4.45, w, h: 0.5, fontSize: 11, bold: true, align: "center", valign: "bottom" });
  texto(s, forma, { x, y: 4.98, w, h: 0.3, fontSize: 12, align: "center" });
  texto(s, cod, { x, y: 5.3, w, h: 0.3, fontFace: FONTE.codigo, fontSize: 9, bold: true, color: COR.destaque, align: "center" });
}

function parte(pres, s, x1, x2, rotulo) {
  texto(s, rotulo, { x: x1, y: 1.4, w: x2 - x1, h: 0.4, fontFace: FONTE.titulo, fontSize: 15, bold: true, color: COR.destaque, align: "center" });
  linha(pres, s, x1, 1.88, x2, 1.88, COR.destaque, 1.5);
}

function redeCompleta(pres) {
  const s = pres.addSlide(); titulo(s, "A rede completa");
  parte(pres, s, 2.0, 7.3, "Parte 1 · encontrar padrões");
  parte(pres, s, 7.8, 12.73, "Parte 2 · decidir");

  // entrada, com o filtro 3 × 3 projetado num pixel do primeiro mapa
  s.addImage({ path: img("raiox_um.png"), x: 0.7, y: CY - 0.5, w: 1.0, h: 1.0 });
  const wx = 0.7 + 8 / 28, wy = CY - 0.5 + 10 / 28, lf = 3 / 28;
  const m1 = pilha(pres, s, 2.75, 1.0, 5, 0.1, "mapa_relu.png");
  const px = m1.x + 9.5 / 28, py = m1.y + 11.5 / 28;
  linha(pres, s, wx + lf, wy, px, py, COR.destaque, 1); linha(pres, s, wx + lf, wy + lf, px, py, COR.destaque, 1);
  s.addShape(pres.shapes.RECTANGLE, { x: wx, y: wy, w: lf, h: lf, fill: { type: "none" }, line: { color: COR.destaque, width: 1.5 } });

  seta(pres, s, 3.52, CY - 0.175, 0.24);
  pilha(pres, s, 4.2, 0.5, 5, 0.07, "mapa_pool.png");
  seta(pres, s, 4.73, CY - 0.175, 0.24);
  pilha(pres, s, 5.55, 0.5, 9, 0.05);
  seta(pres, s, 6.19, CY - 0.175, 0.24);
  pilha(pres, s, 6.9, 0.25, 9, 0.04);
  seta(pres, s, 7.52, CY - 0.175, 0.3);

  // achatar: uma coluna de números; camada densa e saída: neurônios ligados a todas as entradas
  const celulas = [...Array(10).keys()].map((i) => CY - 1.0 + i * 0.2);
  const densa = [...Array(6).keys()].map((i) => CY - 0.85 + i * 0.34);
  const saida = [CY - 0.3, CY + 0.3];
  celulas.forEach((y) => densa.forEach((yd) => linha(pres, s, 8.31, y + 0.1, 9.37, yd)));
  densa.forEach((yd) => saida.forEach((ys) => linha(pres, s, 9.63, yd, 10.65, ys)));
  celulas.forEach((y, i) => s.addShape(pres.shapes.RECTANGLE, { x: 8.09, y, w: 0.22, h: 0.2, fill: { color: TONS[i % 4] }, line: { color: COR.branco, width: 0.5 } }));
  densa.forEach((y) => s.addShape(pres.shapes.OVAL, { x: 9.37, y: y - 0.13, w: 0.26, h: 0.26, fill: { color: COR.branco }, line: { color: COR.tintaFraca } }));
  saida.forEach((y) => s.addShape(pres.shapes.OVAL, { x: 10.65, y: y - 0.15, w: 0.3, h: 0.3, fill: { color: "FAD3C2" }, line: { color: COR.destaque } }));
  seta(pres, s, 11.08, CY - 0.175, 0.3);
  cartao(pres, s, 11.48, CY - 0.6, 1.25, 1.2);
  texto(s, [{ text: "13% normal", options: { breakLine: true, fontSize: 12 } }, { text: "87% pneumonia", options: { fontSize: 13, bold: true, color: COR.destaque } }],
    { x: 11.53, y: CY - 0.6, w: 1.15, h: 1.2, align: "center", valign: "middle" });

  legenda(s, 1.2, "entrada", "1 × 28 × 28", "");
  legenda(s, 2.75, "convolução 1 + ReLU", "16 × 28 × 28", "self$convolucao1");
  legenda(s, 4.2, "pooling", "16 × 14 × 14", "nnf_max_pool2d");
  legenda(s, 5.55, "convolução 2 + ReLU", "32 × 14 × 14", "self$convolucao2");
  legenda(s, 6.9, "pooling", "32 × 7 × 7", "nnf_max_pool2d");
  legenda(s, 8.2, "achatar", "1.568", "torch_flatten");
  legenda(s, 9.5, "camada densa\n+ ReLU", "64", "self$densa");
  legenda(s, 10.8, "saída", "2", "self$saida");
  legenda(s, 12.1, "softmax", "probabilidades", "nnf_softmax");

  paragrafos(s, [
    ["Como ler: ", "cada quadrado laranja é um mapa; na frente das duas primeiras pilhas estão mapas reais deste raio-X. Pilha mais funda = mais mapas; quadrado menor = mapa menor. O quadradinho na entrada é um filtro 3 × 3: cada posição dele gera um pixel do mapa."],
    ["Em laranja, embaixo de cada peça: ", "o nome dela no código em R. O dropout fica entre a camada densa e a saída e só age no treino."],
  ], { x: 0.6, y: 5.8, w: 12.13, h: 1.4, fontSize: 14, paraSpaceAfter: 6 });
  s.addNotes("[12:10–13:10] Este é o desenho da rede inteira, juntando tudo o que foi visto. Percorra da esquerda para a direita. Na entrada, o quadradinho é o filtro 3 × 3; as linhas mostram que cada posição dele vira um pixel do mapa. A primeira convolução gera 16 mapas (a pilha); o pooling os encolhe; a segunda convolução gera 32 mapas; outro pooling. Aí a parte 2: achatar em fila, camada densa com 64 neurônios ligados a todos os números, saída com 2 neurônios e o softmax. Aponte os nomes em laranja: são os nomes que vão aparecer no código.");
}

module.exports = { redeCompleta };
