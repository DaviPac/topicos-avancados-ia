"""Site Streamlit equivalente ao visualizador PyQt do professor (lsfcin/mlp):
grafo interativo da MLP + painel de controle (dataset, forward passo-a-passo,
treino). Roda em cima da mesma MLP-grafo de `src/` (sem lógica duplicada).

Uso: streamlit run app_streamlit.py
"""
import matplotlib.pyplot as plt
import streamlit as st

from src.data import FEATURE_COLUMNS, load_heart_disease
from src.graph import build_graph, layer_nodes, num_layers
from src.mlp import apply_gradients, backward, bce_loss, forward
from src.visualize import draw_snapshot

st.set_page_config(page_title="MLP Heart Disease — grafo", layout="wide")

DATA_PATH = "data/heart.csv"


def init_state():
    if "G" not in st.session_state:
        st.session_state.hidden = [8, 5]
        st.session_state.activation = "relu"
        st.session_state.lr = 0.005
        st.session_state.G = build_graph(_layer_sizes(), seed=42)
        st.session_state.loss_history = []
        st.session_state.dataset = None
        st.session_state.sample_idx = 0
        st.session_state.last_status = "pronto"


def _layer_sizes():
    return [len(FEATURE_COLUMNS), *st.session_state.hidden, 1]


def reset_network():
    st.session_state.G = build_graph(_layer_sizes(), seed=42)
    st.session_state.loss_history = []
    st.session_state.last_status = "rede reiniciada"


init_state()

st.title("Visualizador de Rede Neural (grafo) — Streamlit")
st.caption("Equivalente web do visualizador PyQt do professor (lsfcin/mlp): mesma MLP-grafo, forward/backward manuais.")

with st.sidebar:
    st.header("Arquitetura")
    hidden_text = st.text_input("Camadas escondidas (separadas por vírgula)", value="8, 5")
    st.session_state.hidden = [int(v) for v in hidden_text.split(",") if v.strip()]
    st.session_state.activation = st.selectbox("Ativação", ["relu", "tanh", "sigmoid"], index=0)
    if st.button("Reconstruir rede"):
        reset_network()

    st.header("Dataset")
    if st.button("Carregar heart.csv"):
        X_train, y_train, X_test, y_test = load_heart_disease(DATA_PATH, seed=42)
        st.session_state.dataset = {"X_train": X_train, "y_train": y_train, "X_test": X_test, "y_test": y_test}
        st.session_state.sample_idx = 0
        st.session_state.last_status = f"dataset carregado: {len(X_train)} treino / {len(X_test)} teste"
    if st.button("Próximo sample") and st.session_state.dataset:
        st.session_state.sample_idx = (st.session_state.sample_idx + 1) % len(st.session_state.dataset["X_train"])

    st.header("Treino")
    st.session_state.lr = st.number_input("Learning rate", value=0.005, step=0.001, format="%.4f")
    train_step = st.button("Train Step")
    train_epoch = st.button("Train Época")
    fast_forward = st.button("Fast Forward (teste)")

G = st.session_state.G
ds = st.session_state.dataset

if ds and train_step:
    i = st.session_state.sample_idx
    x, y = ds["X_train"][i], ds["y_train"][i]
    y_pred = forward(G, x, st.session_state.activation)
    loss = bce_loss(y_pred, [y])
    grad_w, grad_b = backward(G, [y], st.session_state.activation)
    apply_gradients(G, grad_w, grad_b, st.session_state.lr)
    st.session_state.loss_history.append(loss)
    st.session_state.last_status = f"sample {i}: saída={y_pred[0]:.4f} alvo={y:.0f} loss={loss:.4f}"

if ds and train_epoch:
    total_loss, correct = 0.0, 0
    for x, y in zip(ds["X_train"], ds["y_train"]):
        y_pred = forward(G, x, st.session_state.activation)
        total_loss += bce_loss(y_pred, [y])
        correct += int((y_pred[0] >= 0.5) == (y >= 0.5))
        grad_w, grad_b = backward(G, [y], st.session_state.activation)
        apply_gradients(G, grad_w, grad_b, st.session_state.lr)
    avg_loss = total_loss / len(ds["X_train"])
    st.session_state.loss_history.append(avg_loss)
    st.session_state.last_status = f"época: loss_med={avg_loss:.4f} acc_treino={correct / len(ds['X_train']):.3f}"

if ds and fast_forward:
    correct = sum(
        int((forward(G, x, st.session_state.activation)[0] >= 0.5) == (y >= 0.5))
        for x, y in zip(ds["X_test"], ds["y_test"])
    )
    st.session_state.last_status = f"fast-forward (teste): acc={correct / len(ds['X_test']):.3f}"

col_graph, col_info = st.columns([2, 1])

with col_graph:
    fig, ax = plt.subplots(figsize=(8, 5.5))
    draw_snapshot(G, ax, title=f"arquitetura {' | '.join(str(n) for n in _layer_sizes())}")
    st.pyplot(fig)

with col_info:
    st.subheader("Status")
    st.write(st.session_state.last_status)
    if ds:
        st.write(f"amostra atual: {st.session_state.sample_idx} / {len(ds['X_train'])}")
    st.subheader("Loss")
    if st.session_state.loss_history:
        st.line_chart(st.session_state.loss_history)
    else:
        st.caption("sem histórico ainda — use Train Step / Train Época")
