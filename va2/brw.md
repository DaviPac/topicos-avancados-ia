# brw · [preencha: seu nome]

> folha do artefato [brainwriting híbrido](../3-brainwriting-hibrido.md). siga o guia passo a passo
> e preencha cada seção aqui. as decisões são suas, e decidir é saber explicar.

## 1 · onde atacar

**crise** (marque 1 com `x`):

| | crise |
|:-:|:--|
| [ ] | perda do raciocínio crítico e alienação (*slop*) |
| [x] | a verdade sob mira e colapso epistêmico (*fakes*) |
| [ ] | manipulação política e democracia (*bots*) |
| [ ] | crise ecológica da IA (água e energia) |
| [ ] | alimentação com veneno e ultraprocessados (vs. feiras agroecológicas) |
| [ ] | endividamento e dreno das *bets* |
| [ ] | moradia e especulação (casas vazias) |
| [ ] | concentração de plataformas e trabalho |
| [ ] | outra: [preencha: a crise, e em 1 linha por que é relevante] |

por que esta crise: É um problema grande, especialmente em período de eleição fica evidente a quantidade de fake news ou informações tendenciosas na internet

**tecnologias de IA** (marque 3 e chame de A, B, C):

| | tecnologia de IA |
|:-:|:--|
| [x] | modelos locais / no aparelho (*SLMs*, 1B–7B) |
| [x] | sistemas multiagente e agência (*tools*, MCP) |
| [x] | visão computacional e OCR |
| [ ] | voz (fala ↔ texto) e interfaces sem tela |
| [ ] | grafos e RAG (redes de grafos, busca vetorial) |
| [ ] | modelos de difusão / geração visual |
| [ ] | outra: [preencha] |

**infraestruturas tradicionais** (marque 3 e chame de 1, 2, 3):

| | infraestrutura |
|:-:|:--|
| [ ] | plataformas de dois lados (*matching*, como Uber) |
| [ ] | geolocalização, GPS e mapas |
| [x] | e-commerce, marketplaces e catálogos |
| [ ] | mensageria leve e bots (WhatsApp, SMS) |
| [x] | redes sociais, feeds e comunidades |
| [ ] | pagamento instantâneo (Pix, moeda local) |
| [x] | crowdsourcing e curadoria coletiva |
| [ ] | outra: [preencha] |

## 2 · clichês

| Clichê | O que acerta | Onde fica raso |
|---|---|---|
| **1. Detector de deepfake/fake news com IA** | Dá conta do volume: humanos não conseguem checar tudo. | É uma corrida que o detector perde para o gerador, e um rótulo de "falso" não convence quem já acredita. |
| **2. Bot/app de checagem de fatos** (WhatsApp, extensão de navegador) | Responde rápido, no lugar onde a pessoa já está. | Só alcança quem já duvida e decidiu perguntar. A desinformação circula com quem não pergunta. |
| **3. Marca d'água / selo de procedência** (C2PA, assinatura de conteúdo) | Ataca a origem e prova o que é autêntico, em vez de caçar o falso. | Depende de adesão em massa, a marca some com print ou recompressão, e a falta de selo não prova que algo é falso. |
| **4. Educação midiática / letramento digital** | Mexe na causa humana e o efeito dura mais. | É lento, difícil de medir e põe o peso no indivíduo, sem tocar no incentivo econômico das plataformas. |
| **5. Moderação automática / remoção pelas plataformas** | Age na escala e no ponto de distribuição. | Esbarra em censura e em quem decide o que é verdade, e não muda o algoritmo que lucra com engajamento. |

## 3 · matriz 3 × 3 e a minha ideia

cada célula: **nome** · frase de até 20 palavras (quem usa, o que faz).

| | 1 · e-commerce, marketplaces e catálogos | 2 · redes sociais, feeds e comunidades | 3 · crowdsourcing e curadoria coletiva |
|:--|:--|:--|:--|
| **A · SLMs no aparelho** | **Anúncio Seco** · No celular do consumidor, o SLM reescreve o anúncio sem promessas nem adjetivos e mostra só o que o produto afirma. | **Diário de Crenças** · Para o usuário: o SLM local guarda o que ele compartilhou e, meses depois, mostra o que se confirmou e o que não. | **Testemunha Protegida** · Para quem viu algo acontecer: o SLM local tira rostos, nomes e lugar do relato antes de mandá-lo à curadoria coletiva. |
| **B · multiagente e *tools*** | **Mercado da Mentira** · Para jornalistas: agentes varrem marketplaces e mapeiam quem lucra vendendo curas, kits e cursos ligados a boatos virais. | **Genealogia do Boato** · Para checadores: agentes reconstroem a primeira postagem, as versões do boato e as contas que o espalharam, sem dar veredito. | **Morador Verifica** · Para comunidades: agentes acham voluntários perto do local do boato, pedem que confirmem pessoalmente e juntam as respostas. |
| **C · visão e OCR** | **Selo Forjado** · Para consumidores: a visão computacional encontra selos falsos de Anvisa, Inmetro ou "aprovado por médicos" nas fotos dos anúncios. *Sutileza em relação ao clichê 1: mira a autoridade forjada, não o conteúdo.* | **(minha ideia) Vero** · App que lê a tela do usuário, identificando informações falsas, enviesadas ou incompletas e mostra na tela aviso com informações completas, além de coletar dados sobre fake news (o que aparece, para quem aparece, o quanto aparece...). | **Arquivo do Apagado** · Voluntários enviam prints de posts apagados ou editados; o OCR extrai texto, autor e data e guarda como prova contra a negação. |

**as 9 no mapa impacto × viabilidade:**

| | viabilidade alta | viabilidade baixa |
|:--|:--|:--|
| **impacto alto** | (Minha ideia) Vero | Diário de Crenças · Morador Verifica |
| **impacto baixo** | Anúncio Seco · Testemunha Protegida · Selo Forjado · Arquivo do Apagado | Genealogia do Boato |

onde discordei da IA, e por quê: Vero teria viabilidade baixa por conflito com LGPD na coleta de dados e viabilidade da leitura de tela. Mas a coleta de dados seriam dados anonimos, mapeando por exemplo gênero e categorias assistidas, sem coletar dados pessoais. E a leitura de tela é viável, o Android fornece APIs nativas para isso.

**minha ideia escolhida:** Vero

**por que ela, sem IA, em até 3 linhas:** Ajudaria pessoas a saber a veracidade das informações sem ter que se preocupar com pesquisar, além de fornecer uma estatística sobre as fake news encontradas. Poderia englobar também conteúdo de ódio e chat para debater o conteúdo.

## 4 · motores

| motor | nome | frase | o que mudou em relação à ideia |
|:--|:--|:--|:--|
| motor | o que foi [verbo], em 1 linha | nome | frase | o que mudou em relação à ideia | o que quem usa ganha para si | se sustenta nas duas perguntas? |
|:--|:--|:--|:--|:--|:--|:--|
| inverter | o fluxo do aviso: antes o Vero interrompia sem ser chamado; agora só responde quando o usuário pergunta. | **Vero sob demanda** | o usuário toca num post que lhe deu dúvida; o Vero lê a tela e diz de onde veio, desde quando circula e o que falta. | some o aviso não pedido e some o veredito. Parece o bot de checagem no WhatsApp; a sutileza é que lê o post onde ele está e responde origem e lacuna, não "falso". | tira a dúvida sem copiar, colar nem sair do app. | **não**: quem pergunta já duvida, e quem acredita nunca toca; a falha original continua. Uma busca com a palavra "checagem" resolve o caso de quem já duvida. |
| canalizar | a vontade de ganhar a discussão no grupo da família, que as pessoas já têm. | **Tréplica** | ao ver no grupo um post de que discorda, o usuário pede ao Vero uma resposta curta com fonte, pronta para colar na conversa. | o rótulo cai no post do outro, não no de quem usa. A correção circula pelas mãos de quem quer vencer. Cada lado usa contra o outro, e por isso os dados cobrem os dois lados. | ganha a discussão com fonte na mão, em segundos. | sim: o ganho vem na hora e o custo é um toque. O link da checadora só existe para boato já checado e não chega pronto para a conversa. |
| transplantar | o rótulo frontal da embalagem (a lupa "alto em açúcar"), que mostra a composição sem proibir. | **Lupa do post** | ao lado do post, um rótulo fixo de fatos: "sem fonte", "vídeo de 2019", "mesmo texto em 300 grupos". | troca o verdadeiro ou falso por fatos que não dizem que a crença está errada. Parece o "encaminhado com frequência" do WhatsApp; a sutileza é dar a data de origem e a fonte, não só dizer que circula. | sabe em segundos o que tem dentro do post, como na embalagem. | **não**: resolve a rejeição, mas não o custo. O usuário ainda entrega a tela inteira em troca de uma curiosidade, e a busca reversa já dá a data de uma imagem. |
| reescalar | 100× menor: da tela inteira, o tempo todo, para um único momento, o de encaminhar. | **Antes de repassar** | quando o usuário compartilha um post com o Vero antes de mandar a um grupo, ele mostra em uma linha o que falta, e o usuário decide. | lê só o que o usuário escolheu repassar, e o custo de privacidade quase some. Parece o "leia antes de retuitar"; a sutileza é dizer o que falta naquele post, não dar um lembrete genérico. | não passa vergonha quando alguém desmentir no grupo. | sim: o aviso é privado e chega antes da exposição. O "encaminhado com frequência" avisa que circula muito, não o que falta. |
| trocar a persona | saiu o leitor que acredita, entrou o administrador do grupo do condomínio ou da escola. | **Vero do admin** | o administrador recebe no privado os posts do grupo que já circulam como boato, com a fonte, e decide se comenta. | quem recebe o aviso não é quem acredita, e sim quem responde pelo grupo quando a briga começa. | o grupo não vira briga nem caso de polícia sob a responsabilidade dele. | sim: ele ganha paz no grupo com um aviso que não contesta a crença dele. Hoje confere tudo à mão, ou não confere. |
| trocar o contexto | do feed do dia a dia para um desastre, como uma enchente, quando o boato custa caro na hora. | **Vero na enchente** | durante o desastre, o Vero cruza o que chega sobre abrigos, estradas e doações com os avisos da Defesa Civil e mostra o que está confirmado. | no desastre a crença é prática, não identidade, e a rejeição ao rótulo cai. | não vai a abrigo lotado nem doa para um Pix falso. | sim: o ganho é imediato. O alerta da Defesa Civil por SMS dá a informação oficial, mas não responde ao boato que chegou no grupo. |
| trocar a tecnologia | de SLM e visão para uma rede neural de grafos, fora da matriz. | **Vero de rede** | sobre os dados doados, uma rede neural de grafos acha grupos que disparam o mesmo conteúdo em sincronia e avisa quando o post veio de disparo coordenado. | o aviso não julga o conteúdo, diz que há uma campanha por trás. É mais difícil de rejeitar, porque ninguém gosta de ser alvo. | sabe se está sendo alvo de uma campanha. | **não**: só funciona com milhares de doadores, e cada um entrega a tela antes de o aviso existir; o custo vem antes do ganho. |
| juntar | Vero + Mercado da Mentira. | **Vero quem lucra** | quando aparece um post de cura ou de oportunidade milagrosa, o Vero mostra quem vende produto ligado a ele e onde. | troca "isto é falso" por "alguém ganha dinheiro com você acreditar". Ataca o vendedor, não a crença. | não paga por uma cura ou um curso que não funciona. | sim: o ganho é dinheiro no bolso. O Reclame Aqui mostra queixas contra o vendedor, mas não o liga ao boato que o usuário acabou de ler. |
| restringir | "e se o custo de nuvem fosse R$ 0?": tudo roda no aparelho, e nada sai sem o usuário ver. | **Vero no bolso** | o julgamento roda no celular; só sai uma contagem semanal por tema, que o usuário lê e aprova antes de enviar. | o custo de privacidade cai, e o usuário confere o que vai para os dados públicos. Isso também resolve o problema das mensagens de terceiros. | tem o retrato do próprio feed sem entregar a tela a ninguém. | **não**: ataca o custo, mas o retrato ainda rotula as crenças dele, e a rejeição continua. |

## 5 · o que fica e o que sai

**o que eu gostei:** Responder apenas quando chamado, sem interromper o uso

**o que achei interessante:** "e se o custo de nuvem fosse R$ 0?": tudo roda no aparelho, e nada sai sem o usuário ver.

**o que eu descarto, e por quê:** 	"100× menor: da tela inteira, o tempo todo, para um único momento, o de encaminhar." Deixa o app fraco, ninguém usaria um app apenas para isso.

**minha ideia completa:**  Vero: App que lê a tela do usuário, identificando informações falsas, enviesadas ou incompletas e mostra na tela aviso com informações completas, além de coletar dados sobre fake news (o que aparece, para quem aparece, o quanto aparece...). O aviso apareceria como um botão de lupa, que apenas ao clicar seria mostrado aviso.

## 6 · refinamento

**a · e se todo mundo usasse?** Resumo (até 120 palavras):

83% dos brasileiros já viram notícia falsa nas redes, 58% deles perderam a confiança nelas, e golpes custam quase R$ 29 bilhões por ano a 24 milhões de vítimas. Minha aposta para 5 anos de Vero: a desconfiança cai de 58% para 20%, quem acha que o falso tem mais alcance cai de 82% para 20%, e o prejuízo com golpes cai para R$ 20 bilhões. Cada pessoa usa para não repassar boato nem decidir errado; custa bateria e processamento. Pontos fracos: duas apostas medem percepção, não circulação; nenhuma diz quantos clicam na lupa; gênero e categoria de conteúdo são dados pessoais pela LGPD; "repensar" não se mede; e falta o ganho de quem usa os dados públicos.

Fontes: Anuário Brasileiro de Segurança Pública, via Jovem Pan · FBSP/Datafolha, via Estado de Minas · Febraban, via Poder360 · DataSenado · Agência Senado

**b · a IA que não pode faltar.** Técnica: um modelo de linguagem (transformer) que lê o texto da tela, busca nas checagens publicadas e compara o post com elas. Sem ele, o Vero não reconhece o mesmo boato reescrito com outras palavras, nem diz o que falta num post que nenhuma regra previu. Uma solução sem IA usaria uma lista de sites classificados e a busca por palavras-chave nas checagens: pegaria só o boato copiado letra por letra e de fonte conhecida, e não montaria a informação completa. Contagens ficam com regras. Se no teste a busca por palavras achar tanto quanto o modelo, retiro a IA. · aula da disciplina: [preencha: título da aula]

por que sem ela não roda: Não teria eficácia em julgar conteúdo

**c · o cético e as saídas**

| crítica | saída 1 | saída 2 | minha decisão |
|:--|:--|:--|:--|
| viabilidade · o app não consegue ver o post. No iPhone, um app não lê a tela de outro. no Android, isso só é possível pelo serviço de acessibilidade, que a Play Store restringe porque é o mesmo caminho usado nos golpes de banco. | mudar de plataforma: virar extensão de navegador no computador | apoiar-se num ator que já existe: em vez de ler a tela, virar um contato no WhatsApp para onde a pessoa encaminha o post, como o robô Fátima, do Aos Fatos, já faz. O acréscimo seria a comparação trecho a trecho com a checagem. Perde-se a lupa que aparece sozinha: a pessoa precisa lembrar de encaminhar. | Deixar apenas para android. |
| adoção · quem repassa boato não instala um app para desconfiar do que já acredita. | trocar a persona: quem usa passa a ser o filho ou neto que recebe o boato no grupo da família e quer responder sem brigar. Ele cola o post, e o app devolve uma resposta curta com o trecho que não bate e o link da checagem. | atacar um público menor e diminuir o escopo: só golpes (Pix, falso sorteio, falso emprego, falso parente), oferecidos por um banco ou cooperativa aos clientes mais visados. | Manter como está. A ideia atualmente atinge também quem não quer cair em fake news, e ao mesmo tempo não quer ter o trabalho de pesquisar |
| dano possível · a lupa vira selo, e a falta dela também. o modelo compara um post novo com a checagem “mais parecida” e erra nos dois sentidos. Marca como falso um post verdadeiro que só lembra um boato antigo, e não acha nada no boato recém-reescrito, que ainda não foi checado. | começar por uma fase pequena, apoiada num ator que já existe: uma só categoria (por exemplo, saúde ou eleição), com uma agência de checagem ou coalizão como o Comprova revisando cada lupa antes de ir ao ar. | diminuir o escopo: a lupa só aparece quando o post repete uma afirmação já checada, com o mesmo número, nome ou data. | Ter selos para confirmado, incoerente e não tem certeza |

## 7 · resumo, sem IA

A crise é fake news e meias verdades, a ideia é um aplicativo que monitora a tela do dispositivo e, ao notar algum conteúdo que possa ser enviesado ou falso, mostra indicador visual com opção de ver informações completas, usaria OCR para identificar texto e modelos de linguagem para entender e fazer a busca. Teria também opção de dialogar com IA sobre esse conteúdo, e pode também coletar dados para mapear que tipo de conteúdo aparece e para quem, possibilitando analise estatística de fake news. Se todo mundo utilizasse, conteúdos falsos seriam mais denunciados e teriam menos engajamento, e cada pessoa usaria para ter a confiança no conteúdo que está vendo sem ter o trabalho de pesquisar.
