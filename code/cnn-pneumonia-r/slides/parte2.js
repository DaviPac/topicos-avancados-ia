// Slides 9-15: treino, dados, torch no R e o código.
const { COR, FONTE, L, img, texto, titulo, cartao, destaque, codigo, seta } = require("./tema");

function comoAprende(pres) {
  const s = pres.addSlide(); titulo(s, "Como a rede aprende");
  const passos = [["1", "Palpite", "a rede vê um lote de raios-X e dá as notas"], ["2", "Erro", "compara com o diagnóstico real (entropia cruzada)"],
    ["3", "Culpa", "calcula quanto cada peso contribuiu para o erro (backpropagation)"], ["4", "Ajuste", "move cada peso um pouco na direção certa (otimizador Adam)"]];
  passos.forEach(([n, nome, desc], i) => {
    const x = L.margem + i * 3.1;
    cartao(pres, s, x, 1.7, 2.75, 3.1);
    texto(s, n, { x: x + 0.25, y: 1.85, w: 1, h: 0.8, fontFace: FONTE.titulo, fontSize: 36, bold: true, color: COR.destaque });
    texto(s, nome, { x: x + 0.25, y: 2.65, w: 2.3, h: 0.5, fontSize: 20, bold: true });
    texto(s, desc, { x: x + 0.25, y: 3.2, w: 2.3, h: 1.5, fontSize: 14, color: COR.tintaFraca });
    if (i < 3) seta(pres, s, x + 2.77, 3.1, 0.3);
  });
  texto(s, [
    { text: "Lote: ", options: { bold: true } }, { text: "128 imagens de cada vez.   ", options: {} },
    { text: "Época: ", options: { bold: true } }, { text: "passar pelas 4.708 imagens de treino uma vez (37 lotes). Treinamos 10 épocas.", options: {} },
  ], { x: L.margem, y: 5.3, w: L.util, h: 1, fontSize: 17 });
  s.addNotes("[10:00–11:30] O treino é esse ciclo repetido centenas de vezes: palpite, erro, descobrir a culpa de cada peso e ajustar. Cada volta melhora um pouco os filtros. No nosso caso: 37 lotes por época, 10 épocas, ou seja, 370 ajustes.");
}

function divisao(pres) {
  const s = pres.addSlide(); titulo(s, "Treino, validação e teste — e o risco de decorar");
  const partes = [["4.708", "treino: a rede aprende com essas"], ["524", "validação: acompanha o progresso a cada época"], ["624", "teste: a prova final, com imagens que a rede nunca viu"]];
  partes.forEach(([n, leg], i) => destaque(pres, s, L.margem + i * 4.165, 1.6, 3.8, 2.4, n, leg, { tamanho: 40, corNumero: i === 2 ? COR.destaque : COR.tinta }));
  cartao(pres, s, L.margem, 4.4, L.util, 2.4);
  texto(s, [
    { text: "Overfitting: ", options: { bold: true } }, { text: "a rede decora o treino em vez de aprender o padrão — vai bem nas imagens que já viu e mal nas novas.", options: { breakLine: true } },
    { text: "Dropout: ", options: { bold: true } }, { text: "durante o treino, desliga 30% dos neurônios ao acaso. A rede não pode depender de poucos caminhos e generaliza melhor.", options: {} },
  ], { x: L.margem + 0.3, y: 4.65, w: L.util - 0.6, h: 2, fontSize: 17, paraSpaceAfter: 10 });
  s.addNotes("[11:30–12:45] Analogia: treino são os exercícios resolvidos, validação é o simulado e teste é a prova. Se medíssemos a nota no treino, seria como dar ao aluno a prova que ele usou para estudar. O dropout é uma defesa contra decorar.");
}

function dados(pres) {
  const s = pres.addSlide(); titulo(s, "Os dados: PneumoniaMNIST");
  s.addImage({ path: img("amostras.png"), x: L.margem, y: 1.35, w: 8.5, h: 8.5 * 640 / 1500 });
  texto(s, "Figura gerada pelo próprio script em R.", { x: L.margem, y: 5.05, w: 8.5, h: 0.4, fontSize: 12, color: COR.tintaFraca, italic: true });
  destaque(pres, s, 9.4, 1.35, 3.33, 1.9, "5.856", "raios-X de tórax de crianças, reduzidos para 28 × 28", { tamanho: 36 });
  destaque(pres, s, 9.4, 3.45, 3.33, 1.9, "74%", "das imagens de treino são de pneumonia (3.494 × 1.214)", { tamanho: 36, corNumero: COR.destaque });
  texto(s, "Fonte: Kermany et al., Cell (2018); padronizado pelo MedMNIST v2 — Yang et al., Scientific Data (2023).",
    { x: L.margem, y: 5.8, w: L.util, h: 0.8, fontSize: 14, color: COR.tintaFraca });
  s.addNotes("[12:45–14:00] Apresente a base: radiografias reais de crianças, com diagnóstico normal ou pneumonia. Destaque o desbalanceamento: 74% pneumonia. Guarde esse número, ele volta nos resultados.");
}

function adivinhe(pres) {
  const s = pres.addSlide(); titulo(s, "Sua vez: normal ou pneumonia?");
  [["A", "adivinhe_7.png"], ["B", "adivinhe_10.png"]].forEach(([letra, arq], i) => {
    const x = 2.0 + i * 5.0;
    s.addImage({ path: img(arq), x, y: 1.5, w: 4.2, h: 4.2 });
    texto(s, letra, { x, y: 5.8, w: 4.2, h: 0.7, fontFace: FONTE.titulo, fontSize: 32, bold: true, align: "center" });
  });
  s.addNotes("[14:00–14:45] Momento de interação: peça para quem assiste pausar e tentar adivinhar. Resposta: A é PNEUMONIA, B é NORMAL (no pulmão normal os campos pulmonares ficam mais escuros e nítidos). Comente: nem sempre é óbvio em 28 × 28 — é aí que a rede ajuda.");
}

function torchNoR(pres) {
  const s = pres.addSlide(); titulo(s, "A ferramenta: torch no R");
  texto(s, [
    { text: "Pacote do projeto mlverse que traz para o R o mesmo motor de deep learning do PyTorch (a biblioteca libtorch, em C++).", options: { bullet: true, breakLine: true } },
    { text: "Não precisa de Python.", options: { bullet: true, bold: true, breakLine: true } },
    { text: "Blocos que vamos usar: nn_conv2d, nnf_relu, nnf_max_pool2d, nn_linear, nn_dropout, optim_adam, dataloader.", options: { bullet: true } },
  ], { x: L.margem, y: 1.6, w: 6.2, h: 4.5, fontSize: 18, paraSpaceAfter: 14 });
  codigo(pres, s, ["# instalação (só uma vez)", "install.packages(\"torch\")", "library(torch)", "install_torch()", "", "# teste", "torch_randn(2, 3)"], 7.2, 1.6, 5.53, 3.6, 16);
  s.addNotes("[14:45–15:45] O torch do R é uma das novidades do ecossistema R para ciência de dados — é o tipo de ferramenta que o projeto pede. Mostre que a instalação são três linhas e que funciona sem Python.");
}

function arquiteturaCodigo(pres) {
  const s = pres.addSlide(); titulo(s, "A CNN no código");
  codigo(pres, s, [
    "CNN <- nn_module(\"CNNSimples\",", "  initialize = function() {",
    "    self$conv1 <- nn_conv2d(1, 16, 3, padding = 1)", "    self$conv2 <- nn_conv2d(16, 32, 3, padding = 1)",
    "    self$fc1 <- nn_linear(32 * 7 * 7, 64)", "    self$fc2 <- nn_linear(64, 2)", "    self$drop <- nn_dropout(0.3)", "  },",
    "  forward = function(x) {", "    x <- nnf_max_pool2d(nnf_relu(self$conv1(x)), 2)", "    x <- nnf_max_pool2d(nnf_relu(self$conv2(x)), 2)",
    "    x <- torch_flatten(x, start_dim = 2)", "    x <- self$drop(nnf_relu(self$fc1(x)))", "    self$fc2(x)", "  })"], L.margem, 1.45, 7.6, 5.5, 15);
  s.addTable([
    [{ text: "Camada", options: { bold: true } }, { text: "Pesos", options: { bold: true, align: "right" } }],
    ["conv1", { text: "160", options: { align: "right" } }], ["conv2", { text: "4.640", options: { align: "right" } }],
    ["fc1", { text: "100.416", options: { align: "right", bold: true, color: COR.destaque } }], ["fc2", { text: "130", options: { align: "right" } }],
    [{ text: "total", options: { bold: true } }, { text: "105.346", options: { bold: true, align: "right" } }],
  ], { x: 8.6, y: 1.45, w: 4.13, colW: [2.2, 1.93], fontFace: FONTE.corpo, fontSize: 16, border: { type: "solid", color: COR.grade, pt: 1 }, rowH: 0.45 });
  texto(s, "95% dos pesos estão na camada densa fc1 — os filtros convolucionais são baratos.", { x: 8.6, y: 4.4, w: 4.13, h: 1.3, fontSize: 15 });
  s.addNotes("[15:45–17:00] Mapeie o código na teoria: duas convoluções com ReLU e pooling, achatar, camada densa com dropout, saída com 2 notas. Mostre a tabela: os filtros têm poucos pesos; quase tudo está na camada densa. Conta da conv1: 16 filtros × 9 pesos + 16 = 160.");
}

function treinoCodigo(pres) {
  const s = pres.addSlide(); titulo(s, "O treino no código");
  codigo(pres, s, [
    "otimizador <- optim_adam(modelo$parameters, lr = 0.001)", "", "for (epoca in 1:10) {", "  coro::loop(for (lote in lotes) {",
    "    otimizador$zero_grad()", "    perda <- nnf_cross_entropy(modelo(lote[[1]]), lote[[2]])  # palpite e erro",
    "    perda$backward()                                          # culpa de cada peso", "    otimizador$step()                                         # ajuste",
    "  })", "}"], L.margem, 1.5, L.util, 4.2, 15);
  texto(s, "As quatro etapas da teoria viram quatro linhas de código.", { x: L.margem, y: 6.0, w: L.util, h: 0.6, fontFace: FONTE.titulo, fontSize: 22, italic: true });
  s.addNotes("[17:00–18:00] Ligue cada linha ao ciclo 'palpite, erro, culpa, ajuste'. Detalhe do R: no torch do R as classes começam em 1, não em 0 — por isso somamos 1 aos rótulos na preparação dos dados.");
}

module.exports = { comoAprende, divisao, dados, adivinhe, torchNoR, arquiteturaCodigo, treinoCodigo };
