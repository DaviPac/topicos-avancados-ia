// Gera slides/pitch_cnn_r.pptx: versão de 5 minutos da videoaula.   node slides/pitch.js
// Reaproveita slides da videoaula, trocando só as anotações do apresentador.
const path = require("path");
const pptxgen = require("pptxgenjs");
const { COR, FONTE, L, texto, titulo, cartao, codigo } = require("./tema");
const { capa, problema } = require("./parte1");
const { resultados } = require("./parte4");
const { redeCompleta } = require("./rede_completa");

function emR(pres) {
  const s = pres.addSlide(); titulo(s, "Em R, de ponta a ponta");
  const passos = [["1  Ler", "o arquivo .npz lido em R puro, sem Python"], ["2  Preparar", "pixels em tensores de −1 a 1, em lotes de 128"],
    ["3  Montar", "nn_module: 2 convoluções e 1 camada densa, 105 mil pesos"], ["4  Treinar", "10 épocas com entropia cruzada e Adam"]];
  passos.forEach(([nome, desc], i) => {
    const y = 1.5 + i * 1.3;
    cartao(pres, s, L.margem, y, 5.6, 1.1);
    texto(s, nome, { x: L.margem + 0.3, y: y + 0.12, w: 5.0, h: 0.4, fontSize: 18, bold: true, color: COR.destaque });
    texto(s, desc, { x: L.margem + 0.3, y: y + 0.55, w: 5.0, h: 0.45, fontSize: 15 });
  });
  codigo(pres, s, ["# o caminho da imagem pela rede", "x <- self$convolucao1(x)", "x <- nnf_relu(x)", "x <- nnf_max_pool2d(x, 2)",
    "x <- self$convolucao2(x)", "x <- nnf_relu(x)", "x <- nnf_max_pool2d(x, 2)", "x <- torch_flatten(x, start_dim = 2)",
    "x <- nnf_relu(self$densa(x))", "x <- self$dropout(x)", "self$saida(x)"], 6.6, 1.5, 6.13, 5.0, 15);
  texto(s, "Um único script, cnn_pneumonia.R, com o pacote torch e o R base.", { x: L.margem, y: 6.75, w: L.util, h: 0.45, fontFace: FONTE.titulo, fontSize: 18, italic: true });
  s.addNotes("[2:15–3:15] O script tem quatro etapas: ler o arquivo, preparar os tensores, montar a rede e treinar. À direita, o caminho da imagem no código — uma linha para cada peça do desenho anterior. Tudo em R, com o pacote torch.");
}

function fechamento(pres) {
  const s = pres.addSlide(); s.background = { color: COR.escuro };
  texto(s, "O que fica", { x: L.margem, y: 0.8, w: L.util, h: 0.9, fontFace: FONTE.titulo, fontSize: 40, bold: true, color: COR.branco });
  texto(s, [
    { text: "Uma CNN encontra padrões na imagem com filtros aprendidos e depois combina esses padrões para decidir.", options: { bullet: true, breakLine: true } },
    { text: "Em R, com torch: 105 mil pesos, 86,9% de acerto e 98,5% das pneumonias detectadas em raios-X nunca vistos.", options: { bullet: true, breakLine: true } },
    { text: "O ponto fraco: 76 alarmes falsos em 234 normais, herança dos dados (74% pneumonia). Próximo passo: pesar as classes ou mudar o corte de 50%.", options: { bullet: true } },
  ], { x: L.margem, y: 2.0, w: L.util, h: 3.6, fontSize: 22, color: COR.branco, paraSpaceAfter: 16 });
  texto(s, "Obrigado!  ·  Davi Pires Aquino de Carvalho · UFRPE", { x: L.margem, y: 6.3, w: L.util, h: 0.5, fontSize: 16, color: COR.sobreEscuro });
  s.addNotes("[4:15–5:00] Feche com as três ideias: como a CNN funciona, o resultado em R, e a limitação com o próximo passo. Agradeça.");
}

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "CNN em R: pneumonia em raios-X (pitch)";
capa(pres, "[0:00–0:20] Apresente-se. Gancho: 'Uma rede neural consegue olhar um raio-X de tórax e dizer se a criança tem pneumonia? Eu treinei uma em R.'");
problema(pres, "[0:20–1:00] A tarefa: entra um raio-X de 28 × 28 pixels, sai a probabilidade de pneumonia. A rede aprende com milhares de raios-X de crianças já diagnosticados por médicos (base PneumoniaMNIST).");
redeCompleta(pres, "[1:00–2:15] Como funciona, em uma imagem. Parte 1: as convoluções passam filtros pela imagem e geram mapas de onde cada padrão aparece; a ReLU zera os negativos e o pooling reduz os mapas pela metade. Parte 2: achatar, camada densa e 2 neurônios de saída, que o softmax transforma em probabilidades. Os filtros não são escritos à mão: começam sorteados e o treino os ajusta para diminuir o erro.");
emR(pres);
resultados(pres, "[3:15–4:15] O resultado nos 624 raios-X de teste, que a rede nunca viu: 86,9% de acerto. Quase nenhuma pneumonia passa (6 em 390), mas há 76 alarmes falsos em crianças saudáveis — a rede puxa para pneumonia porque 74% do treino é pneumonia.");
fechamento(pres);
pres.writeFile({ fileName: path.join(__dirname, "pitch_cnn_r.pptx") }).then((f) => console.log(f));
