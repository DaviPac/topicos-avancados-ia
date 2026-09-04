"""Estrutura de grafo da MLP: cada neurônio é um nó, cada conexão é uma aresta com peso."""
import random

import networkx as nx


def build_graph(layer_sizes, seed=42):
    """Cria um DiGraph totalmente conectado entre camadas consecutivas.

    Nó `(camada, índice)` guarda `z` (soma ponderada), `value` (pós-ativação),
    `delta` (erro retropropagado) e `bias`. Aresta guarda `weight`.
    Pesos iniciados com Xavier/Glorot uniforme, como discutido na aula.
    """
    rng = random.Random(seed)
    G = nx.DiGraph()

    for layer_idx, size in enumerate(layer_sizes):
        for i in range(size):
            is_input = layer_idx == 0
            G.add_node(
                (layer_idx, i),
                layer=layer_idx,
                value=0.0,
                z=0.0,
                delta=0.0,
                bias=0.0 if is_input else rng.uniform(-0.1, 0.1),
            )

    for layer_idx in range(len(layer_sizes) - 1):
        n_in, n_out = layer_sizes[layer_idx], layer_sizes[layer_idx + 1]
        limit = (6 / (n_in + n_out)) ** 0.5  # Xavier/Glorot uniform
        for i in range(n_in):
            for j in range(n_out):
                G.add_edge(
                    (layer_idx, i),
                    (layer_idx + 1, j),
                    weight=rng.uniform(-limit, limit),
                )

    return G


def layer_nodes(G, layer_idx):
    return [n for n, d in G.nodes(data=True) if d["layer"] == layer_idx]


def num_layers(G):
    return max(d["layer"] for _, d in G.nodes(data=True)) + 1
