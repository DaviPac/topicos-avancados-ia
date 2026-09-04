"""Desenha o grafo da MLP com o matplotlib/networkx e monta um GIF mostrando
os pesos (espessura/cor das arestas) mudando ao longo do treinamento."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import matplotlib.animation as animation  # noqa: E402
import networkx as nx  # noqa: E402

from .graph import num_layers  # noqa: E402


def _layout(G):
    n_layers = num_layers(G)
    pos = {}
    for layer_idx in range(n_layers):
        nodes = sorted(n for n in G.nodes if n[0] == layer_idx)
        count = len(nodes)
        for i, node in enumerate(nodes):
            pos[node] = (layer_idx, (count - 1) / 2 - i)
    return pos


def draw_snapshot(G, ax, title=""):
    ax.clear()
    pos = _layout(G)
    weights = [G[u][v]["weight"] for u, v in G.edges]
    max_w = max(1e-6, max(abs(w) for w in weights))
    colors = ["#1f77b4" if w >= 0 else "#d62728" for w in weights]
    widths = [0.5 + 3.5 * abs(w) / max_w for w in weights]

    nx.draw_networkx_edges(G, pos, ax=ax, edge_color=colors, width=widths, alpha=0.6)
    nx.draw_networkx_nodes(G, pos, ax=ax, node_color="#f0f0f0", edgecolors="#333333", node_size=350)
    ax.set_title(title)
    ax.axis("off")


def save_animation(G, snapshots, out_path, fps=2):
    """`snapshots` é uma lista de (epoch, {aresta: peso}) tirados durante o
    treino; `G` fornece a estrutura fixa do grafo (nós e arestas)."""
    fig, ax = plt.subplots(figsize=(7, 5))

    def render(frame_idx):
        epoch, weights = snapshots[frame_idx]
        for (u, v), w in weights.items():
            G[u][v]["weight"] = w
        draw_snapshot(G, ax, title=f"época {epoch}")

    anim = animation.FuncAnimation(fig, render, frames=len(snapshots), interval=1000 / fps)
    anim.save(out_path, writer=animation.PillowWriter(fps=fps))
    plt.close(fig)


def save_static(G, out_path, title=""):
    fig, ax = plt.subplots(figsize=(7, 5))
    draw_snapshot(G, ax, title=title)
    fig.savefig(out_path, dpi=120, bbox_inches="tight")
    plt.close(fig)
