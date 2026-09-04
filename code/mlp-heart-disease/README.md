# mlp-heart-disease

Prática da disciplina: MLP (Multi-Layer Perceptron) codificada do zero, a
partir da estrutura de um grafo, com feed forward e back propagation
implementados manualmente (sem autograd). Treinada no dataset **Heart
Disease** (UCI/Cleveland, 303 amostras, 13 atributos clínicos) para prever
presença de doença cardíaca.

## Como rodar

```bash
pip install -r requirements.txt
python -m src.train --lr 0.005 --epochs 60 --activation relu --hidden 8 5
```

Isso treina a rede (80% treino / 20% teste, split fixo por seed) e escreve em
`outputs/`:

- `metrics.json` — hiperparâmetros, histórico de loss/acurácia por época e
  acurácia final de treino/teste.
- `graph_final.png` — grafo da rede com os pesos finais (cor = sinal,
  espessura = magnitude).
- `training.gif` — animação do grafo mostrando os pesos sendo atualizados ao
  longo do treinamento.

## Estrutura do grafo

Cada neurônio é um nó do `networkx.DiGraph` (`src/graph.py`), cada conexão é
uma aresta com peso. O feed forward (`src/mlp.py::forward`) percorre os nós
camada a camada somando `valor_origem * peso_da_aresta` por aresta de
entrada. O back propagation (`backward`) calcula o `delta` de cada nó a
partir dos deltas da camada seguinte e dos pesos das arestas de saída, e
então o gradiente de cada aresta (`delta_destino * valor_origem`).

## Resultado obtido

| | |
|---|---|
| accuracy (teste) | 0.833 |
| learning rate | 0.005 |
| activation | relu |
| architecture | 13 \| 8 \| 5 \| 1 |
| pre-processing | standardize |

Ver `outputs/metrics.json` para o histórico completo.

## Testes

`tests/test_mlp.py` prova a corretude do back propagation por *gradient
checking* (compara o gradiente analítico com a derivada numérica por
diferenças finitas) e verifica que alguns passos de gradiente reduzem a
perda.

```bash
python -m unittest tests.test_mlp -v
```

## Dados

`data/heart.csv` é a versão amplamente usada do dataset Heart Disease
(UCI/Cleveland processado, 303 linhas, 13 atributos + rótulo binário),
espelhada em `github.com/kb22/Heart-Disease-Prediction` — o link oficial do
UCI (archive.ics.uci.edu) não estava acessível a partir deste ambiente.
