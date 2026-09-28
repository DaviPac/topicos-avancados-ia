// Slides 17-24: os dados, o pacote torch e o código em R explicado linha a linha.
const { COR, FONTE, L, img, texto, titulo, destaque, codigo, codigoExplicado, paragrafos } = require("./tema");

function dados(pres) {
  const s = pres.addSlide(); titulo(s, "Os dados: PneumoniaMNIST");
  s.addImage({ path: img("amostras.png"), x: L.margem, y: 1.35, w: 8.0, h: 8.0 * 640 / 1500 });
  texto(s, "10 raios-X do treino, com o diagnóstico. Figura gerada pelo script em R.", { x: L.margem, y: 4.8, w: 8.0, h: 0.35, fontSize: 12, color: COR.tintaFraca, italic: true });
  destaque(pres, s, 8.9, 1.35, 3.83, 1.75, "5.856", "raios-X de tórax de crianças de 1 a 5 anos, cada um com o diagnóstico dado por médicos", { tamanho: 32, tamanhoLegenda: 13 });
  destaque(pres, s, 8.9, 3.3, 3.83, 1.75, "74%", "do treino é pneumonia (3.494 de 4.708 imagens)", { tamanho: 32, corNumero: COR.destaque, tamanhoLegenda: 13 });
  paragrafos(s, [
    ["PneumoniaMNIST ", "é uma base pública de raios-X de tórax de um hospital infantil em Guangzhou, na China (Kermany et al., Cell, 2018), com duas classes: normal e pneumonia."],
    ["Faz parte do MedMNIST v2 ", "(Yang et al., Scientific Data, 2023), uma coleção de bases de imagens médicas preparadas para ensino e pesquisa: todas as imagens reduzidas para 28 × 28 pixels, já divididas em treino, validação e teste, num único arquivo .npz."],
    ["O nome ", "vem do MNIST, uma base famosa de dígitos escritos à mão, também com imagens de 28 × 28."],
  ], { x: L.margem, y: 5.25, w: L.util, h: 2.0, fontSize: 15, paraSpaceAfter: 6 });
  s.addNotes("[15:45–16:30] Apresente a base: radiografias reais de crianças, com o diagnóstico. Explique o nome: PneumoniaMNIST é a parte de pneumonia do MedMNIST, uma coleção que deixa todas as imagens no mesmo formato, pequenas e já divididas. Destaque o desequilíbrio: 74% pneumonia. Esse número volta nos resultados.");
}

function adivinhe(pres) {
  const s = pres.addSlide(); titulo(s, "Sua vez: normal ou pneumonia?");
  [["A", "adivinhe_7.png"], ["B", "adivinhe_10.png"]].forEach(([letra, arq], i) => {
    const x = 2.0 + i * 5.0;
    s.addImage({ path: img(arq), x, y: 1.5, w: 4.2, h: 4.2 });
    texto(s, letra, { x, y: 5.8, w: 4.2, h: 0.7, fontFace: FONTE.titulo, fontSize: 32, bold: true, align: "center" });
  });
  s.addNotes("[16:30–17:00] Peça para quem assiste pausar o vídeo e tentar. Resposta: A é PNEUMONIA, B é NORMAL — no pulmão normal os campos pulmonares ficam mais escuros e nítidos; na pneumonia aparecem regiões mais claras e opacas. Em 28 × 28 nem sempre é fácil: é esse padrão que a rede precisa aprender.");
}

function torch(pres) {
  const s = pres.addSlide(); titulo(s, "A ferramenta: o pacote torch");
  paragrafos(s, [
    ["torch ", "é um pacote do R para criar e treinar redes neurais."],
    ["Tensor: ", "o tipo de dado do torch. É um array com várias dimensões, como os arrays do R. Um lote de treino é um tensor 128 × 1 × 28 × 28: 128 imagens, 1 canal (tons de cinza), 28 linhas e 28 colunas."],
    ["Camadas prontas: ", "convolução, pooling, camada densa… basta informar os tamanhos."],
    ["Faz as contas do treino: ", "calcula a backpropagation sozinho e já traz otimizadores como o Adam."],
  ], { x: L.margem, y: 1.5, w: 6.4, h: 5.3, fontSize: 18, paraSpaceAfter: 14 });
  codigo(pres, s, ["# instalar (só uma vez)", "install.packages(\"torch\")", "library(torch)", "install_torch()", "",
    "# teste: tensor 2 x 3 sorteado", "torch_randn(2, 3)"], 7.4, 1.5, 5.33, 3.6, 15);
  s.addNotes("[17:00–17:45] O torch é o pacote que traz redes neurais para o R. O conceito novo é o tensor, que é só um array de várias dimensões — a turma já conhece array no R. Mostre a instalação: três linhas, uma vez só.");
}

function traducao(pres) {
  const s = pres.addSlide(); titulo(s, "Cada ideia da aula vira uma função do torch");
  const linhas = [["Convolução", "nn_conv2d()", "passa filtros 3 × 3 pela imagem"], ["ReLU", "nnf_relu()", "zera os valores negativos"],
    ["Pooling", "nnf_max_pool2d()", "reduz cada mapa pela metade"], ["Achatar", "torch_flatten()", "põe os mapas em fila"],
    ["Camada densa", "nn_linear()", "somas ponderadas de todas as entradas"], ["Dropout", "nn_dropout()", "desliga neurônios ao acaso no treino"],
    ["Entropia cruzada", "nnf_cross_entropy()", "mede o erro"], ["Adam", "optim_adam()", "ajusta os pesos"], ["Lotes", "dataloader()", "entrega as imagens de 128 em 128"]];
  const cab = (t) => ({ text: t, options: { bold: true, fill: { color: COR.cartao } } });
  s.addTable([[cab("Ideia"), cab("Função no torch"), cab("O que faz")],
    ...linhas.map(([a, b, c]) => [a, { text: b, options: { fontFace: FONTE.codigo, bold: true, color: COR.destaque } }, c])],
  { x: L.margem, y: 1.4, w: L.util, colW: [3.0, 3.8, 5.33], rowH: 0.45, fontFace: FONTE.corpo, fontSize: 16, valign: "middle", border: { type: "solid", color: COR.grade, pt: 1 } });
  paragrafos(s, [["Padrão dos nomes: ", "nn_ cria uma peça que fica guardada dentro da rede; nnf_ é uma função aplicada direto aos dados."]],
    { x: L.margem, y: 6.2, w: L.util, h: 0.6, fontSize: 15 });
  s.addNotes("[17:45–18:30] Este slide é a ponte entre a teoria e o código: cada conceito visto até aqui tem uma função no torch. Não precisa decorar — é só para reconhecer as funções quando elas aparecerem no código.");
}

function prepararCodigo(pres) {
  const s = pres.addSlide(); titulo(s, "No R: preparar os dados");
  texto(s, "Depois da leitura do arquivo, as imagens são um array do R de 4.708 × 28 × 28, com números de 0 a 255. A função preparar() as transforma em tensores:",
    { x: L.margem, y: 1.3, w: L.util, h: 0.7, fontSize: 16 });
  codigoExplicado(pres, s, [
    ["x <- torch_tensor(imagens / 255, dtype = torch_float())", "divide por 255 (pixels de 0 a 1) e guarda num tensor de números decimais", 1.3],
    ["x <- (x - 0.5) / 0.5", "muda a escala para −1 a 1, centrada no zero (ajuda o treino)", 1.3],
    ["x <- x$unsqueeze(2)", "cria a dimensão do canal: 4.708 × 1 × 28 × 28 (1 canal = tons de cinza)", 1.3],
    ["y <- torch_tensor(as.integer(rotulos) + 1L,\n                dtype = torch_long())", "diagnósticos 0 e 1 viram 1 e 2: no torch as classes são numeradas a partir de 1", 1.5],
    ["lotes <- dataloader(tensor_dataset(treino$x, treino$y),\n                    batch_size = 128, shuffle = TRUE)", "junta imagens e diagnósticos e entrega em lotes de 128, embaralhados a cada época", 1.5],
  ], { y: 2.15, wCodigo: 6.4, tamTexto: 15 });
  s.addNotes("[18:30–19:15] Linha por linha. Normalizar os pixels para perto de zero ajuda o treino. O unsqueeze só acrescenta a dimensão do canal, que a convolução espera. E o detalhe do R: as classes no torch começam em 1, por isso o +1. O dataloader é quem entrega os lotes para o treino.");
}

function redePecas(pres) {
  const s = pres.addSlide(); titulo(s, "No R: as peças da rede");
  texto(s, "nn_module cria o molde da rede. Em initialize ficam as peças, cada uma guardada com um nome em self$:", { x: L.margem, y: 1.3, w: L.util, h: 0.5, fontSize: 16 });
  codigoExplicado(pres, s, [
    ["CNN <- nn_module(\"CNNSimples\",", "cria o molde da rede, chamado CNNSimples"],
    [" initialize = function() {", "a lista de peças:"],
    ["  self$convolucao1 <- nn_conv2d(1, 16,\n     kernel_size = 3, padding = 1)", "convolução: entra 1 imagem, saem 16 mapas (16 filtros 3 × 3). padding = 1 põe uma borda de zeros para o mapa continuar 28 × 28", 2],
    ["  self$convolucao2 <- nn_conv2d(16, 32,\n     kernel_size = 3, padding = 1)", "convolução: entram os 16 mapas, saem 32 (32 filtros)", 2],
    ["  self$densa <- nn_linear(32 * 7 * 7, 64)", "camada densa: entram 1.568 números, saem 64"],
    ["  self$saida <- nn_linear(64, 2)", "camada de saída: entram 64, saem 2 pontuações"],
    ["  self$dropout <- nn_dropout(0.3)", "dropout: desliga 30% ao acaso no treino"],
  ], { y: 1.95, wCodigo: 5.9, altura: 0.46, tamTexto: 15 });
  texto(s, "Ao todo, 105.346 pesos a aprender — 95% deles na camada densa.", { x: L.margem, y: 6.65, w: L.util, h: 0.45, fontFace: FONTE.titulo, fontSize: 18, italic: true });
  s.addNotes("[19:15–20:15] Mapeie cada linha na teoria. Os números das convoluções são entradas e saídas: 1 imagem entra, 16 mapas saem; 16 entram, 32 saem. Na camada densa, 32 × 7 × 7 é exatamente o 1.568 da jornada. A rede tem 105 mil pesos — o script em R imprime esse total.");
}

function redeCaminho(pres) {
  const s = pres.addSlide(); titulo(s, "No R: o caminho da imagem");
  texto(s, "Em forward fica a ordem das peças. x começa como o lote de imagens e é substituído a cada passo:", { x: L.margem, y: 1.3, w: L.util, h: 0.5, fontSize: 16 });
  codigoExplicado(pres, s, [
    ["x <- self$convolucao1(x)", "convolução 1: 16 mapas 28 × 28"], ["x <- nnf_relu(x)", "ReLU: negativos viram zero"],
    ["x <- nnf_max_pool2d(x, 2)", "pooling 2 × 2: 16 mapas 14 × 14"], ["x <- self$convolucao2(x)", "convolução 2: 32 mapas 14 × 14"],
    ["x <- nnf_relu(x)", "ReLU"], ["x <- nnf_max_pool2d(x, 2)", "pooling 2 × 2: 32 mapas 7 × 7"],
    ["x <- torch_flatten(x, start_dim = 2)", "achatar: 1.568 números por imagem (start_dim = 2 porque a dimensão 1 é o lote: cada imagem continua separada)", 1.5],
    ["x <- nnf_relu(self$densa(x))", "camada densa + ReLU: 64 números"], ["x <- self$dropout(x)", "dropout"],
    ["self$saida(x)", "saída: 2 pontuações, o resultado final"],
  ], { y: 1.9, wCodigo: 5.2, altura: 0.47, tamCodigo: 14, tamTexto: 15 });
  s.addNotes("[20:15–21:00] Uma linha para cada peça, na ordem da jornada. Chame atenção para o x: ele é reescrito a cada linha, então cada passo recebe o resultado do anterior. O softmax não está aqui: ele é aplicado depois, na hora de calcular as probabilidades.");
}

function treinoCodigo(pres) {
  const s = pres.addSlide(); titulo(s, "No R: o treino");
  codigoExplicado(pres, s, [
    ["otimizador <- optim_adam(modelo$parameters, lr = 0.001)", "cria o Adam, que vai ajustar os pesos da rede; lr é o tamanho do passo", 1.3],
    ["for (epoca in 1:10) {", "repete por 10 épocas"],
    ["  coro::loop(for (lote in lotes) {", "para cada lote de 128 imagens (coro::loop percorre o dataloader)"],
    ["    otimizador$zero_grad()", "zera as inclinações do lote anterior"],
    ["    previsao <- modelo(lote[[1]])", "1. palpite: passa as imagens pela rede"],
    ["    perda <- nnf_cross_entropy(previsao, lote[[2]])", "2. erro: compara com os diagnósticos"],
    ["    perda$backward()", "3. backpropagation: a inclinação de cada peso"],
    ["    otimizador$step()", "4. Adam: cada peso dá um passo"],
    ["  })\n}", "", 1.4],
  ], { y: 1.4, wCodigo: 6.6, altura: 0.5, tamCodigo: 13, tamTexto: 15 });
  s.addNotes("[21:00–22:00] Ligue cada linha aos quatro passos: palpite, erro, backpropagation e Adam. lote[[1]] são as imagens do lote e lote[[2]] os diagnósticos. O zero_grad existe porque o torch acumula as inclinações; é preciso zerar antes de cada lote.");
}

module.exports = { dados, adivinhe, torch, traducao, prepararCodigo, redePecas, redeCaminho, treinoCodigo };
