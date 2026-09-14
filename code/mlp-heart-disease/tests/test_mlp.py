"""Gradient checking: compara o gradiente calculado pelo backward (analítico)
com uma derivada numérica (diferenças finitas), provando que a implementação
de feed forward / back propagation no grafo está correta."""
import unittest

from src.graph import build_graph
from src.mlp import apply_gradients, backward, bce_loss, forward

X = [0.5, -1.2, 0.3]
Y = [1.0]
LAYER_SIZES = [3, 4, 1]


def loss_for(G, x, y, activation):
    y_pred = forward(G, x, activation)
    return bce_loss(y_pred, y)


class TestGradientCheck(unittest.TestCase):
    def _check(self, activation):
        G = build_graph(LAYER_SIZES, seed=1)
        forward(G, X, activation)
        grad_w, grad_b = backward(G, Y, activation)

        eps = 1e-5
        checked = 0
        for (u, v), analytic_grad in list(grad_w.items())[:6]:
            original = G[u][v]["weight"]

            G[u][v]["weight"] = original + eps
            loss_plus = loss_for(G, X, Y, activation)
            G[u][v]["weight"] = original - eps
            loss_minus = loss_for(G, X, Y, activation)
            G[u][v]["weight"] = original

            numeric_grad = (loss_plus - loss_minus) / (2 * eps)
            self.assertAlmostEqual(analytic_grad, numeric_grad, places=4)
            checked += 1

        self.assertGreater(checked, 0)

    def test_gradient_matches_numeric_relu(self):
        self._check("relu")

    def test_gradient_matches_numeric_tanh(self):
        self._check("tanh")

    def test_training_step_reduces_loss(self):
        G = build_graph(LAYER_SIZES, seed=1)
        loss_before = loss_for(G, X, Y, "relu")
        for _ in range(20):
            forward(G, X, "relu")
            grad_w, grad_b = backward(G, Y, "relu")
            apply_gradients(G, grad_w, grad_b, lr=0.5)
        loss_after = loss_for(G, X, Y, "relu")
        self.assertLess(loss_after, loss_before)


if __name__ == "__main__":
    unittest.main()
