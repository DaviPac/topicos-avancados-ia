"""Carrega o dataset Heart Disease, padroniza as features e separa treino/teste."""
import csv
import random

FEATURE_COLUMNS = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal",
]
TARGET_COLUMN = "target"


def load_csv(path):
    with open(path, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    X = [[float(row[c]) for c in FEATURE_COLUMNS] for row in rows]
    y = [float(row[TARGET_COLUMN]) for row in rows]
    return X, y


def train_test_split(X, y, test_ratio=0.2, seed=42):
    rng = random.Random(seed)
    idx = list(range(len(X)))
    rng.shuffle(idx)
    n_test = int(len(idx) * test_ratio)
    test_idx, train_idx = idx[:n_test], idx[n_test:]
    split = lambda data, ids: [data[i] for i in ids]
    return (
        split(X, train_idx), split(y, train_idx),
        split(X, test_idx), split(y, test_idx),
    )


def standardize(X_train, X_test):
    """Padronização (z-score) usando média/desvio calculados só no treino."""
    n_features = len(X_train[0])
    means, stds = [], []
    for j in range(n_features):
        col = [row[j] for row in X_train]
        mean = sum(col) / len(col)
        var = sum((v - mean) ** 2 for v in col) / len(col)
        std = var ** 0.5 or 1.0
        means.append(mean)
        stds.append(std)

    def apply(X):
        return [[(row[j] - means[j]) / stds[j] for j in range(n_features)] for row in X]

    return apply(X_train), apply(X_test)


def load_heart_disease(path, test_ratio=0.2, seed=42):
    X, y = load_csv(path)
    X_train, y_train, X_test, y_test = train_test_split(X, y, test_ratio, seed)
    X_train, X_test = standardize(X_train, X_test)
    return X_train, y_train, X_test, y_test
