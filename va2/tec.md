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

**de onde veio o código:** o trecho "Generate Content" do [README do google-genai](https://github.com/googleapis/python-genai#generate-content), com o modelo (`gemini-4-hydrogen`) e o prompt de exemplo do próprio README ("Why is the sky blue?"). SDK google-genai 2.33.0.

**o que eu mudei nele:** só uma escolha que o README oferece: o cliente lê a chave da variável de ambiente `GEMINI_API_KEY` (`genai.Client()`), em vez de escrever a chave no código. a chave fica no `segredos.env`, fora do git.

**o commit:** [997c85d · exemplo oficial do google-genai (Generate Content), rodando](https://github.com/DaviPac/topicos-avancados-ia/commit/997c85d926ea7caa5e37ec252063b462ab0b42bf)

**o comando e a saída, colados como vieram:**

```text
$ time .venv/bin/python exemplo.py
The sky appears blue because of a phenomenon called **Rayleigh scattering**. Here is how it works:

### 1. Sunlight contains all colors
Although light from the Sun looks white, it is actually made up of all the colors of the rainbow. Each color travels in a wave with a different length:
* **Red and orange** light have long, lazy wavelengths.
* **Blue and violet** light have short, choppy wavelengths.

### 2. Light hits Earth's atmosphere
When sunlight enters Earth’s atmosphere, it collides with billions of tiny gas molecules (mostly nitrogen and oxygen). 
* Because **red, yellow, and green** wavelengths are longer, they mostly pass right through the gas molecules without hitting them.
* Because **blue** wavelengths are much shorter, they are roughly the right size to collide with the gas molecules and get scattered in every direction. 

When you look up at the sky, you are seeing all that scattered blue light bouncing down toward your eyes from every direction.

### Why isn't the sky violet?
Even though violet light has an even shorter wavelength than blue and scatters more, we see the sky as blue for two reasons:
1. **The Sun produces more blue light** than violet light.
2. **Human eyes are much more sensitive to blue** light than they are to violet light.

*(Bonus: This is also why **sunsets are red and orange**. When the sun is low on the horizon, its light has to travel through much more of the atmosphere to reach you. By the time it gets to your eyes, almost all of the blue light has been scattered away in other directions, leaving only the longer red and orange wavelengths to pass through.)*

real	0m5.170s
user	0m0.489s
sys	0m0.026s
```

## 3 · a alteração mínima

**o commit:** [66fcdcb · entrada é o print de um post e saída é o veredito da lupa com as fontes da busca](https://github.com/DaviPac/topicos-avancados-ia/commit/66fcdcbbcfa7f96ce4738cceee45d8885ad18424)

**a entrada:** antes, o prompt de exemplo do README ("Why is the sky blue?"); agora, três prints reais de posts que tirei no meu celular, em 13/11 ([prints-cinza/](https://github.com/DaviPac/topicos-avancados-ia/tree/66fcdcbbcfa7f96ce4738cceee45d8885ad18424/code/vero/prints-cinza)), com os nomes de perfil tarjados: um vídeo do X sobre o fim do Bolsa Família, um post do Instagram sobre a questão 52 do ENEM 2026 e um post em inglês sobre a demolição da Torre Eiffel. os prints entram já preparados em tons de cinza (`Image.convert('L')` do Pillow), como a tecnologia espera. o Tesseract tira o texto do print, e o texto vai para o Gemini.

**a saída:** antes, a explicação em inglês sobre o céu azul; agora, para cada print, o veredito da lupa nos rótulos do brw (confirmado, incoerente ou não tem certeza) e, quando o Gemini busca na internet, as fontes da busca (domínio e link), tiradas dos metadados da resposta e não do texto do modelo.

**o comando e a saída, colados como vieram:**

```text
$ time .venv/bin/python exemplo.py prints-cinza/*.jpg
prints-cinza/bolsa-familia.jpg
veredito: incoerente
fonte: estadao.com.br | https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH8-ZJEXRpcmRtwbh2AjMBV0GDHo7yk9OLjjRcNOjhrxa8d-J4hg5yEKjRe6gqRpkbQLIi64QaCpo4CpfAFvvLWt8jkAPVOMS3mlTECmmUTu7vm9vIzztzeVGzkOrYfXEvHdK2N9ikYdhthoRj8yTRfODRZ1GfrBh8RE-M5P1w8CbVPRU-i_JxZ0NS_DKV4dYLkC0sDyL46DGy1gwNGALWiv_h9TjfdfdnfDrQPlKZNs4gkydam0u8W
fonte: boatos.org | https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFDL7ePqF6wrPKzQoTQFbYwOer4vyol5lURBTSwKq0rpC3UHGMvsYRwMqm4uVEtFPxrNXhqkPZ_aviq-e14mDLO9uhbOxECdZcN4_9oMa4iQpiwm0olyU2WavvGxpbWv3_JzIqmPs9yaGRwfOj9YIDbanHyJK-oA-hPkYwZcUzNI_jEYgQSzFfxVoogjsF8iaZQRPC2ulB4
prints-cinza/enem-cristianismo.jpg
veredito: incoerente
prints-cinza/torre-eiffel.jpg
veredito: incoerente

real	1m28.727s
user	0m6.680s
sys	0m0.174s
```

as duas fontes do Bolsa Família redirecionam para checagens reais: [Estadão Verifica](https://www.estadao.com.br/estadao-verifica/postagem-usa-noticia-de-2025-para-sugerir-que-lula-pretende-acabar-com-bolsa-familia/) e [Boatos.org](https://www.boatos.org/politica/lula-vai-acabar-com-o-bolsa-familia-apos-as-eleicoes-de-2026.html).

**onde a saída erra:**
- **o OCR embaralha palavras:** na Torre Eiffel, mesmo em tons de cinza, o Tesseract leu "Paris, ali Tower is going to be demolishei”” next year after lease expiry, due fq rising complaints!" (em vez de "Eiffel Tower", "demolished", "due to"). o veredito saiu certo porque o modelo entendeu o sentido, mas é o texto embaralhado que chega ao Gemini.

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
