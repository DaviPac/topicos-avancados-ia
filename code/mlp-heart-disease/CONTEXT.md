# mlp-heart-disease/

MLP from scratch (estrutura de grafo) treinada no dataset Heart Disease.
Ver `README.md` para o que é e como rodar.

## Organização

- `src/graph.py` — construção do grafo (nós = neurônios, arestas = pesos).
- `src/activations.py` — funções de ativação e derivadas.
- `src/mlp.py` — feed forward e back propagation sobre o grafo.
- `src/data.py` — carga do CSV, padronização, split treino/teste.
- `src/visualize.py` — desenho do grafo e animação dos pesos (networkx + matplotlib).
- `src/train.py` — laço de treino / CLI / ponto de entrada (`python -m src.train`).
- `data/heart.csv` — dataset (ver origem no README).
- `tests/test_mlp.py` — gradient checking do backward.
- `outputs/` — gerado pelo treino (`metrics.json`, `graph_final.png`, `training.gif`); não versionar reruns grandes além do necessário para a entrega.

## Convenções

- Sem numpy/autograd no núcleo da MLP: o objetivo da prática é implementar
  forward/backward "na mão" percorrendo o grafo.
- Split treino/teste e padronização usam sempre a mesma seed (`--seed`,
  padrão 42) para reprodutibilidade.
