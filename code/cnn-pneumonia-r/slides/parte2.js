// Slides 9-16: ReLU, pooling, o caminho pela rede, a saída e como a rede aprende.
const { COR, FONTE, L, img, texto, titulo, cartao, destaque, paragrafos, grade, seta } = require("./tema");

const rotulo = (s, t, x, y, w) => texto(s, t, { x, y, w, h: 0.4, fontSize: 14, color: COR.tintaFraca, align: "center" });

function relu(pres) {
  const s = pres.addSlide(); titulo(s, "ReLU: ficar só com o que o filtro encontrou");
  s.addImage({ path: img("mapa_filtro.png"), x: L.margem, y: 1.5, w: 2.8, h: 2.8 });
  seta(pres, s, 3.55, 2.72);
  s.addImage({ path: img("mapa_relu.png"), x: 4.2, y: 1.5, w: 2.8, h: 2.8 });
  rotulo(s, "mapa do filtro", L.margem, 4.35, 2.8); rotulo(s, "depois da ReLU", 4.2, 4.35, 2.8);
  grade(pres, s, 1.0, 5.1, [[-3, 0, 2, 5]], 0.6, () => [COR.cartao, COR.tinta]);
  texto(s, "→", { x: 3.45, y: 5.1, w: 0.6, h: 0.6, fontSize: 24, align: "center", valign: "middle" });
  grade(pres, s, 4.1, 5.1, [[0, 0, 2, 5]], 0.6, (v) => [v > 0 ? "FAD3C2" : COR.cartao, COR.tinta]);
  texto(s, "ReLU(x) = max(0, x)", { x: L.margem, y: 5.9, w: 6.4, h: 0.5, fontFace: FONTE.titulo, fontSize: 20, bold: true, align: "center" });
  paragrafos(s, [
    ["O que faz: ", "valores negativos viram zero; valores positivos passam sem mudança."],
    ["Por que, 1: ", "no mapa, valor negativo quer dizer que o padrão do filtro não está ali. Zerando, sobra no mapa só onde o padrão foi encontrado (o laranja)."],
    ["Por que, 2: ", "somas ponderadas empilhadas continuam sendo uma soma ponderada — sem a ReLU, a rede inteira seria uma grande regressão linear. A ReLU dobra essa reta e permite aprender relações complexas."],
    ["Onde: ", "depois de cada convolução e depois da camada densa."],
  ], { x: 7.4, y: 1.5, w: 5.33, h: 5.6, fontSize: 16, paraSpaceAfter: 12 });
  s.addNotes("[7:45–8:45] Mostre o antes e depois: o azul some, fica só o laranja. Dois motivos para a ReLU. Primeiro, ela limpa o mapa: fica só onde o filtro achou o padrão. Segundo, e mais importante: se a rede só fizesse somas ponderadas, uma depois da outra, o resultado final ainda seria uma soma ponderada, uma regressão linear. A ReLU quebra essa linearidade e deixa a rede aprender relações mais complicadas.");
}

function pooling(pres) {
  const s = pres.addSlide(); titulo(s, "Pooling: resumir o mapa pela metade");
  const tons = ["CADCFC", "FAD3C2", "C8EBDD", "DDD8F4"];
  const quadrante = (i, j) => tons[(i < 2 ? 0 : 2) + (j < 2 ? 0 : 1)];
  grade(pres, s, L.margem, 1.5, [[1, 3, 2, 1], [4, 6, 5, 0], [3, 1, 1, 2], [0, 2, 7, 4]], 0.55, (v, i, j) => [quadrante(i, j), COR.tinta]);
  seta(pres, s, 3.0, 2.4);
  grade(pres, s, 3.7, 2.05, [[6, 5], [3, 7]], 0.55, (v, i, j) => [tons[i * 2 + j], COR.tinta]);
  texto(s, "fica o maior de cada bloco 2 × 2", { x: 4.9, y: 2.05, w: 2.0, h: 1.1, fontSize: 14, color: COR.tintaFraca, valign: "middle" });
  s.addImage({ path: img("mapa_relu.png"), x: L.margem, y: 4.05, w: 2.6, h: 2.6 });
  seta(pres, s, 3.4, 5.18);
  s.addImage({ path: img("mapa_pool.png"), x: 4.1, y: 4.7, w: 1.3, h: 1.3 });
  rotulo(s, "28 × 28", L.margem, 6.7, 2.6); rotulo(s, "14 × 14", 3.85, 6.05, 1.8);
  paragrafos(s, [
    ["O que faz: ", "divide o mapa em blocos de 2 × 2 pixels e guarda só o maior valor de cada bloco."],
    ["Resultado: ", "o mapa fica com metade da largura e metade da altura (um quarto dos números), mas os lugares onde o padrão foi encontrado continuam marcados."],
    ["Por quê: ", "menos contas nas camadas seguintes, e um padrão deslocado um pixel para o lado dá quase o mesmo resultado."],
    ["E depois? ", "O mapa reduzido é uma imagem menor. Ele vira a entrada da próxima convolução, que procura padrões nesses mapas."],
  ], { x: 7.4, y: 1.5, w: 5.33, h: 5.6, fontSize: 16, paraSpaceAfter: 12 });
  s.addNotes("[8:45–9:45] Pooling: de cada bloco de 2 por 2, fica o maior valor. O mapa encolhe pela metade em cada direção, mas o sinal forte continua lá — compare o mapa real de 28 por 28 com o de 14 por 14. E responda a dúvida natural: sim, o que sai daqui é uma imagem menor, que entra na próxima convolução.");
}

function jornada(pres) {
  const s = pres.addSlide(); titulo(s, "A jornada de um raio-X pela rede");
  const passos = [["raio-X", "1 imagem", "28 × 28"], ["convolução 1 + ReLU + pooling", "16 mapas", "14 × 14"], ["convolução 2 + ReLU + pooling", "32 mapas", "7 × 7"],
    ["achatar", "1.568", "números"], ["camada densa + ReLU", "64", "números"], ["saída", "2", "pontuações"]];
  passos.forEach(([nome, qtd, forma], i) => {
    const x = L.margem + i * 2.07;
    cartao(pres, s, x, 1.5, 1.75, 2.1, i === 5 ? "FAD3C2" : COR.cartao);
    texto(s, nome, { x: x + 0.1, y: 1.6, w: 1.55, h: 0.75, fontSize: 13, color: COR.tintaFraca, align: "center", valign: "middle" });
    texto(s, qtd, { x: x + 0.1, y: 2.4, w: 1.55, h: 0.55, fontSize: 20, bold: true, align: "center" });
    texto(s, forma, { x: x + 0.1, y: 2.95, w: 1.55, h: 0.45, fontSize: 15, align: "center" });
    if (i < 5) seta(pres, s, x + 1.77, 2.4, 0.28);
  });
  paragrafos(s, [
    ["Como ler “16 mapas 14 × 14”: ", "cada um dos 16 filtros gera um mapa; cada mapa tem 14 linhas e 14 colunas."],
    ["De onde vêm 16 e 32: ", "é quem monta a rede que escolhe quantos filtros cada convolução tem."],
    ["28 → 14 → 7: ", "cada pooling corta o tamanho pela metade."],
    ["Do simples ao complexo: ", "os filtros da 2ª convolução olham os 16 mapas da 1ª ao mesmo tempo. Assim, combinam padrões simples (bordas) em padrões mais complexos (formas, texturas)."],
    ["1.568 = 32 × 7 × 7: ", "todos os números dos 32 mapas, postos em fila."],
  ], { x: L.margem, y: 3.95, w: L.util, h: 3.2, fontSize: 16, paraSpaceAfter: 8 });
  s.addNotes("[9:45–10:45] Junte as peças e siga um raio-X. Entra 1 imagem de 28 por 28. A primeira convolução gera 16 mapas; o pooling os reduz para 14 por 14. A segunda convolução gera 32 mapas, reduzidos para 7 por 7. Aí começa a parte 2: achatar, camada densa e saída. Explique cada número: 16 e 32 são escolhas; 14 e 7 vêm do pooling; 1.568 é 32 vezes 7 vezes 7.");
}

function achatarDensa(pres) {
  const s = pres.addSlide(); titulo(s, "Achatar e camada densa");
  [["Achatar", "A camada densa recebe uma lista de números, não uma grade. Achatar é enfileirar os 32 mapas de 7 × 7 numa única fila de 1.568 números — como transformar cada imagem numa linha de tabela com 1.568 colunas."],
    ["Camada densa", "64 neurônios iguais ao do começo da aula: cada um faz uma soma ponderada dos 1.568 números, seguida de ReLU. Cada neurônio combina vários padrões encontrados num único número. O 64 é outra escolha de quem monta a rede."],
  ].forEach(([nome, desc], i) => {
    const x = L.margem + i * 6.23;
    cartao(pres, s, x, 1.5, 5.9, 5.4);
    texto(s, nome, { x: x + 0.3, y: 1.7, w: 5.3, h: 0.5, fontFace: FONTE.titulo, fontSize: 24, bold: true, color: COR.destaque });
    texto(s, desc, { x: x + 0.3, y: 5.0, w: 5.3, h: 1.8, fontSize: 16 });
  });
  const cores = (v) => [["CADCFC", "FAD3C2", "C8EBDD"][Math.floor((v - 1) / 3)], COR.tinta];
  grade(pres, s, 1.0, 2.5, [[1, 2, 3], [4, 5, 6], [7, 8, 9]], 0.5, cores);
  seta(pres, s, 2.65, 3.1, 0.4);
  grade(pres, s, 3.2, 3.05, [[1, 2, 3, 4, 5, 6, 7, 8, 9]], 0.36, cores);
  const ys = [2.5, 3.2, 3.9];
  ys.forEach((y) => s.addShape(pres.shapes.OVAL, { x: 7.3, y, w: 0.45, h: 0.45, fill: { color: COR.branco }, line: { color: COR.tintaFraca } }));
  [2.85, 3.55].forEach((y) => s.addShape(pres.shapes.OVAL, { x: 10.3, y, w: 0.45, h: 0.45, fill: { color: "FAD3C2" }, line: { color: COR.destaque } }));
  ys.forEach((y1) => [2.85, 3.55].forEach((y2) => s.addShape(pres.shapes.LINE, Object.assign(
    { x: 7.75, y: Math.min(y1, y2) + 0.22, w: 2.55, h: Math.abs(y2 - y1), line: { color: COR.grade, width: 1 } }, y2 < y1 ? { flipV: true } : {}))));
  texto(s, "cada neurônio recebe todas as entradas", { x: 7.1, y: 4.45, w: 5.4, h: 0.4, fontSize: 13, color: COR.tintaFraca, align: "right" });
  s.addNotes("[10:45–11:45] Achatar: a camada densa trabalha com uma lista, então os 32 mapas são postos em fila — 1.568 números, como uma linha de uma tabela. Camada densa: são 64 neurônios, cada um uma soma ponderada de todos os 1.568 números. É aqui que os padrões encontrados na parte 1 são combinados para chegar à decisão.");
}

function saida(pres) {
  const s = pres.addSlide(); titulo(s, "A saída: 2 pontuações que viram probabilidades");
  const cards = [["saída da rede: pontuações", "1,2  ·  3,1", "normal · pneumonia", COR.tinta], ["depois do softmax", "13%  ·  87%", "normal · pneumonia", COR.destaque],
    ["diagnóstico", "pneumonia", "a classe de maior probabilidade", COR.tinta]];
  cards.forEach(([cima, meio, baixo, cor], i) => {
    const x = L.margem + i * 4.2;
    cartao(pres, s, x, 1.5, 3.7, 2.2);
    texto(s, cima, { x: x + 0.3, y: 1.65, w: 3.1, h: 0.4, fontSize: 14, color: COR.tintaFraca });
    texto(s, meio, { x: x + 0.3, y: 2.1, w: 3.1, h: 0.9, fontFace: FONTE.titulo, fontSize: 32, bold: true, color: cor, valign: "middle" });
    texto(s, baixo, { x: x + 0.3, y: 3.05, w: 3.1, h: 0.4, fontSize: 14, color: COR.tintaFraca });
    if (i < 2) seta(pres, s, x + 3.75, 2.45, 0.4);
  });
  paragrafos(s, [
    ["Pontuação: ", "a última camada tem 2 neurônios, um para cada classe. Cada um dá um número qualquer (pode ser negativo, pode ser 50): quanto maior, mais a imagem se parece com aquela classe."],
    ["Softmax: ", "transforma as pontuações em probabilidades que somam 100%.  p(pneumonia) = e^3,1 / (e^1,2 + e^3,1) = 0,87."],
    ["Com 2 classes, ", "o softmax é a mesma função logística da regressão logística."],
    ["Decisão: ", "a classe de maior probabilidade — o mesmo que cortar em 50%."],
  ], { x: L.margem, y: 4.1, w: L.util, h: 3.0, fontSize: 17, paraSpaceAfter: 10 });
  s.addNotes("[11:45–12:45] A rede termina com dois números, as pontuações — uma para normal, outra para pneumonia. Sozinhas elas não são probabilidades. O softmax as converte: eleva e a cada pontuação e divide pelo total; aqui dá 13% e 87%. Quem conhece regressão logística: com duas classes é a mesma função logística. A resposta final é a classe mais provável.");
}

function entropia(pres) {
  const s = pres.addSlide(); titulo(s, "Como medir o erro: entropia cruzada");
  texto(s, "perda = − log(probabilidade dada à classe certa)", { x: L.margem, y: 1.45, w: L.util, h: 0.7, fontFace: FONTE.titulo, fontSize: 26, bold: true, color: COR.destaque });
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ valign: "middle" }, o) });
  s.addTable([
    [c("Raio-X com pneumonia. A rede deu à pneumonia…", { bold: true }), c("perda", { bold: true, align: "right" }), c("leitura", { bold: true })],
    [c("90%"), c("0,11", { align: "right" }), c("previsão certa e segura: erro pequeno")],
    [c("50%"), c("0,69", { align: "right" }), c("meio a meio: erro médio")],
    [c("10%"), c("2,30", { align: "right", bold: true, color: COR.destaque }), c("previsão errada com alta probabilidade: erro grande")],
  ], { x: L.margem, y: 2.35, w: L.util, colW: [4.9, 1.4, 5.83], rowH: 0.55, fontFace: FONTE.corpo, fontSize: 16, border: { type: "solid", color: COR.grade, pt: 1 } });
  paragrafos(s, [
    ["Para que serve: ", "para aprender, a rede precisa de um único número que diga o quanto ela errou. É esse número que o treino tenta diminuir."],
    ["Como funciona: ", "quanto menor a probabilidade dada à classe certa, maior a perda. Errar com alta probabilidade custa muito mais do que errar por pouco."],
    ["No lote: ", "a perda é a média das perdas de cada imagem."],
    ["Parente conhecido: ", "é o mesmo critério da regressão logística. Na regressão linear, o papel é da soma dos quadrados dos erros."],
  ], { x: L.margem, y: 4.8, w: L.util, h: 2.4, fontSize: 16, paraSpaceAfter: 6 });
  s.addNotes("[12:45–13:45] Para aprender, a rede precisa medir o erro. Na classificação, a medida é a entropia cruzada: o menos logaritmo da probabilidade que a rede deu à classe correta. Leia a tabela: 90% na classe certa, perda baixa; 10%, perda alta. Faça a ponte com a regressão linear, onde o erro é medido pela soma dos quadrados.");
}

function descida(pres) {
  const s = pres.addSlide(); titulo(s, "Como a rede aprende: descendo a curva do erro");
  s.addImage({ path: img("descida.png"), x: L.margem, y: 1.4, w: 5.6, h: 5.6 * 800 / 1100 });
  const passos = [["1  Palpite: ", "a rede calcula as probabilidades para um lote de imagens."], ["2  Erro: ", "a entropia cruzada mede o quanto errou."],
    ["3  Backpropagation: ", "calcula, para cada peso, a inclinação da curva do erro: aumentar esse peso faz o erro subir ou descer? O cálculo começa na saída e volta até os filtros — daí o nome."],
    ["4  Adam: ", "dá o passo: muda cada peso um pouco no sentido que diminui o erro. É uma versão da descida do gradiente que ajusta sozinha o tamanho do passo de cada peso."]];
  paragrafos(s, passos, { x: 6.7, y: 1.4, w: 6.03, h: 4.4, fontSize: 15, paraSpaceAfter: 10 });
  cartao(pres, s, L.margem, 5.7, L.util, 1.35);
  paragrafos(s, [["Lote: ", "128 imagens por vez.   "], ["Época: ", "uma passada por todas as 4.708 imagens de treino = 37 lotes. Com 10 épocas, os pesos são ajustados 370 vezes, sempre repetindo 1 → 2 → 3 → 4."]],
    { x: L.margem + 0.3, y: 5.85, w: L.util - 0.6, h: 1.1, fontSize: 15, paraSpaceAfter: 2 });
  s.addNotes("[13:45–15:00] Imagine a curva do erro em função de um peso. O peso começa sorteado, em algum ponto da curva. A backpropagation calcula a inclinação ali — se a curva desce para a direita, o peso deve aumentar. O Adam dá um passo nessa direção. Repetindo, o peso chega perto do menor erro. A rede faz isso ao mesmo tempo para seus 105 mil pesos, inclusive os números dos filtros. É assim que os filtros são aprendidos.");
}

function divisao(pres) {
  const s = pres.addSlide(); titulo(s, "Treino, validação e teste — e o risco de decorar");
  const partes = [["4.708", "treino: imagens usadas para ajustar os pesos"], ["524", "validação: conferir o progresso a cada época, sem ajustar nada"], ["624", "teste: a avaliação final, com imagens que a rede nunca viu"]];
  partes.forEach(([n, leg], i) => destaque(pres, s, L.margem + i * 4.165, 1.5, 3.8, 2.3, n, leg, { tamanho: 40, corNumero: i === 2 ? COR.destaque : COR.tinta }));
  cartao(pres, s, L.margem, 4.2, L.util, 2.7);
  paragrafos(s, [
    ["Overfitting: ", "a rede decora as imagens de treino em vez de aprender o padrão — vai bem nelas e mal nas novas. Por isso a nota que vale é a do teste."],
    ["Dropout: ", "durante o treino, a cada lote, 30% dos neurônios da camada densa são desligados ao acaso. A rede não pode depender de poucos neurônios e generaliza melhor. Na hora de avaliar, todos voltam a funcionar."],
  ], { x: L.margem + 0.3, y: 4.45, w: L.util - 0.6, h: 2.3, fontSize: 17, paraSpaceAfter: 12 });
  s.addNotes("[15:00–15:45] Analogia: treino são os exercícios resolvidos, validação é o simulado, teste é a prova. Medir a nota no treino seria dar ao aluno a prova que ele usou para estudar. O dropout é uma defesa contra decorar.");
}

module.exports = { relu, pooling, jornada, achatarDensa, saida, entropia, descida, divisao };
