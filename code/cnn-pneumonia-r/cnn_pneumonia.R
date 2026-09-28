# ============================================================================
# CNN simples em R com torch -- classificação de raio-X: normal x pneumonia
# Dados: PneumoniaMNIST (MedMNIST v2, Yang et al., Scientific Data, 2023)
#
# Rode seção por seção no RStudio: selecione e aperte Ctrl+Enter.
# ============================================================================


# ---- 1. Pacotes --------------------------------------------------------------
# Só na primeira vez (baixa ~500 MB):
#   install.packages("torch")
#   library(torch)
#   install_torch()
# Depois de instalar, reinicie o R (Session > Restart R).

library(torch)
torch_manual_seed(42)   # sorteios iguais a cada execução
set.seed(42)


# ---- 2. Funções auxiliares ---------------------------------------------------

# O .npz é um arquivo zip com vários arrays do NumPy (.npy) dentro.
# Esta função lê um .npy de números inteiros de 0 a 255, em R puro.
ler_npy <- function(arquivo) {
  con <- file(arquivo, "rb")
  on.exit(close(con))
  readBin(con, "raw", 6)                                   # assinatura "\x93NUMPY"
  versao <- as.integer(readBin(con, "raw", 2))[1]
  tamanho <- readBin(con, "integer", 1, size = if (versao == 1) 2 else 4, endian = "little")
  cabecalho <- rawToChar(readBin(con, "raw", tamanho))     # ex.: 'shape': (4708, 28, 28)
  stopifnot(grepl("u1", cabecalho))                        # só aceita inteiros de 0 a 255
  forma <- suppressWarnings(as.integer(strsplit(sub(".*\\((.*)\\).*", "\\1", cabecalho), ",\\s*")[[1]]))
  forma <- forma[!is.na(forma)]
  valores <- as.integer(readBin(con, "raw", prod(forma)))
  # o NumPy grava linha por linha; o R preenche coluna por coluna -> inverte as dimensões
  aperm(array(valores, dim = rev(forma)), rev(seq_along(forma)))
}

ler_npz <- function(caminho) {
  pasta <- tempfile()
  unzip(caminho, exdir = pasta)
  arquivos <- list.files(pasta, pattern = "\\.npy$", full.names = TRUE)
  setNames(lapply(arquivos, ler_npy), sub("\\.npy$", "", basename(arquivos)))
}

# Desenha um raio-X de 28 x 28 na orientação certa
mostrar <- function(img, titulo = "") {
  image(t(img[28:1, ]), col = gray.colors(256, start = 0, end = 1), axes = FALSE, main = titulo)
}

# AUC: chance de a rede dar nota maior a um doente do que a um saudável
auc <- function(escore, y) {
  r <- rank(escore)
  n1 <- sum(y == 1)
  n0 <- sum(y == 0)
  (sum(r[y == 1]) - n1 * (n1 + 1) / 2) / (n1 * n0)
}

CLASSES <- c("normal", "pneumonia")


# ---- 3. Carregar e conhecer os dados -----------------------------------------
# Escolha o arquivo pneumoniamnist.npz na janela que vai abrir
# (fica na pasta code/cnn-pneumonia-medmnist/dados/ do projeto).
dados <- ler_npz(file.choose())

sapply(dados, dim)                         # quantas imagens em cada parte
table(dados$train_labels)                  # 0 = normal, 1 = pneumonia

par(mfrow = c(2, 5), mar = c(1, 1, 2, 1))  # 10 exemplos do treino
for (i in 1:10) mostrar(dados$train_images[i, , ], CLASSES[dados$train_labels[i] + 1])


# ---- 4. Preparar os tensores -------------------------------------------------
preparar <- function(imagens, rotulos) {
  x <- torch_tensor(imagens / 255, dtype = torch_float())   # pixels de 0 a 1
  x <- (x - 0.5) / 0.5                                       # pixels de -1 a 1
  x <- x$unsqueeze(2)                                        # N x 1 x 28 x 28 (1 canal: cinza)
  y <- torch_tensor(as.integer(rotulos) + 1L, dtype = torch_long())  # no torch do R as classes começam em 1
  list(x = x, y = y)
}

treino    <- preparar(dados$train_images, dados$train_labels)
validacao <- preparar(dados$val_images,   dados$val_labels)
teste     <- preparar(dados$test_images,  dados$test_labels)

lotes <- dataloader(tensor_dataset(treino$x, treino$y),   # imagens + diagnósticos
                    batch_size = 128, shuffle = TRUE)    # lotes de 128, embaralhados


# ---- 5. A CNN ----------------------------------------------------------------
CNN <- nn_module(
  "CNNSimples",
  # initialize: as peças da rede
  initialize = function() {
    self$convolucao1 <- nn_conv2d(1, 16, kernel_size = 3, padding = 1)   # 16 filtros 3x3
    self$convolucao2 <- nn_conv2d(16, 32, kernel_size = 3, padding = 1)  # 32 filtros 3x3
    self$densa       <- nn_linear(32 * 7 * 7, 64)                        # camada densa: 64 neurônios
    self$saida       <- nn_linear(64, 2)                                 # 2 pontuações: normal, pneumonia
    self$dropout     <- nn_dropout(0.3)                                  # desliga 30% ao acaso no treino
  },
  # forward: o caminho que a imagem percorre, um passo por linha
  forward = function(x) {                   # entrada: 1 imagem 28 x 28
    x <- self$convolucao1(x)                # 16 mapas 28 x 28
    x <- nnf_relu(x)                        # negativos viram zero
    x <- nnf_max_pool2d(x, 2)               # 16 mapas 14 x 14
    x <- self$convolucao2(x)                # 32 mapas 14 x 14
    x <- nnf_relu(x)
    x <- nnf_max_pool2d(x, 2)               # 32 mapas 7 x 7
    x <- torch_flatten(x, start_dim = 2)    # uma fila de 32 x 7 x 7 = 1568 números
    x <- nnf_relu(self$densa(x))            # 64 números
    x <- self$dropout(x)
    self$saida(x)                           # 2 pontuações
  }
)

modelo <- CNN()
modelo
sum(sapply(modelo$parameters, function(p) p$numel()))   # total de parâmetros


# ---- 6. Treinar --------------------------------------------------------------
otimizador <- optim_adam(modelo$parameters, lr = 0.001)

# probabilidade de pneumonia que a rede dá para cada imagem
prob_pneumonia <- function(conjunto) {
  modelo$eval()                                    # modo de uso: desliga o dropout
  p <- with_no_grad(as_array(nnf_softmax(modelo(conjunto$x), dim = 2)))
  modelo$train()
  p[, 2]
}

y_val <- as.integer(dados$val_labels)
historico <- data.frame()

for (epoca in 1:10) {
  perdas <- c()
  coro::loop(for (lote in lotes) {
    otimizador$zero_grad()                               # apaga os cálculos do lote anterior
    previsao <- modelo(lote[[1]])                        # 1. palpite (lote[[1]]: as imagens)
    perda <- nnf_cross_entropy(previsao, lote[[2]])      # 2. erro (lote[[2]]: os diagnósticos)
    perda$backward()                                     # 3. direção de ajuste de cada peso
    otimizador$step()                                    # 4. ajusta os pesos
    perdas <- c(perdas, perda$item())
  })
  p_val <- prob_pneumonia(validacao)
  historico <- rbind(historico, data.frame(
    epoca = epoca, perda = mean(perdas),
    acc_val = mean((p_val > 0.5) == y_val), auc_val = auc(p_val, y_val)))
  cat(sprintf("época %2d | perda %.4f | validação: acurácia %.3f  AUC %.3f\n",
              epoca, mean(perdas), tail(historico$acc_val, 1), tail(historico$auc_val, 1)))
}

par(mfrow = c(1, 2), mar = c(4, 4, 2, 1))
plot(historico$epoca, historico$perda, type = "b", xlab = "época", ylab = "perda", main = "Perda no treino")
plot(historico$epoca, historico$auc_val, type = "b", xlab = "época", ylab = "AUC", main = "AUC na validação")


# ---- 7. Avaliar no teste (imagens que a rede nunca viu) -----------------------
p_teste <- prob_pneumonia(teste)
y_teste <- as.integer(dados$test_labels)
previsto <- as.integer(p_teste > 0.5)

cat(sprintf("TESTE | acurácia %.3f | AUC %.3f\n", mean(previsto == y_teste), auc(p_teste, y_teste)))
table(verdadeiro = factor(y_teste,  0:1, CLASSES),
      previsto   = factor(previsto, 0:1, CLASSES))


# ---- 8. Ver a rede em ação ----------------------------------------------------
par(mfrow = c(2, 4), mar = c(1, 1, 3, 1))
for (i in sample(length(y_teste), 8)) {
  mostrar(dados$test_images[i, , ],
          sprintf("real: %s\nrede: %.0f%% pneumonia", CLASSES[y_teste[i] + 1], 100 * p_teste[i]))
}

torch_save(modelo, "cnn_pneumonia.pt")   # guarda a rede treinada
