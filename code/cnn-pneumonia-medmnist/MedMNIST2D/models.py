'''
Adapted from kuangliu/pytorch-cifar .
'''

import torch.nn as nn
import torch.nn.functional as F


class BasicBlock(nn.Module):
    expansion = 1

    def __init__(self, in_planes, planes, stride=1):
        super(BasicBlock, self).__init__()
        self.conv1 = nn.Conv2d(
            in_planes, planes, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(planes)
        
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3,
                               stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(planes)

        self.shortcut = nn.Sequential()
        if stride != 1 or in_planes != self.expansion*planes:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_planes, self.expansion*planes,
                          kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(self.expansion*planes)
            )

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)
        out = F.relu(out)
        return out


class Bottleneck(nn.Module):
    expansion = 4

    def __init__(self, in_planes, planes, stride=1):
        super(Bottleneck, self).__init__()
        self.conv1 = nn.Conv2d(in_planes, planes, kernel_size=1, bias=False)
        self.bn1 = nn.BatchNorm2d(planes)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3,
                               stride=stride, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(planes)
        self.conv3 = nn.Conv2d(planes, self.expansion *
                               planes, kernel_size=1, bias=False)
        self.bn3 = nn.BatchNorm2d(self.expansion*planes)

        self.shortcut = nn.Sequential()
        if stride != 1 or in_planes != self.expansion*planes:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_planes, self.expansion*planes,
                          kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(self.expansion*planes)
            )

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = F.relu(self.bn2(self.conv2(out)))
        out = self.bn3(self.conv3(out))
        out += self.shortcut(x)
        out = F.relu(out)
        return out


class ResNet(nn.Module):
    # MODIFICACAO (trabalho): `widths` era fixo em (64, 128, 256, 512) e os quatro
    # estagios eram obrigatorios. Agora a largura e o numero de estagios sao
    # configuraveis, o que permite a variante enxuta sem duplicar o BasicBlock.
    # Com os valores padrao a rede e identica a original, inclusive nos nomes dos
    # parametros (layer1..layer4), entao checkpoints antigos continuam carregando.
    def __init__(self, block, num_blocks, in_channels=1, num_classes=2,
                 widths=(64, 128, 256, 512)):
        super(ResNet, self).__init__()
        self.in_planes = widths[0]

        self.conv1 = nn.Conv2d(in_channels, widths[0], kernel_size=3,
                               stride=1, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(widths[0])
        self.layer1 = self._make_layer(block, widths[0], num_blocks[0], stride=1)
        self.layer2 = self._make_layer(block, widths[1], num_blocks[1], stride=2)
        self.layer3 = self._make_layer(block, widths[2], num_blocks[2], stride=2)
        self.layer4 = self._make_layer(
            block, widths[3], num_blocks[3], stride=2) if len(num_blocks) > 3 else None
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        # `self.in_planes` ja acumulou a largura do ultimo estagio (widths[-1] *
        # block.expansion), entao isto e equivalente ao antigo 512 * block.expansion.
        self.linear = nn.Linear(self.in_planes, num_classes)

    def _make_layer(self, block, planes, num_blocks, stride):
        strides = [stride] + [1]*(num_blocks-1)
        layers = []
        for stride in strides:
            layers.append(block(self.in_planes, planes, stride))
            self.in_planes = planes * block.expansion
        return nn.Sequential(*layers)

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.layer1(out)
        out = self.layer2(out)
        out = self.layer3(out)
        if self.layer4 is not None:  # MODIFICACAO (trabalho): 4o estagio virou opcional
            out = self.layer4(out)
        out = self.avgpool(out)
        out = out.view(out.size(0), -1)
        out = self.linear(out)
        return out


def ResNet18(in_channels, num_classes):
    return ResNet(BasicBlock, [2, 2, 2, 2], in_channels=in_channels, num_classes=num_classes)


def ResNet50(in_channels, num_classes):
    return ResNet(Bottleneck, [3, 4, 6, 3], in_channels=in_channels, num_classes=num_classes)


# MODIFICACAO (trabalho): arquitetura proposta -- ResNet-18 enxugada para a escala do
# PneumoniaMNIST (4.708 imagens de treino, 1x28x28, 2 classes).
#   - 3 estagios em vez de 4: o 4o estagio da ResNet-18 opera sobre mapas de 4x4 e
#     concentra a maior parte dos pesos;
#   - 1 bloco residual por estagio em vez de 2;
#   - metade da largura em cada estagio (32/64/128 no lugar de 64/128/256/512).
# Motivacao: ~11,2 M de parametros para 4.708 imagens de treino, e a propria tabela do
# artigo MedMNIST v2 mostra que mais capacidade nao ajuda neste dataset (ResNet-50 (28)
# empata com ResNet-18 (28) em ACC: 0,854).
def ResNet18Slim(in_channels, num_classes):
    return ResNet(BasicBlock, [1, 1, 1], in_channels=in_channels,
                  num_classes=num_classes, widths=(32, 64, 128))