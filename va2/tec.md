# tec · Davi Pires Aquino de Carvalho

> folha do artefato [tecnologia base demonstrável](https://lucassf.pages.dev/ai4good/artefatos/3-tecnologia-base). siga o guia passo a
> passo e preencha cada seção aqui. as decisões são suas, e decidir é saber explicar.

## 0 · a minha ideia completa

**Vero.** App que lê a tela do usuário, identificando informações falsas, enviesadas ou incompletas e mostra na tela aviso com informações completas, além de coletar dados sobre fake news (o que aparece, para quem aparece, o quanto aparece...). O aviso apareceria como um botão de lupa, que apenas ao clicar seria mostrado aviso.

técnica do § 6b do brw: um modelo de linguagem (transformer) que lê o texto da tela, busca nas checagens publicadas e compara o post com elas. Sem ele, o Vero não reconhece o mesmo boato reescrito com outras palavras, nem diz o que falta num post que nenhuma regra previu.

## 1 · as peças

| peça | central ou apoio | o que faz na ideia | link oficial | licença | por que esta, e não as 2 alternativas |
|:--|:--|:--|:--|:--|:--|
| Gemini, pelo SDK google-genai | central | interpretação de postagens, busca na internet e interpretação do resultado | [googleapis/python-genai](https://github.com/googleapis/python-genai) | SDK: Apache-2.0 · modelo: fechado, [termos da Gemini API](https://ai.google.dev/gemini-api/terms) | LLM local é pesado demais para rodar em celulares, modelos menores alucinam com frequência e modelos maiores demoram dezenas de vezes mais que a api do gemini para gerar uma resposta, além do gasto alto de recursos do dispositivo. Sentence-transformers funcionam para comparar checagens, mas falham na busca pela internet: se não houver uma checagem explícita a notícia não será encontrada. (alternativas: LLM local pelo Ollama, ex. Qwen3-4B; embeddings com sentence-transformers + bge-m3) |
| Tesseract, pelo pytesseract | apoio | verificar texto em quaisquer elementos que não possam ser identificados pelo sistema de acessibilidade do celular, como elementos textuais em imagens de posts | [tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract) · [madmaze/pytesseract](https://github.com/madmaze/pytesseract) | Apache-2.0 · Apache-2.0 | Tesseract pois roda em CPU e o modelo de português (`por.traineddata`) tem 2 MB; o EasyOCR depende do PyTorch, cujo pacote para Linux tem 539 MB, e o PaddleOCR depende do PaddlePaddle, com 195 MB. Rodei o Tesseract no celular, num Samsung S23 com Android 14, pelo app de medição em [`code/ocr-android`](../code/ocr-android/README.md) (Tesseract4Android 4.9.0, Apache-2.0): leu um print de 1080 x 2340 em 1298 ms. (alternativas: EasyOCR, PaddleOCR) |

## 2 · o exemplo oficial, rodando

**de onde veio o código:** [preencha]

**o que eu mudei nele:** [preencha: só as escolhas que o README oferece]

**o commit:** [preencha]

**o comando e a saída, colados como vieram:**

```text
[cole]
```

## 3 · a alteração mínima

**o commit:** [preencha]

**a entrada:** [preencha: antes / agora]

**a saída:** [preencha: antes / agora]

**o comando e a saída, colados como vieram:**

```text
[cole]
```

**onde a saída erra:**
- [preencha]

## 4 · o vídeo

**link:** [preencha] · **duração:** [preencha] · **o que aparece:** [preencha]

## 5 · o que deu certo e o que errou, sem IA

[preencha: até 4 linhas, sem IA]

## 6 · auditoria cega

> uma conversa nova, que não ajudou a fazer esta folha, julga cada item de verificação começando
> de "não passa", abre os links e o diff (prompt no passo 6 do guia). você cola o veredito dela
> aqui, sem editar, e responde, sem IA, item por item.

**o veredito da conversa nova** (a tabela item | passa ou não passa | trecho que prova | o que
encontrei, colada como veio):

[cole]

**a minha resposta, sem IA** (uma linha por item: o que mudei por causa da auditoria, e onde; ou
por que discordo):

1. [preencha]
2. [preencha]
3. [preencha]
