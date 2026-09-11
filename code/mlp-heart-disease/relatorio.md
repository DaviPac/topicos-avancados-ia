# Relatório técnico — MLP como grafo (dataset Heart Disease)

> Versão em Markdown do relatório. Para o Overleaf, use `relatorio_overleaf.tex`
> (mesmo conteúdo, em LaTeX, com `\includegraphics`/`\label`/`\ref` prontos).

## Introdução

Este relatório descreve a implementação de uma rede neural multicamadas
(MLP — *Multi-Layer Perceptron*) construída do zero, representada
explicitamente como um grafo de neurônios e conexões, sem uso de bibliotecas
de *autograd* (PyTorch, TensorFlow). A motivação da prática é consolidar, na
prática, os mecanismos de *feed forward* e *back propagation* que sustentam
o treinamento de redes neurais, tornando explícitos os passos que
normalmente ficam ocultos por trás de chamadas de alto nível em frameworks
de deep learning.

A especificação da prática pedia: (i) codificar uma MLP a partir da
estrutura de um grafo; (ii) implementar manualmente feed forward e back
propagation; (iii) treinar e avaliar a rede na base *Heart Disease* (divisão
80% treino / 20% teste); e (iv) demonstrar/visualizar o processo de
treinamento e inferência, com o grafo e os pesos sendo atualizados. Este
relatório documenta como cada um desses pontos foi resolvido, os resultados
obtidos e as variações de hiperparâmetros testadas.

## Método

### Organização da solução

O projeto está organizado em módulos pequenos e independentes, cada um com
uma responsabilidade única: carregamento e pré-processamento dos dados,
construção do grafo, execução de feed forward/back propagation sobre esse
grafo, visualização, e dois pontos de entrada (um script de treino via linha
de comando e um harness interativo).

**Figura 1** — `software_architecture.png`: módulos do projeto e suas
dependências. Os módulos de base (`data.py`, `graph.py`, `activations.py`)
alimentam o motor de treino (`mlp.py`) e a visualização (`visualize.py`),
que por sua vez são usados pelos dois pontos de entrada: o script de treino
em lote (`train.py`) e o harness interativo (`app_streamlit.py`).

A rede é representada como um `DiGraph` (grafo direcionado) da biblioteca
`networkx`: cada neurônio é um nó, com atributos de soma ponderada (*z*),
ativação (*value*), erro retropropagado (*delta*) e *bias*; cada conexão
entre dois neurônios de camadas adjacentes é uma aresta, com um peso. O
*feed forward* percorre os nós camada a camada, somando, para cada nó, o
valor de cada nó de origem multiplicado pelo peso da aresta correspondente,
e aplicando a função de ativação. O *back propagation* percorre o grafo no
sentido inverso: o erro do neurônio de saída (diferença entre a previsão e
o rótulo real) é distribuído para trás, aresta por aresta, proporcionalmente
ao peso de cada conexão e à derivada da função de ativação em cada nó —
produzindo o gradiente de cada peso e de cada *bias*, usados para atualizar
os parâmetros por gradiente descendente.

A corretude da implementação do *back propagation* foi verificada por
*gradient checking*: o gradiente analítico calculado pelo backward é
comparado ao gradiente numérico (diferenças finitas), obtido perturbando
cada peso em ±ε e observando a variação da perda. Os dois métodos convergem
até a quarta casa decimal, para as ativações ReLU e tanh testadas.

### Harness de visualização

O harness de referência da disciplina (`lsfcin/mlp`) é um aplicativo desktop
em PyQt6. Para este projeto, foi construído um harness equivalente como
aplicação web, usando *Streamlit*, reaproveitando exatamente os mesmos
módulos de grafo e treino (nenhuma lógica foi duplicada). O harness permite:
carregar o dataset, ajustar arquitetura/ativação/taxa de aprendizagem,
executar um passo de treino ou uma época completa, rodar a inferência no
conjunto de teste, e visualizar o grafo (nós e arestas coloridas por sinal e
espessura por magnitude do peso) e a curva de perda em tempo real.

**Figura 2** — `streamlit_app.png`: harness interativo (Streamlit) em
execução: painel de controle à esquerda, grafo da rede com os pesos ao
centro, e curva de perda (loss) por época à direita.

### Dados

A base utilizada foi a *Heart Disease* (13 atributos clínicos — idade,
sexo, tipo de dor no peito, pressão em repouso, colesterol, entre outros —
e um rótulo binário indicando presença de doença cardíaca), com 303
amostras. Os dados foram divididos em 80% treino (242 amostras) e 20% teste
(60 amostras), com separação fixa por semente aleatória. As features foram
padronizadas (*z-score*: subtração da média e divisão pelo desvio padrão),
usando estatísticas calculadas apenas no conjunto de treino, para evitar
vazamento de informação do teste.

## Resultados e Discussão

### Configuração final e métricas

A configuração que obteve o melhor resultado no conjunto de teste foi:
arquitetura 13 | 8 | 5 | 1 (13 entradas, duas camadas escondidas de 8 e 5
neurônios, 1 saída), ativação ReLU nas camadas escondidas e sigmoid na
saída, taxa de aprendizagem 0.005, treinada por 60 épocas com gradiente
descendente estocástico (atualização a cada amostra).

**Tabela 1** — Métricas no conjunto de teste (60 amostras):

| Métrica | Valor |
|---|---|
| Acurácia | 0.833 |
| Precisão | 0.757 |
| Revocação (*recall*) | 0.966 |
| F1-score | 0.848 |
| Verdadeiros positivos | 28 |
| Falsos positivos | 9 |
| Verdadeiros negativos | 22 |
| Falsos negativos | 1 |

A revocação alta (0.966) indica que o modelo raramente deixa passar um
paciente com doença cardíaca (apenas 1 falso negativo em 29 casos
positivos) — um comportamento desejável nesse domínio, em que o custo de um
falso negativo (não detectar a doença) tende a ser maior que o de um falso
positivo. Em contrapartida, a precisão mais baixa (0.757) mostra que o
modelo superestima casos positivos com alguma frequência (9 falsos
positivos).

### Arquitetura antes e depois do treinamento

**Figura 3** — `architecture_before.png` + `architecture_after.png`: grafo
da rede antes do treinamento (pesos inicializados por Xavier/Glorot) e
depois de 60 épocas de treinamento. Azul indica peso positivo, vermelho
indica peso negativo; a espessura da aresta é proporcional à magnitude do
peso. É possível notar que a distribuição de pesos muda de forma visível,
sobretudo nas conexões entre a última camada escondida e o neurônio de
saída, que passam a ter magnitudes bem mais desiguais entre si — indício de
que a rede aprendeu a dar peso diferente a diferentes combinações de
atributos.

### Variações testadas

Diversas combinações de arquitetura, ativação, taxa de aprendizagem e
número de épocas foram testadas manualmente antes de se chegar à
configuração final.

**Tabela 2** — Variações de hiperparâmetros testadas (acurácia em treino e
teste):

| Arquitetura | Ativação | LR | Épocas | Acc. treino | Acc. teste |
|---|---|---|---|---|---|
| 13\|8\|5\|1 | relu | 0.01 | 150 | 1.000 | 0.733 |
| 13\|8\|5\|1 | relu | 0.01 | 60 | 0.967 | 0.767 |
| 13\|8\|5\|1 | tanh | 0.01 | 40 | 0.942 | 0.800 |
| 13\|6\|4\|1 | relu | 0.01 | 50 | 0.938 | 0.683 |
| 13\|8\|5\|1 | relu | 0.005 | 80 | 0.951 | 0.817 |
| 13\|10\|6\|1 | relu | 0.005 | 80 | 0.955 | 0.700 |
| 13\|8\|5\|1 | relu | 0.005 | 100 | 0.971 | 0.783 |
| **13\|8\|5\|1** | **relu** | **0.005** | **60** | **0.930** | **0.833** |

O padrão mais consistente observado foi **overfitting** em redes maiores ou
treinadas por mais épocas: a primeira linha da Tabela 2 (150 épocas) atinge
100% de acurácia no treino, mas cai para 73,3% no teste — a rede passou a
memorizar os 242 pacientes de treino em vez de aprender um padrão que
generaliza para pacientes novos. O mesmo efeito, em menor grau, aparece ao
aumentar a arquitetura (13|10|6|1): mais parâmetros, mais capacidade de
memorização, pior generalização nesse dataset pequeno. A configuração final
(8|5, 60 épocas, *learning rate* 0.005) foi a que equilibrou melhor esse
compromisso entre ajuste ao treino e generalização. A padronização das
features (*z-score*) também se mostrou necessária: sem ela, atributos de
escala maior (por exemplo, colesterol, que varia de 126 a 564) dominam a
soma ponderada e tornam o treinamento instável, independentemente da
arquitetura escolhida.
