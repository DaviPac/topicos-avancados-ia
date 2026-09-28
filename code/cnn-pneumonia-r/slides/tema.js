// Tema visual da videoaula: cores, fontes e peças reutilizadas nos slides.
const path = require("path");

const COR = {
  escuro: "0F1B2D",       // fundo da capa, transições e encerramento
  branco: "FFFFFF",
  tinta: "0B0B0B",
  tintaFraca: "52514E",
  sobreEscuro: "C9D3E0",
  destaque: "EB6834",     // laranja: o que importa no slide
  azul: "2A78D6",
  cartao: "F2F4F7",
  grade: "DCDCD8",
  codigo: "1A2A40",
};

const FONTE = { titulo: "Cambria", corpo: "Calibri", codigo: "Courier New" };
const L = { largura: 13.333, altura: 7.5, margem: 0.6, util: 13.333 - 1.2 };
const img = (nome) => path.join(__dirname, "img", nome);

function texto(s, conteudo, o) {
  s.addText(conteudo, Object.assign({
    fontFace: FONTE.corpo, fontSize: 16, color: COR.tinta, margin: 0, valign: "top", isTextBox: true,
  }, o));
}

function titulo(s, conteudo, cor = COR.tinta) {
  texto(s, conteudo, { x: L.margem, y: 0.4, w: L.util, h: 0.8, fontFace: FONTE.titulo,
    fontSize: 32, bold: true, color: cor, valign: "middle" });
}

function cartao(pres, s, x, y, w, h, cor = COR.cartao) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: cor }, line: { color: cor } });
}

// Cartão com número grande em cima e legenda embaixo
function destaque(pres, s, x, y, w, h, numero, legenda, o = {}) {
  cartao(pres, s, x, y, w, h, o.fundo || COR.cartao);
  texto(s, numero, { x: x + 0.3, y: y + 0.2, w: w - 0.6, h: h * 0.45, fontFace: FONTE.titulo,
    fontSize: o.tamanho || 36, bold: true, color: o.corNumero || COR.tinta, valign: "middle" });
  texto(s, legenda, { x: x + 0.3, y: y + 0.2 + h * 0.45, w: w - 0.6, h: h * 0.55 - 0.35,
    fontSize: o.tamanhoLegenda || 14, color: o.corLegenda || COR.tintaFraca });
}

// Bloco de código com fundo escuro
function codigo(pres, s, linhas, x, y, w, h, tamanho = 13) {
  cartao(pres, s, x, y, w, h, COR.codigo);
  texto(s, linhas.map((l, i) => ({ text: l, options: {
    breakLine: i < linhas.length - 1, color: l.trim().startsWith("#") ? COR.sobreEscuro : COR.branco } })),
    { x: x + 0.3, y: y + 0.25, w: w - 0.6, h: h - 0.5, fontFace: FONTE.codigo, fontSize: tamanho });
}

// Código à esquerda e, na mesma linha, a explicação em português à direita.
// pares: [codigo, explicacao, linhasDeAltura=1]
function codigoExplicado(pres, s, pares, o = {}) {
  const y0 = o.y || 1.5, wc = o.wCodigo || 7.2, h = o.altura || 0.46;
  const xe = L.margem + wc + 0.3, we = L.largura - L.margem - xe;
  const alturas = pares.map((p) => h * (p[2] || 1));
  cartao(pres, s, L.margem, y0, wc, alturas.reduce((a, b) => a + b, 0) + 0.3, COR.codigo);
  let y = y0 + 0.15;
  pares.forEach(([cod, expl], i) => {
    texto(s, cod, { x: L.margem + 0.25, y, w: wc - 0.4, h: alturas[i], fontFace: FONTE.codigo,
      fontSize: o.tamCodigo || 12, color: COR.branco, valign: "middle" });
    if (expl) texto(s, expl, { x: xe, y, w: we, h: alturas[i], fontSize: o.tamTexto || 14, valign: "middle" });
    if (expl && i < pares.length - 1) s.addShape(pres.shapes.LINE, { x: xe, y: y + alturas[i], w: we, h: 0, line: { color: COR.grade, width: 0.75 } });
    y += alturas[i];
  });
}

// Grade de números desenhada célula a célula (pixels, filtros, pooling)
function grade(pres, s, x, y, valores, lado, corDe) {
  valores.forEach((linha, i) => linha.forEach((v, j) => {
    const [fundo, letra] = corDe(v, i, j);
    s.addShape(pres.shapes.RECTANGLE, { x: x + j * lado, y: y + i * lado, w: lado, h: lado,
      fill: { color: fundo }, line: { color: COR.branco, width: 1.5 } });
    texto(s, String(v), { x: x + j * lado, y: y + i * lado, w: lado, h: lado,
      fontSize: Math.round(lado * 26), bold: true, color: letra, align: "center", valign: "middle" });
  }));
}

// Pixel 0..255 vira cinza; texto claro sobre célula escura
const cinza = (v) => {
  const h = Math.round(v).toString(16).padStart(2, "0").toUpperCase();
  return [h + h + h, v < 128 ? COR.branco : COR.tinta];
};

function seta(pres, s, x, y, w = 0.5) {
  s.addShape(pres.shapes.RIGHT_ARROW, { x, y, w, h: 0.35, fill: { color: COR.tintaFraca }, line: { color: COR.tintaFraca } });
}

// Lista de parágrafos: cada item é uma string ou [negrito, resto]
function paragrafos(s, itens, o) {
  const partes = [];
  itens.forEach((item, i) => {
    const fim = { breakLine: i < itens.length - 1 };
    if (typeof item === "string") partes.push({ text: item, options: fim });
    else partes.push({ text: item[0], options: { bold: true } }, { text: item[1], options: fim });
  });
  texto(s, partes, Object.assign({ paraSpaceAfter: 10 }, o));
}

module.exports = { COR, FONTE, L, img, texto, titulo, cartao, destaque, codigo, codigoExplicado, paragrafos, grade, cinza, seta };
