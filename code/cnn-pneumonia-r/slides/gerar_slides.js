// Gera slides/videoaula_cnn_r.pptx.   npm install pptxgenjs  &&  node slides/gerar_slides.js
const path = require("path");
const pptxgen = require("pptxgenjs");
const p1 = require("./parte1");
const p2 = require("./parte2");
const p3 = require("./parte3");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Redes Neurais Convolucionais em R";

[p1.capa, p1.roteiro, p1.imagemNumeros, p1.porQueCNN, p1.convolucao, p1.hierarquia, p1.reluPooling, p1.daImagemADecisao,
  p2.comoAprende, p2.divisao, p2.dados, p2.adivinhe, p2.torchNoR, p2.arquiteturaCodigo, p2.treinoCodigo,
  p3.pratica, p3.resultados, p3.licoes, p3.exercicios, p3.encerramento].forEach((fazer) => fazer(pres));

const saida = path.join(__dirname, "videoaula_cnn_r.pptx");
pres.writeFile({ fileName: saida }).then(() => console.log(saida));
