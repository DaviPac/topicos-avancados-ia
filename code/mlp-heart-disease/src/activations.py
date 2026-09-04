"""Funções de ativação e suas derivadas (em função do próprio valor pós-ativação
quando possível, para simplificar o backward)."""
import math


def _sigmoid(z):
    if z >= 0:
        return 1.0 / (1.0 + math.exp(-z))
    e = math.exp(z)
    return e / (1.0 + e)


ACTIVATIONS = {
    "relu": {
        "f": lambda z: z if z > 0 else 0.0,
        "df_dz": lambda z, a: 1.0 if z > 0 else 0.0,
    },
    "sigmoid": {
        "f": _sigmoid,
        "df_dz": lambda z, a: a * (1.0 - a),
    },
    "tanh": {
        "f": math.tanh,
        "df_dz": lambda z, a: 1.0 - a * a,
    },
    "linear": {
        "f": lambda z: z,
        "df_dz": lambda z, a: 1.0,
    },
}
