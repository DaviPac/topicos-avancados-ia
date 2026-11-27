# tec · Davi Pires Aquino de Carvalho

> folha do artefato [tecnologia base demonstrável](https://lucassf.pages.dev/ai4good/artefatos/3-tecnologia-base). siga o guia passo a
> passo e preencha cada seção aqui. as decisões são suas, e decidir é saber explicar.
>
> o link do guia não está mais disponível (dá 404, conferido em 23/11/2026).

## 0 · a minha ideia completa

**Vero.** App que lê a tela do usuário, identificando informações falsas, enviesadas ou incompletas e mostra na tela aviso com informações completas, além de coletar dados sobre fake news (o que aparece, para quem aparece, o quanto aparece...). O aviso apareceria como um botão de lupa, que apenas ao clicar seria mostrado aviso.

técnica do § 6b do brw: um modelo de linguagem (transformer) que lê o texto da tela, busca nas checagens publicadas e compara o post com elas. Sem ele, o Vero não reconhece o mesmo boato reescrito com outras palavras, nem diz o que falta num post que nenhuma regra previu.

## 1 · as peças

| peça | central ou apoio | o que faz na ideia | link oficial | licença | por que esta, e não as 2 alternativas |
|:--|:--|:--|:--|:--|:--|
| Gemini, pelo SDK google-genai | central | interpretação de postagens, busca na internet e interpretação do resultado | [googleapis/python-genai](https://github.com/googleapis/python-genai) | SDK: Apache-2.0 · modelo: fechado, [termos da Gemini API](https://ai.google.dev/gemini-api/terms) | LLM local é pesado demais para rodar em celulares, modelos menores alucinam com frequência e modelos maiores demoram dezenas de vezes mais que a api do gemini para gerar uma resposta, além do gasto alto de recursos do dispositivo. Sentence-transformers funcionam para comparar checagens, mas falham na busca pela internet: se não houver uma checagem explícita a notícia não será encontrada. (alternativas: LLM local pelo Ollama, ex. Qwen3-4B; embeddings com sentence-transformers + bge-m3) |
| Tesseract, pelo pytesseract | apoio | verificar texto em quaisquer elementos que não possam ser identificados pelo sistema de acessibilidade do celular, como elementos textuais em imagens de posts | [tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract) · [madmaze/pytesseract](https://github.com/madmaze/pytesseract) | Apache-2.0 · Apache-2.0 | Tesseract pois roda em CPU e o modelo de português (`por.traineddata`) tem 2 MB; o EasyOCR depende do PyTorch, cujo pacote para Linux tem 539 MB, e o PaddleOCR depende do PaddlePaddle, com 195 MB. Rodei o Tesseract no celular, num Samsung S23 com Android 14, pelo app de medição em [`code/ocr-android`](../code/ocr-android/README.md) (Tesseract4Android 4.9.0, Apache-2.0): leu um print de 1080 x 2340 em 1298 ms (registro em [`code/ocr-android/medicoes.md`](../code/ocr-android/medicoes.md)). (alternativas: EasyOCR, PaddleOCR) |

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

**a entrada:** antes, o prompt de exemplo do README ("Why is the sky blue?"); agora, três prints reais de posts que tirei no meu celular, em 13/11 ([prints-cinza/](https://github.com/DaviPac/topicos-avancados-ia/tree/66fcdcbbcfa7f96ce4738cceee45d8885ad18424/code/vero/prints-cinza)), com os nomes de perfil tarjados: um vídeo do X sobre o fim do Bolsa Família, um post do Instagram sobre a questão 52 do ENEM 2026 e um post em inglês sobre a demolição da Torre Eiffel. os prints entram já preparados em tons de cinza (`Image.convert('L')` do Pillow). a conversão para tons de cinza não faz parte da tecnologia: ela é a entrada esperada, preparada antes. o Tesseract tira o texto do print, e o texto vai para o Gemini.

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
- **o OCR embaralha palavras:** na Torre Eiffel, mesmo em tons de cinza, o Tesseract leu "Paris, ali Tower is going to be demolishei”” next year after lease expiry, due fq rising complaints!" (em vez de "Eiffel Tower", "demolished", "due to"). o veredito saiu certo porque o modelo entendeu o sentido, mas é o texto embaralhado que chega ao Gemini. a causa provável é o código chamar o Tesseract com `lang='por'`, o modelo de português, num post em inglês.

## 4 · o vídeo

**link:** [va2/tec-video.mp4 no repositório](https://github.com/DaviPac/topicos-avancados-ia/blob/19eadd6122bd0b81ea2212fc40434bfac9309ea1/va2/tec-video.mp4) (abre sem login; [arquivo direto](https://github.com/DaviPac/topicos-avancados-ia/raw/19eadd6122bd0b81ea2212fc40434bfac9309ea1/va2/tec-video.mp4)) · **duração:** 1 min 34 s · **o que aparece:** gravação da tela da minha máquina, com um terminal: o `git log` com os dois commits (o exemplo oficial, 997c85d, e a alteração mínima, 66fcdcb), o comando `time .venv/bin/python exemplo.py prints-cinza/*.jpg` e a saída dos três prints aparecendo.

o vídeo é uma rodada nova, posterior à do § 3: os três vereditos são os mesmos ("incoerente"), mas as fontes da busca no Bolsa Família mudaram (boatos.org e portelafm.com.br, em vez de estadao.com.br e boatos.org), e o tempo foi de 1m15s. os comandos foram digitados por um script, e o prompt (`davi@vero:`) também é do script; os comandos e a saída são reais.

## 5 · o que deu certo e o que errou, sem IA

Onde acertou: A técnica conseguiu corretamente decidir se os prints são coerentes ou não, retornando a fonte quando aplicável.  
Onde errou: O OCR acaba embaralhando algumas palavras a depender do idioma, mas sem evidência de que afete a checagem  
Quanto tempo e quanta máquina pediu: As checagens duraram em média 25 segundos cada, e o único processamento no dispositivo do usuário é o OCR, que roda em cerca de 1 segundo  
O que isso muda na ideia: Pode ser interessante ver algum modelo LLM mais rápido para agilizar as checagens.

## 6 · auditoria cega

> uma conversa nova, que não ajudou a fazer esta folha, julga cada item de verificação começando
> de "não passa", abre os links e o diff (prompt no passo 6 do guia). você cola o veredito dela
> aqui, sem editar, e responde, sem IA, item por item.

**o veredito da conversa nova** (a tabela item | passa ou não passa | trecho que prova | o que
encontrei, colada como veio):

**rodada 1 (25/11/2026):**

| item | passa ou não passa | trecho que prova | o que encontrei |
|:--|:--|:--|:--|
| 1. técnica com link, licença e justificativa | **passa** (com ressalvas) | "Gemini, pelo SDK google-genai \| central \| … \| [googleapis/python-genai] \| SDK: Apache-2.0 · modelo: fechado, [termos da Gemini API]" e "Tesseract, pelo pytesseract \| apoio \| … \| Apache-2.0 · Apache-2.0 \| … (alternativas: EasyOCR, PaddleOCR)" | Conferi pelo `gh api` (campo `.license.spdx_id`): googleapis/python-genai = Apache-2.0, tesseract-ocr/tesseract = Apache-2.0, madmaze/pytesseract = Apache-2.0, adaptech-cz/Tesseract4Android = Apache-2.0, e a release 4.9.0 existe. Todos os links abrem com HTTP 200, inclusive os termos da Gemini API. O `google-genai==2.33.0` existe no PyPI. Cada peça nomeia 2 alternativas e diz por que perdem. O `por.traineddata` do repositório tem 1,98 MB, então "2 MB" confere. Ressalvas: (a) "modelos maiores demoram dezenas de vezes mais" e "modelos menores alucinam com frequência" não trazem medição nem fonte, ao contrário do Tesseract; (b) os 1298 ms no S23 não ficaram registrados em lugar nenhum do repositório (não há log, print nem anotação em `code/ocr-android/README.md`): vale só pela palavra da folha; (c) não conferi os 539 MB do PyTorch nem os 195 MB do PaddlePaddle; (d) o link do guia no cabeçalho (`lucassf.pages.dev/ai4good/artefatos/3-tecnologia-base`) dá 404. |
| 2. vídeo rodando a partir do código-fonte | **passa** | "gravação da tela da minha máquina, com um terminal: o `git log` com os dois commits (… 997c85d, e a alteração mínima, 66fcdcb), o comando `time .venv/bin/python exemplo.py prints-cinza/*.jpg` e a saída dos três prints aparecendo" | Não assisti ao vídeo. Extraí 16 quadros do `va2/tec-video.mp4` com ffmpeg, um a cada 6 s. O arquivo tem 94,1 s (= 1 min 34 s, confere) e o link raw/blob do commit 19eadd6 abre sem login (HTTP 200, 937.885 bytes, mesmo tamanho do arquivo local). Os quadros mostram um terminal local em `/home/davipac/.../code/vero`, o `git log --oneline -6` com 997c85d e 66fcdcb, o `set -a && . ../../segredos.env`, o comando e a saída: bolsa-familia com fontes boatos.org e portelafm.com.br, os 3 com "incoerente" e `real 1m15.613s`. Bate com o § 4. O HEAD do vídeo é 828f902, que só altera `va2/tec.md` em relação a 66fcdcb (conferi com `git diff`), então o código que roda é o da alteração mínima. Não é Space nem Colab. Limites: o vídeo não mostra o código (`cat`/diff) e, como a folha admite, os comandos foram digitados por script e o prompt `davi@vero` é forjado. Não dá para provar pelo vídeo que a máquina é do aluno, só pelo caminho `/home/davipac`. |
| 3. alteração mínima de entrada e saída + onde erra + auditoria cega | **não passa** | "**o veredito da conversa nova** … [cole]" e "1. [preencha] 2. [preencha] 3. [preencha]" | O item exige a auditoria cega do § 6 com o veredito colado e a resposta sem IA, item por item. Na folha auditada o § 6 está vazio (placeholders), e só isso já reprova. O resto: abri o diff de 66fcdcb (`gh api …/commits/66fcdcb…`). É um commit só, e o exemplo continua reconhecível (`genai.Client()`, `generate_content`, o mesmo `model='gemini-4-hydrogen'`, `print(response.text)`). A entrada passa a ser 3 prints reais (`sys.argv` + `pytesseract.image_to_string(..., lang='por')`) e a saída passa a ser o veredito com as fontes de `grounding_metadata`. Nada disso é só troca de texto impresso. Mas o commit não muda só a entrada e a saída: (a) liga uma ferramenta nova, `tools=[types.Tool(google_search=...)]`, que muda o comportamento da técnica e não só o I/O; (b) acrescenta Tesseract e Pillow. Além disso, a conversão `Image.convert('L')` que a folha descreve não está em nenhum arquivo do repositório (procurei por `convert('L')`): os prints já entram cinza (modo L, conferido), por um passo que não se reproduz a partir do código. "Como a tecnologia espera" também não tem base, porque o Tesseract aceita imagem colorida. O "onde a saída erra" existe (o OCR embaralha a Torre Eiffel), mas é raso: (1) o próprio código chama `lang='por'` num post em inglês, causa provável do embaralhamento, que a folha não aponta; (2) os 3 vereditos são iguais ("incoerente") e não há nenhum caso verdadeiro na entrada, então a saída não se distingue de um classificador constante; (3) ENEM e Torre Eiffel saíram sem nenhuma fonte, embora o prompt mande buscar na internet, ou seja, o veredito veio sem evidência, e a folha não trata isso como erro; (4) o print da Torre Eiffel já traz a desmentida na legenda ("Several viral posts claimed that the Eiffel Tower … will be demolished … — but"), então "o modelo entendeu o sentido" vale pouco como prova; (5) as fontes mudam entre rodadas (§ 4) e a folha não trata isso como problema. Os dois links de checagem do Bolsa Família (Estadão Verifica e Boatos.org) abrem com HTTP 200. Não conferi se os redirects `vertexaisearch` levam mesmo a eles, nem se o veredito do ENEM está certo. Não rodei o código (regra do pedido). |

**armadilhas do tec-raso em que a folha cai:**

- **§ 6, auditoria cega (anotação 6):** o veredito não está colado e a resposta, item por item, sem IA, está só com "[preencha]". Por ora, a folha não tem auditoria nem resposta.
- **§ 3 e § 5, "funcionou" (anotação 5), em versão parcial:** a folha aponta um erro (o OCR), mas logo o neutraliza ("o veredito saiu certo", "sem evidência de que afete a checagem") e conclui que "a técnica conseguiu corretamente decidir". Com 3 entradas, todas com o mesmo rótulo "incoerente", nenhum caso verdadeiro e 2 vereditos sem nenhuma fonte, o acerto não está demonstrado. O § 5 também não diz que `lang='por'` foi usado num post em inglês.
- **§ 3, a entrada "para garantir que funciona" (anotação 3), em versão atenuada:** a entrada é um dado real do problema (não cai na armadilha principal), mas o print da Torre Eiffel já contém a desmentida na legenda, o que facilita o acerto e não testa a técnica de verdade.
- **§ 1, justificativa sem comparação medida (anotação 1), só em parte:** os links e as licenças estão corretos e as alternativas têm nome. Mas o porquê do Gemini contra o LLM local ("dezenas de vezes mais", "alucinam com frequência") é afirmação sem medição, e o número do Tesseract no celular (1298 ms) não tem registro no repositório.
- **Não cai:** Space/Colab/app pronto (anotação 2), link de commit que não leva a lugar nenhum (anotação 4), `print` que só troca o texto (anotação 4), licença sem nome ou link que não é o repositório (anotação 1).

**a minha resposta, sem IA** (uma linha por item: o que mudei por causa da auditoria, e onde; ou
por que discordo):

1. [preencha]
2. [preencha]
3. [preencha]
