# Videoaula — CNN em R (Análise de Dados, 1ª VA)

`videoaula_cnn_r.pptx`: 30 slides, ~29 min. O roteiro de cada slide, com o minuto de
início e fim, está nas **notas do apresentador** (no PowerPoint: Exibir > Anotações).

Para regenerar o deck: `npm install pptxgenjs && node gerar_slides.js`.

## Roteiro

| Tempo | Slides | Bloco |
|-------|--------|-------|
| 0:00–1:00 | 1–2 | Apresentação e roteiro |
| 1:00–5:00 | 3–6 | O problema, o que é uma rede neural, o que é uma CNN, imagem como números |
| 5:00–13:10 | 7–14 | Cada peça: convolução, filtros aprendidos, ReLU, pooling, a jornada pela rede, achatar e camada densa, saída e o desenho da rede completa |
| 13:10–15:55 | 15–17 | Como a rede aprende: entropia cruzada, backpropagation e Adam, treino/validação/teste |
| 15:55–17:10 | 18–19 | Os dados e o "adivinhe" |
| 17:10–21:50 | 20–25 | O pacote torch e o código em R, linha a linha |
| 21:50–25:20 | 26 | **Prática:** rodar `cnn_pneumonia.R` no RStudio, seção por seção |
| 25:20–27:10 | 27–28 | Resultados e lições |
| 27:10–28:40 | 29–30 | Exercícios, resumo e referências |

A duração exigida é de 20 a 30 min. Se passar de 30, encurte a prática; se ficar
abaixo de 20, comente mais cada seção do script.

## Gravar

A câmera precisa aparecer **o tempo todo**. Só na parte prática ela é opcional.

- **PowerPoint (mais simples):** Apresentação de Slides > Gravar. Ligue a câmera
  e o microfone. Na prática, pare, grave a tela do RStudio à parte, e junte os trechos.
- **OBS Studio (um arquivo só):** crie uma cena com duas fontes. Uma é a Captura de
  tela; a outra é a Webcam, num canto. Apresente os slides em tela cheia e troque para o
  RStudio na prática, sem parar a gravação.

Antes de gravar, rode o script uma vez inteiro para o `torch` já estar instalado.
Durante a gravação, rode de novo ao vivo: o treino leva poucos segundos por época.

## Entregar

Suba o vídeo no YouTube como **Não listado**, ou no Google Drive com o compartilhamento
"Qualquer pessoa com o link". Depois cole o link na planilha da turma. Abra o link numa
aba anônima para conferir que ele abre.
