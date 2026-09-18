"""Testes das duas arquiteturas. Rodam offline, em segundos, sem baixar dataset.

Arquivo NOVO (nao faz parte do projeto original dos autores).

O teste mais importante e o primeiro: garante que a rede BASE continua sendo exatamente
a dos autores. A classe `ResNet` foi generalizada para permitir a variante enxuta, e
este teste trava os numeros da rede original para que uma mudanca acidental nela seja
percebida -- se a base mudar, a comparacao antes/depois do trabalho perde o sentido.

Os valores esperados foram conferidos contra o models.py original do commit 70b6b3a de
github.com/MedMNIST/experiments: mesmos nomes de parametros, mesmos formatos, mesma
contagem e mesma saida quando carregados os mesmos pesos.

    python verificacao/testar_redes.py
"""

import os
import sys

import torch

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "MedMNIST2D"))

from models import ResNet18, ResNet18Slim, ResNet50  # noqa: E402

PARAMS_BASE = 11_168_706      # ResNet-18, 1 canal, 2 classes (PneumoniaMNIST)
PARAMS_RESNET50 = 23_503_298  # ResNet-50, 1 canal, 2 classes
PARAMS_ENXUTA = 307_042       # arquitetura proposta neste trabalho


def contar(modelo):
    return sum(p.numel() for p in modelo.parameters())


def test_rede_base_intacta():
    base = ResNet18(in_channels=1, num_classes=2)
    assert contar(base) == PARAMS_BASE, contar(base)
    assert contar(ResNet50(in_channels=1, num_classes=2)) == PARAMS_RESNET50

    chaves = list(base.state_dict())
    assert len(chaves) == 122, len(chaves)
    # os nomes dos parametros precisam continuar iguais aos do artigo, senao os
    # checkpoints publicados pelos autores deixam de carregar
    assert chaves[0] == "conv1.weight"
    assert all(any(k.startswith(f"layer{i}.") for k in chaves) for i in (1, 2, 3, 4))
    assert base.layer4 is not None


def test_enxuta_e_menor_e_tem_tres_estagios():
    enxuta = ResNet18Slim(in_channels=1, num_classes=2)
    assert contar(enxuta) == PARAMS_ENXUTA, contar(enxuta)
    assert enxuta.layer4 is None
    assert contar(enxuta) < contar(ResNet18(in_channels=1, num_classes=2)) / 30


def test_mesma_interface():
    """As duas redes recebem e devolvem exatamente o mesmo formato."""
    entrada = torch.randn(8, 1, 28, 28)
    for modelo in (ResNet18(1, 2), ResNet18Slim(1, 2)):
        modelo.eval()
        with torch.no_grad():
            assert tuple(modelo(entrada).shape) == (8, 2)


def test_resolucao_dos_estagios():
    """O argumento da modificacao: o 4o estagio da base enxerga apenas 4x4."""
    entrada = torch.randn(2, 1, 28, 28)
    base = ResNet18(1, 2).eval()
    with torch.no_grad():
        out = torch.relu(base.bn1(base.conv1(entrada)))
        assert tuple(base.layer1(out).shape[2:]) == (28, 28)
        out = base.layer2(base.layer1(out))
        assert tuple(out.shape[2:]) == (14, 14)
        out = base.layer3(out)
        assert tuple(out.shape[2:]) == (7, 7)
        assert tuple(base.layer4(out).shape[2:]) == (4, 4)
    # e esse estagio de 4x4 concentra a maior parte dos pesos
    peso_layer4 = sum(p.numel() for p in base.layer4.parameters())
    assert peso_layer4 / contar(base) > 0.7


def test_treino_de_um_passo_reduz_a_perda():
    """Prova que a rede nova treina: overfit proposital de um lote minusculo."""
    torch.manual_seed(42)
    entrada = torch.randn(16, 1, 28, 28)
    alvo = torch.randint(0, 2, (16,))
    modelo = ResNet18Slim(1, 2)
    criterio = torch.nn.CrossEntropyLoss()
    otimizador = torch.optim.Adam(modelo.parameters(), lr=0.001)  # lr do artigo

    perda_inicial = criterio(modelo(entrada), alvo).item()
    for _ in range(30):
        otimizador.zero_grad()
        perda = criterio(modelo(entrada), alvo)
        perda.backward()
        otimizador.step()
    assert perda.item() < perda_inicial / 10, (perda_inicial, perda.item())


def main():
    testes = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for teste in testes:
        teste()
        print(f"ok  {teste.__name__}")
    print(f"\n{len(testes)} testes passaram")


if __name__ == "__main__":
    main()
