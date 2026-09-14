"""Treina a MLP (grafo) no dataset Heart Disease e avalia no conjunto de teste.

Uso:
    python -m src.train --lr 0.01 --epochs 100 --activation relu --hidden 8 5
"""
import argparse
import json
import os
import random

from .data import FEATURE_COLUMNS, load_heart_disease
from .graph import build_graph
from .mlp import apply_gradients, backward, bce_loss, forward
from .visualize import save_animation, save_static

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "outputs")


def accuracy(G, X, y, hidden_activation):
    correct = 0
    for x, yt in zip(X, y):
        pred = forward(G, x, hidden_activation)[0]
        correct += int((pred >= 0.5) == (yt >= 0.5))
    return correct / len(X)


def train(X_train, y_train, X_test, y_test, layer_sizes, activation, lr, epochs, seed, snapshot_every=10):
    G = build_graph(layer_sizes, seed=seed)
    rng = random.Random(seed)
    history = {"train_loss": [], "train_acc": [], "test_acc": []}
    snapshots = []

    for epoch in range(1, epochs + 1):
        order = list(range(len(X_train)))
        rng.shuffle(order)
        epoch_loss = 0.0
        for i in order:
            y_pred = forward(G, X_train[i], activation)
            epoch_loss += bce_loss(y_pred, [y_train[i]])
            grad_w, grad_b = backward(G, [y_train[i]], activation)
            apply_gradients(G, grad_w, grad_b, lr)

        history["train_loss"].append(epoch_loss / len(X_train))
        history["train_acc"].append(accuracy(G, X_train, y_train, activation))
        history["test_acc"].append(accuracy(G, X_test, y_test, activation))

        if epoch == 1 or epoch % snapshot_every == 0 or epoch == epochs:
            snapshots.append((epoch, {(u, v): d["weight"] for u, v, d in G.edges(data=True)}))

    return G, history, snapshots


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default=os.path.join(os.path.dirname(__file__), "..", "data", "heart.csv"))
    parser.add_argument("--hidden", type=int, nargs="+", default=[8, 5])
    parser.add_argument("--activation", default="relu", choices=["relu", "tanh", "sigmoid"])
    parser.add_argument("--lr", type=float, default=0.01)
    parser.add_argument("--epochs", type=int, default=150)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    X_train, y_train, X_test, y_test = load_heart_disease(args.data, seed=args.seed)
    layer_sizes = [len(FEATURE_COLUMNS), *args.hidden, 1]

    G, history, snapshots = train(
        X_train, y_train, X_test, y_test, layer_sizes,
        args.activation, args.lr, args.epochs, args.seed,
    )

    final_test_acc = history["test_acc"][-1]
    final_train_acc = history["train_acc"][-1]
    print(f"arquitetura: {' | '.join(map(str, layer_sizes))}")
    print(f"train accuracy: {final_train_acc:.3f}")
    print(f"test accuracy:  {final_test_acc:.3f}")

    metrics = {
        "architecture": layer_sizes,
        "activation": args.activation,
        "learning_rate": args.lr,
        "epochs": args.epochs,
        "preprocessing": "standardize",
        "seed": args.seed,
        "train_accuracy": final_train_acc,
        "test_accuracy": final_test_acc,
        "history": history,
    }
    with open(os.path.join(OUT_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    save_static(G, os.path.join(OUT_DIR, "graph_final.png"), title="pesos finais")
    save_animation(G, snapshots, os.path.join(OUT_DIR, "training.gif"))
    print(f"resultados salvos em {OUT_DIR}")


if __name__ == "__main__":
    main()
