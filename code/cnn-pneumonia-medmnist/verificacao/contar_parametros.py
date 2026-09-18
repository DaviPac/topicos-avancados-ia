"""Compara a rede base do artigo com a arquitetura modificada.

Arquivo NOVO (nao faz parte do projeto original dos autores). Nao treina nada: so
constroi as duas redes, conta parametros e mostra o formato do mapa de ativacao na
saida de cada estagio -- que e onde esta o argumento da modificacao.

    python verificacao/contar_parametros.py
"""

import os
import sys

import torch

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "MedMNIST2D"))

from models import ResNet18, ResNet18Slim  # noqa: E402  (precisa do sys.path acima)

# PneumoniaMNIST: raio-X em tons de cinza, 28x28, duas classes (normal/pneumonia).
IN_CHANNELS = 1
NUM_CLASSES = 2


def contar(modelo):
    return sum(p.numel() for p in modelo.parameters())


def formatos_por_estagio(modelo, entrada):
    """Formato do mapa de ativacao na saida do tronco e de cada estagio residual."""
    formatos = []
    with torch.no_grad():
        out = torch.relu(modelo.bn1(modelo.conv1(entrada)))
        formatos.append(("tronco (conv1)", tuple(out.shape[1:])))
        for i in (1, 2, 3, 4):
            estagio = getattr(modelo, f"layer{i}")
            if estagio is None:
                continue
            out = estagio(out)
            formatos.append((f"layer{i}", tuple(out.shape[1:])))
    return formatos


def parametros_por_bloco(modelo):
    """Quantos parametros vivem em cada parte da rede."""
    return [
        (nome, sum(p.numel() for p in filho.parameters()))
        for nome, filho in modelo.named_children()
        if filho is not None and any(True for _ in filho.parameters())
    ]


def relatar(nome, modelo, entrada):
    total = contar(modelo)
    print(f"\n=== {nome} ===")
    print(f"parametros: {total:,}")
    print("  por parte:")
    for parte, n in parametros_por_bloco(modelo):
        print(f"    {parte:<10} {n:>12,}  ({100 * n / total:5.1f}%)")
    print("  formato do mapa de ativacao (canais, altura, largura):")
    for parte, formato in formatos_por_estagio(modelo, entrada):
        print(f"    {parte:<15} {formato}")
    saida = modelo(entrada)
    print(f"  entrada {tuple(entrada.shape)} -> saida {tuple(saida.shape)}")
    return total


def main():
    entrada = torch.randn(4, IN_CHANNELS, 28, 28)

    base = ResNet18(in_channels=IN_CHANNELS, num_classes=NUM_CLASSES).eval()
    enxuta = ResNet18Slim(in_channels=IN_CHANNELS, num_classes=NUM_CLASSES).eval()

    n_base = relatar("ResNet-18 do artigo (baseline)", base, entrada)
    n_enxuta = relatar("ResNet-18 enxuta (modificacao do trabalho)", enxuta, entrada)

    print(f"\nreducao: {n_base:,} -> {n_enxuta:,} parametros "
          f"({100 * (1 - n_enxuta / n_base):.1f}% a menos, {n_base / n_enxuta:.1f}x menor)")


if __name__ == "__main__":
    main()
