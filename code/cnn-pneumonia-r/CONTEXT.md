# cnn-pneumonia-r/

CNN simples em **R com `torch`**, para a disciplina de Análise de Dados (vídeo sobre um
modelo de ML implementado em R). Usa o mesmo dataset da prática de IA, o PneumoniaMNIST,
que está em `../cnn-pneumonia-medmnist/dados/pneumoniamnist.npz`.

- `cnn_pneumonia.R` — o script inteiro, em seções numeradas para rodar uma a uma no
  RStudio: pacotes, leitura dos dados, preparação, a CNN, treino, avaliação e exemplos.
- `slides/` — a videoaula (1ª VA, 28/09): `videoaula_cnn_r.pptx` com o roteiro
  cronometrado nas notas do apresentador, e `LEIAME.md` com como gravar e entregar.
  O deck é gerado por `gerar_slides.js` (tema em `tema.js`, conteúdo em `parte1-4.js`; o desenho da rede
  inteira em `rede_completa.js`).
  As figuras em `slides/img/` saíram das próprias funções do script em R.
  A matriz de confusão nos slides é a da execução real do script em R (158/76/6/384).

## O que foi verificado e como

O `torch` do R não pôde ser instalado no ambiente onde o script foi escrito (CRAN
bloqueado), então a verificação foi feita em partes:

- **Leitura do `.npz` em R puro:** rodada em R 4.3 sobre o arquivo real; os pixels
  batem exatamente com os do NumPy, na orientação certa.
- **Função de AUC em R puro:** aplicada às probabilidades salvas da rede enxuta da
  prática de IA, reproduz exatamente a AUC oficial (0,96377).
- **A CNN:** a mesma arquitetura, com a mesma receita, rodada em PyTorch (o motor por
  baixo do `torch` do R): 105.346 parâmetros, 10 épocas em ~8 s de CPU, teste com
  acurácia 0,869 e AUC 0,933. Em R os números vão variar um pouco, porque o sorteio
  dos pesos iniciais é outro.
- A sintaxe do script inteiro foi conferida com `parse()`.

## Convenções

- Só `torch` além do R base: nada de ggplot, caret ou pROC, para a instalação ser
  simples e cada passo ficar visível.
- No `torch` do R as classes começam em 1, não em 0: normal = 1, pneumonia = 2.
