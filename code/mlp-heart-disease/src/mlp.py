"""Feed forward e back propagation percorrendo o grafo nó a nó / aresta a aresta.

Camadas escondidas usam a ativação escolhida (`hidden_activation`); a camada de
saída usa sigmoid, pois o problema é classificação binária com perda de
entropia cruzada (BCE) — combinação padrão para esse tipo de problema.
"""
import math

from .activations import ACTIVATIONS
from .graph import layer_nodes, num_layers

EPS = 1e-9


def forward(G, x, hidden_activation="relu"):
    n_layers = num_layers(G)
    input_nodes = layer_nodes(G, 0)
    for node, xi in zip(input_nodes, x):
        G.nodes[node]["value"] = xi
        G.nodes[node]["z"] = xi

    for layer_idx in range(1, n_layers):
        act = ACTIVATIONS["sigmoid" if layer_idx == n_layers - 1 else hidden_activation]
        for node in layer_nodes(G, layer_idx):
            z = G.nodes[node]["bias"]
            for src, _, edata in G.in_edges(node, data=True):
                z += G.nodes[src]["value"] * edata["weight"]
            a = act["f"](z)
            G.nodes[node]["z"] = z
            G.nodes[node]["value"] = a

    output_nodes = layer_nodes(G, n_layers - 1)
    return [G.nodes[n]["value"] for n in output_nodes]


def bce_loss(y_pred, y_true):
    return -sum(
        yt * math.log(yp + EPS) + (1 - yt) * math.log(1 - yp + EPS)
        for yp, yt in zip(y_pred, y_true)
    ) / len(y_pred)


def backward(G, y_true, hidden_activation="relu"):
    """Retropropaga o erro pelo grafo e devolve os gradientes por aresta/nó.

    Saída (sigmoid + BCE): delta = (a - y) — derivada já simplificada.
    Camadas escondidas: delta = df_dz(z) * soma(delta_destino * peso_da_aresta).
    """
    n_layers = num_layers(G)
    grad_w, grad_b = {}, {}

    output_nodes = layer_nodes(G, n_layers - 1)
    for node, yt in zip(output_nodes, y_true):
        a = G.nodes[node]["value"]
        G.nodes[node]["delta"] = a - yt

    for layer_idx in range(n_layers - 2, 0, -1):
        act = ACTIVATIONS[hidden_activation]
        for node in layer_nodes(G, layer_idx):
            z, a = G.nodes[node]["z"], G.nodes[node]["value"]
            downstream = sum(
                G.nodes[dst]["delta"] * edata["weight"]
                for _, dst, edata in G.out_edges(node, data=True)
            )
            G.nodes[node]["delta"] = act["df_dz"](z, a) * downstream

    for layer_idx in range(1, n_layers):
        for node in layer_nodes(G, layer_idx):
            delta = G.nodes[node]["delta"]
            grad_b[node] = delta
            for src, _, _ in G.in_edges(node, data=True):
                grad_w[(src, node)] = G.nodes[src]["value"] * delta

    return grad_w, grad_b


def apply_gradients(G, grad_w, grad_b, lr):
    for (src, dst), g in grad_w.items():
        G[src][dst]["weight"] -= lr * g
    for node, g in grad_b.items():
        G.nodes[node]["bias"] -= lr * g
