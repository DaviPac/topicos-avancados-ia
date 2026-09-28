// Gera slides/videoaula_cnn_r.pptx.   npm install pptxgenjs  &&  node slides/gerar_slides.js
const path = require("path");
const pptxgen = require("pptxgenjs");
const p1 = require("./parte1");
const p2 = require("./parte2");
const p3 = require("./parte3");
const p4 = require("./parte4");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Redes Neurais Convolucionais em R";

[p1.capa, p1.roteiro, p1.problema, p1.neuronio, p1.oQueECNN, p1.imagemNumeros, p1.convolucao, p1.filtrosAprendidos,
  p2.relu, p2.pooling, p2.jornada, p2.achatarDensa, p2.saida, p2.entropia, p2.descida, p2.divisao,
  p3.dados, p3.adivinhe, p3.torch, p3.traducao, p3.prepararCodigo, p3.redePecas, p3.redeCaminho, p3.treinoCodigo,
  p4.pratica, p4.resultados, p4.licoes, p4.exercicios, p4.encerramento].forEach((fazer) => fazer(pres));

const saida = path.join(__dirname, "videoaula_cnn_r.pptx");
pres.writeFile({ fileName: saida }).then(() => console.log(saida));
