# Videoaula — CNN em R (Análise de Dados, 1ª VA)

`videoaula_cnn_r.pptx`: 20 slides, ~29 min. O roteiro de cada slide, com o minuto de
início e fim, está nas **notas do apresentador** (no PowerPoint: Exibir > Anotações).

Para regenerar o deck: `npm install pptxgenjs && node gerar_slides.js`.

## Roteiro

| Tempo | Slides | Bloco |
|-------|--------|-------|
| 0:00–1:30 | 1–2 | Apresentação (nome, disciplina) e roteiro |
| 1:30–10:00 | 3–8 | Teoria: imagem como números, convolução, ReLU, pooling, softmax |
| 10:00–14:45 | 9–12 | Treino, divisão dos dados, a base PneumoniaMNIST, "adivinhe" |
| 14:45–18:00 | 13–15 | torch no R e o código da rede e do treino |
| 18:00–25:00 | 16 | **Prática:** rodar `cnn_pneumonia.R` no RStudio, seção por seção |
| 25:00–27:15 | 17–18 | Resultados e lições |
| 27:15–29:00 | 19–20 | Exercícios, resumo e referências |

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
