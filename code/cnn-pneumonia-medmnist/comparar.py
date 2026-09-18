"""Compara a rede do artigo com a arquitetura modificada, antes x depois.

Arquivo NOVO (nao faz parte do projeto original dos autores) e que NAO altera nada
deles: apenas carrega os dois checkpoints gerados por train_and_eval_pytorch.py e
produz o material da comparacao exigida pelo enunciado.

Quantitativo, no terminal: parametros, AUC e ACC oficiais (mesmo Evaluator do artigo)
e tempo de inferencia. Qualitativo, em PNG: matriz de confusao das duas redes lado a
lado, curvas ROC sobrepostas e uma grade com os casos em que elas discordam.

    python comparar.py \\
        --antes  output/pneumoniamnist/<data_hora>/best_model.pth \\
        --depois output/pneumoniamnist/<data_hora>/best_model.pth
"""

import argparse
import os
import sys
import time

import medmnist
import numpy as np
import torch
import torch.nn as nn
import torch.utils.data as data
import torchvision.transforms as transforms
from medmnist import INFO, Evaluator

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "MedMNIST2D"))

import graficos_comparacao as graficos  # noqa: E402
from models import ResNet18, ResNet18Slim, ResNet50  # noqa: E402

ARQUITETURAS = {"resnet18": ResNet18, "resnet50": ResNet50, "resnet18slim": ResNet18Slim}


def carregar_modelo(arquitetura, caminho, n_channels, n_classes, device):
    modelo = ARQUITETURAS[arquitetura](in_channels=n_channels, num_classes=n_classes)
    modelo.load_state_dict(torch.load(caminho, map_location=device)["net"], strict=True)
    return modelo.to(device).eval()


def inferir(modelo, carregador, device):
    """Devolve as probabilidades por classe e o tempo medio por imagem, em ms."""
    softmax = nn.Softmax(dim=1)
    saidas, total, imagens = [], 0.0, 0
    with torch.no_grad():
        for entradas, _ in carregador:
            entradas = entradas.to(device)
            inicio = time.perf_counter()
            probabilidades = softmax(modelo(entradas))
            total += time.perf_counter() - inicio
            imagens += len(entradas)
            saidas.append(probabilidades.cpu().numpy())
    return np.concatenate(saidas), 1000 * total / imagens


def main():
    p = argparse.ArgumentParser(description="Compara a rede base com a modificada")
    p.add_argument("--data_flag", default="pneumoniamnist")
    p.add_argument("--antes", required=True, help="checkpoint da rede do artigo")
    p.add_argument("--depois", required=True, help="checkpoint da rede modificada")
    p.add_argument("--arq_antes", default="resnet18", choices=sorted(ARQUITETURAS))
    p.add_argument("--arq_depois", default="resnet18slim", choices=sorted(ARQUITETURAS))
    p.add_argument("--batch_size", default=128, type=int)
    p.add_argument("--size", default=28, type=int)
    p.add_argument("--gpu_ids", default="-1", help="-1 para CPU")
    p.add_argument("--saida", default="comparacao", help="pasta onde salvar as figuras")
    args = p.parse_args()

    ids = [int(i) for i in args.gpu_ids.split(",") if int(i) >= 0]
    device = torch.device(f"cuda:{ids[0]}") if ids else torch.device("cpu")

    info = INFO[args.data_flag]
    nomes_classes = [info["label"][str(i)] for i in range(len(info["label"]))]
    transformacao = transforms.Compose(  # a mesma do script dos autores
        [transforms.ToTensor(), transforms.Normalize(mean=[.5], std=[.5])])

    Dataset = getattr(medmnist, info["python_class"])
    teste = Dataset(split="test", transform=transformacao, download=False, size=args.size)
    carregador = data.DataLoader(dataset=teste, batch_size=args.batch_size, shuffle=False)
    avaliador = Evaluator(args.data_flag, "test", size=args.size)

    rotulos = ["antes (artigo)", "depois (modificada)"]
    modelos = [
        carregar_modelo(args.arq_antes, args.antes, info["n_channels"], len(nomes_classes), device),
        carregar_modelo(args.arq_depois, args.depois, info["n_channels"], len(nomes_classes), device),
    ]

    print(f"\ndataset: {args.data_flag}  |  teste: {len(teste)} imagens  |  device: {device}\n")
    print(f"{'':32} {'parametros':>12} {'AUC':>8} {'ACC':>8} {'ms/imagem':>11}")
    probabilidades = []
    for rotulo, arquitetura, modelo in zip(rotulos, [args.arq_antes, args.arq_depois], modelos):
        probs, ms = inferir(modelo, carregador, device)
        auc, acc = avaliador.evaluate(probs)
        parametros = sum(x.numel() for x in modelo.parameters())
        print(f"{rotulo + ' [' + arquitetura + ']':32.32} {parametros:>12,} "
              f"{auc:>8.3f} {acc:>8.3f} {ms:>11.2f}")
        probabilidades.append(probs)

    y_true = teste.labels.reshape(-1)

    print("\nfiguras:")
    os.makedirs(args.saida, exist_ok=True)
    graficos.matriz_confusao(
        y_true, {r: p.argmax(axis=1) for r, p in zip(rotulos, probabilidades)},
        nomes_classes, os.path.join(args.saida, "matriz_confusao.png"))
    if len(nomes_classes) == 2:
        graficos.curva_roc(
            y_true, {r: p[:, 1] for r, p in zip(rotulos, probabilidades)},
            os.path.join(args.saida, "curva_roc.png"))
    graficos.grade_discordancias(
        teste.imgs, y_true, probabilidades, nomes_classes, rotulos,
        os.path.join(args.saida, "discordancias.png"))


if __name__ == "__main__":
    main()
