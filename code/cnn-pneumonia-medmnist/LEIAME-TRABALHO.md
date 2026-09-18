# Trabalho — modificar a arquitetura de uma CNN existente

Prática da disciplina de Tópicos Avançados em IA: *selecionar, baixar e retreinar uma
rede existente em uma base de dados existente, implementar uma modificação na sua
arquitetura, re-treinar e comparar os resultados antes e depois*.

A estratégia aqui foi **copiar o projeto oficial dos autores e mudar só a
arquitetura**. Assim o "antes" é literalmente o código deles, e a única variável entre
as duas execuções é a rede — otimizador, scheduler, transformações, divisão dos dados
e métricas são idênticos.

## De onde veio o código e os dados

| | |
|---|---|
| **Artigo** | Yang, J., Shi, R., Wei, D., Liu, Z., Zhao, L., Ke, B., Pfister, H., Ni, B. *MedMNIST v2 — A large-scale lightweight benchmark for 2D and 3D biomedical image classification.* **Scientific Data 10, 41 (2023)** |
| **Código copiado** | https://github.com/MedMNIST/experiments — commit `70b6b3a7ad7afddff1df2a3b735235830fbdb142` (11/07/2024), licença Apache-2.0 |
| **Dataset** | **PneumoniaMNIST**: 5.856 raios-X de tórax pediátricos, classificação binária (normal × pneumonia), 1×28×28, splits oficiais 4.708 / 524 / 624, licença CC BY 4.0. Baixado automaticamente pelo pacote `medmnist` com a flag `--download` |
| **Rede base** | `MedMNIST2D/models.py::ResNet18` — ResNet-18 estilo CIFAR (primeira convolução 3×3 com passo 1, sem max-pooling), a mesma que produziu os números publicados |

**Números publicados no artigo** para PneumoniaMNIST em resolução 28 (é o alvo a bater
para provar que a reprodução da base está correta):

| Modelo do artigo | AUC | ACC |
|---|---|---|
| ResNet-18 (28) | 0,944 | 0,854 |
| ResNet-50 (28) | 0,948 | 0,854 |
| ResNet-18 (224) | 0,956 | 0,864 |
| ResNet-50 (224) | 0,962 | 0,884 |

## A modificação

Uma ResNet-18 enxugada para a escala do problema (`ResNet18Slim`, em
`MedMNIST2D/models.py`), construída com o mesmo `BasicBlock` dos autores:

| | ResNet-18 (artigo) | Enxuta (este trabalho) |
|---|---|---|
| Estágios residuais | 4 | **3** |
| Blocos por estágio | 2, 2, 2, 2 | **1, 1, 1** |
| Canais por estágio | 64, 128, 256, 512 | **32, 64, 128** |
| Resolução ao longo da rede | 28 → 28 → 14 → 7 → 4 | 28 → 28 → 14 → **7** |
| Parâmetros | (ver tabela de resultados) | (ver tabela de resultados) |

### Por que essa modificação

1. **Capacidade desproporcional ao dado.** São ~11,2 milhões de parâmetros para
   4.708 imagens de treino de 28×28 numa tarefa de duas classes — cerca de 2.400
   parâmetros por exemplo de treino.
2. **O próprio artigo mostra que mais capacidade não ajuda aqui.** Na tabela acima, a
   ResNet-50 (28), com ~4× mais parâmetros, empata com a ResNet-18 (28) em acurácia
   (0,854) e fica a 0,004 de AUC. Se dobrar a rede não melhora, a hipótese de que dá
   para cortar é razoável — e testável.
3. **O 4º estágio é o pior negócio da rede.** Ele opera sobre mapas de 4×4 pixels,
   resolução em que quase não resta estrutura espacial, e ainda assim concentra a
   maior parte dos pesos (rode `verificacao/contar_parametros.py` para ver a
   distribuição). Removê-lo é onde mais se corta com menos perda esperada.

**Hipótese a testar:** acurácia e AUC equivalentes às da rede original, com uma fração
dos parâmetros e do tempo de treino. O resultado é reportado como sair — inclusive se
a hipótese cair.

### O diff, na íntegra

Só dois arquivos do projeto original foram tocados; todo trecho alterado está marcado
com o comentário `MODIFICACAO (trabalho)`:

- **`MedMNIST2D/models.py`** — a classe `ResNet` tinha os quatro estágios e as larguras
  fixos no `__init__`. Passou a aceitar `widths` e um `num_blocks` de tamanho variável,
  e o 4º estágio virou opcional. **Com os valores padrão a rede continua idêntica à
  original**, inclusive nos nomes dos parâmetros (`layer1..layer4`), então checkpoints
  antigos continuam carregando. No fim do arquivo entrou a função `ResNet18Slim`.
- **`MedMNIST2D/train_and_eval_pytorch.py`** — o `import` e um `elif model_flag ==
  'resnet18slim'`, sem o qual não há como selecionar a rede nova pela linha de comando.
  Nenhuma outra linha do pipeline foi tocada.

Arquivos **novos** (não alteram nada dos autores): este `LEIAME-TRABALHO.md`,
`CONTEXT.md`, `requirements.txt` e `verificacao/contar_parametros.py`.

## Como rodar

```bash
pip install -r requirements.txt
```

Comparar as duas arquiteturas (o `--download` baixa o PneumoniaMNIST na primeira vez;
em CPU, `--gpu_ids -1` é obrigatório porque o padrão do script é GPU):

```bash
cd MedMNIST2D

# ANTES — a rede do artigo
python train_and_eval_pytorch.py --data_flag pneumoniamnist --model_flag resnet18 \
    --num_epochs 100 --download --gpu_ids -1 --run antes

# DEPOIS — a arquitetura modificada
python train_and_eval_pytorch.py --data_flag pneumoniamnist --model_flag resnet18slim \
    --num_epochs 100 --download --gpu_ids -1 --run depois
```

Cada execução cria `output/pneumoniamnist/<data_hora>/` com o melhor checkpoint
(`best_model.pth`), os CSVs de avaliação e os logs do Tensorboard.

### Inferência antes e depois (o que mostrar na apresentação)

O próprio script dos autores faz isso: com `--num_epochs 0` ele não treina, só carrega
o checkpoint e roda a avaliação nos três splits.

```bash
python train_and_eval_pytorch.py --data_flag pneumoniamnist --model_flag resnet18 \
    --num_epochs 0 --gpu_ids -1 --model_path output/pneumoniamnist/<data_hora>/best_model.pth

python train_and_eval_pytorch.py --data_flag pneumoniamnist --model_flag resnet18slim \
    --num_epochs 0 --gpu_ids -1 --model_path output/pneumoniamnist/<data_hora>/best_model.pth
```

E para mostrar o tamanho das duas redes lado a lado, sem treinar nada:

```bash
python verificacao/contar_parametros.py   # rodar na raiz do projeto
```

## Resultados

_(preencher com a saída das suas execuções)_

| | ResNet-18 (artigo) | Enxuta | Publicado no artigo |
|---|---|---|---|
| Parâmetros | | | — |
| AUC (teste) | | | 0,944 |
| ACC (teste) | | | 0,854 |
| Tempo por época | | | — |

## O que já foi verificado, e o que depende de você

_(preencher)_

## Referências

- Yang et al. *MedMNIST v2 — A large-scale lightweight benchmark for 2D and 3D
  biomedical image classification.* Scientific Data 10, 41 (2023).
- He, K., Zhang, X., Ren, S., Sun, J. *Deep Residual Learning for Image Recognition.*
  CVPR 2016. (origem do bloco residual usado pelas duas redes)
- Kermany, D. et al. *Identifying Medical Diagnoses and Treatable Diseases by
  Image-Based Deep Learning.* Cell, 2018. (origem dos raios-X que o PneumoniaMNIST
  padronizou)
