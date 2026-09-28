// Slide "A rede completa": a CNN desenhada como neurônios e conexões, da entrada até a saída.
// Cada coluna é uma camada; cada cor é um mapa. Só alguns neurônios aparecem (os tamanhos reais estão nas legendas).
// Convolução: cada neurônio liga-se a 3 vizinhos da coluna anterior (o 3 × 3 da imagem, simplificado para uma dimensão).
const { COR, FONTE, texto, titulo, cartao, paragrafos, seta } = require("./tema");

const CY = 3.75, R = 0.08;                        // linha central do desenho e raio de cada neurônio
const MAPA = ["CADCFC", "C8EBDD", "FAD3C2", "DDD8F4", "F7E3A1"];

function linha(pres, s, x1, y1, x2, y2, cor = COR.grade, largura = 0.5) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipV: (x2 - x1) * (y2 - y1) < 0, line: { color: cor, width: largura } });
}

// Uma camada: grupos (mapas) de neurônios empilhados na vertical. Devolve, por grupo, a altura de cada neurônio.
function camada(cx, grupos, espaco, distGrupos) {
  return grupos.map((n, g) => {
    const centro = CY + (g - (grupos.length - 1) / 2) * distGrupos;
    return [...Array(n).keys()].map((i) => centro + (i - (n - 1) / 2) * espaco);
  }).map((ys) => ({ cx, ys }));
}

function neuronios(pres, s, grupos, cores, borda = COR.tintaFraca) {
  grupos.forEach(({ cx, ys }, g) => ys.forEach((y, i) => s.addShape(pres.shapes.OVAL, { x: cx - R, y: y - R, w: 2 * R, h: 2 * R,
    fill: { color: typeof cores === "function" ? cores(g, i) : cores }, line: { color: borda, width: 0.5 } })));
}

// liga o neurônio (x1, y1) ao (x2, y2), da borda direita de um à borda esquerda do outro
const liga = (pres, s, a, ya, b, yb, cor, larg) => linha(pres, s, a.cx + R, ya, b.cx - R, yb, cor, larg);

function legenda(s, cx, nome, forma, cod) {
  const w = 1.25, x = cx - w / 2;
  texto(s, nome, { x, y: 5.6, w, h: 0.4, fontSize: 11, bold: true, align: "center", valign: "bottom" });
  texto(s, forma, { x, y: 6.02, w, h: 0.25, fontSize: 11, align: "center" });
  texto(s, cod, { x, y: 6.28, w, h: 0.25, fontFace: FONTE.codigo, fontSize: 9, bold: true, color: COR.destaque, align: "center" });
}

function parte(pres, s, x1, x2, rotulo) {
  texto(s, rotulo, { x: x1, y: 1.3, w: x2 - x1, h: 0.4, fontFace: FONTE.titulo, fontSize: 15, bold: true, color: COR.destaque, align: "center" });
  linha(pres, s, x1, 1.78, x2, 1.78, COR.destaque, 1.5);
}

function redeCompleta(pres) {
  const s = pres.addSlide(); titulo(s, "A rede completa");
  parte(pres, s, 1.75, 6.85, "Parte 1 · encontrar padrões");
  parte(pres, s, 7.0, 12.73, "Parte 2 · decidir");

  const entrada = camada(1.0, [8], 0.42, 0)[0];
  const conv1 = camada(2.35, [8, 8], 0.2, 1.8), pool1 = camada(3.65, [4, 4], 0.2, 1.8);
  const conv2 = camada(4.95, [4, 4, 4], 0.2, 1.2), pool2 = camada(6.2, [2, 2, 2], 0.2, 1.2);
  const achatar = camada(7.55, [6], 0.3, 0)[0], densa = camada(8.95, [5], 0.42, 0)[0], saida = camada(10.3, [2], 0.7, 0)[0];
  const vizinhos = (i, n) => [i - 1, i, i + 1].filter((k) => k >= 0 && k < n);

  // conexões: primeiro as cinzas, depois o exemplo em laranja, por cima
  conv1.forEach((m) => m.ys.forEach((y, i) => vizinhos(i, 8).forEach((k) => liga(pres, s, entrada, entrada.ys[k], m, y))));
  conv1.forEach((m, g) => pool1[g].ys.forEach((y, j) => [2 * j, 2 * j + 1].forEach((k) => liga(pres, s, m, m.ys[k], pool1[g], y))));
  conv2.forEach((m) => m.ys.forEach((y, i) => pool1.forEach((p) => vizinhos(i, 4).forEach((k) => liga(pres, s, p, p.ys[k], m, y)))));
  conv2.forEach((m, h) => pool2[h].ys.forEach((y, j) => [2 * j, 2 * j + 1].forEach((k) => liga(pres, s, m, m.ys[k], pool2[h], y))));
  pool2.forEach((p, h) => p.ys.forEach((y, j) => liga(pres, s, p, y, achatar, achatar.ys[h * 2 + j])));
  achatar.ys.forEach((ya) => densa.ys.forEach((yd) => liga(pres, s, achatar, ya, densa, yd)));
  densa.ys.forEach((yd) => saida.ys.forEach((ys) => liga(pres, s, densa, yd, saida, ys)));
  vizinhos(3, 8).forEach((k) => liga(pres, s, entrada, entrada.ys[k], conv1[0], conv1[0].ys[3], COR.destaque, 1.5));

  neuronios(pres, s, [entrada], COR.branco);
  neuronios(pres, s, conv1, (g) => MAPA[g]); neuronios(pres, s, pool1, (g) => MAPA[g]);
  neuronios(pres, s, conv2, (g) => MAPA[g + 2]); neuronios(pres, s, pool2, (g) => MAPA[g + 2]);
  neuronios(pres, s, [achatar], (g, i) => MAPA[2 + Math.floor(i / 2)]);
  neuronios(pres, s, [densa], COR.branco);
  neuronios(pres, s, [saida], "FAD3C2", COR.destaque);
  s.addShape(pres.shapes.OVAL, { x: conv1[0].cx - R, y: conv1[0].ys[3] - R, w: 2 * R, h: 2 * R, fill: { color: COR.destaque }, line: { color: COR.destaque } });
  texto(s, "normal", { x: 10.45, y: saida.ys[0] - 0.15, w: 0.8, h: 0.3, fontSize: 10, color: COR.tintaFraca });
  texto(s, "pneumonia", { x: 10.45, y: saida.ys[1] - 0.15, w: 0.9, h: 0.3, fontSize: 10, color: COR.tintaFraca });

  seta(pres, s, 11.2, CY - 0.175, 0.25);
  cartao(pres, s, 11.5, CY - 0.6, 1.23, 1.2);
  texto(s, [{ text: "13% normal", options: { breakLine: true, fontSize: 12 } }, { text: "87% pneumonia", options: { fontSize: 13, bold: true, color: COR.destaque } }],
    { x: 11.54, y: CY - 0.6, w: 1.15, h: 1.2, align: "center", valign: "middle" });

  legenda(s, 1.0, "entrada", "784 pixels", "");
  legenda(s, 2.35, "convolução 1\n+ ReLU", "16 × 28 × 28", "self$convolucao1");
  legenda(s, 3.65, "pooling", "16 × 14 × 14", "nnf_max_pool2d");
  legenda(s, 4.95, "convolução 2\n+ ReLU", "32 × 14 × 14", "self$convolucao2");
  legenda(s, 6.2, "pooling", "32 × 7 × 7", "nnf_max_pool2d");
  legenda(s, 7.55, "achatar", "1.568", "torch_flatten");
  legenda(s, 8.95, "camada densa\n+ ReLU", "64", "self$densa");
  legenda(s, 10.3, "saída", "2", "self$saida");
  legenda(s, 12.1, "softmax", "probabilidades", "nnf_softmax");

  paragrafos(s, [
    ["Cada círculo é um neurônio e cada cor, um mapa. ", "Só alguns aparecem; os tamanhos reais e o nome no código estão embaixo."],
    ["Convolução: ", "cada neurônio se liga só aos vizinhos (em laranja, um exemplo). Camada densa e saída: liga-se a todos da coluna anterior."],
  ], { x: 0.6, y: 6.62, w: 12.13, h: 0.8, fontSize: 12, paraSpaceAfter: 2 });
  s.addNotes("[12:10–13:10] Este é o desenho da rede inteira, com os neurônios e as conexões. Percorra da esquerda para a direita. Os pixels da entrada ligam-se aos neurônios da convolução 1 — cada neurônio olha só os vizinhos, como o filtro 3 × 3 (o exemplo em laranja). Cada cor é um mapa, gerado por um filtro. O pooling junta os neurônios de 2 em 2. Na convolução 2, cada neurônio olha os vizinhos em todos os mapas anteriores e há mais mapas. Achatar põe todos os mapas numa fila só — veja as cores em sequência. Daí em diante, cada neurônio se liga a todos: camada densa e os 2 neurônios de saída, normal e pneumonia, que o softmax transforma em probabilidades. O dropout fica entre a camada densa e a saída e só age no treino. Aponte os nomes em laranja: são os que vão aparecer no código.");
}

module.exports = { redeCompleta };
