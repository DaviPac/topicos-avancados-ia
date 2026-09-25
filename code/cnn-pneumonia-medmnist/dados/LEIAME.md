# dados/

`pneumoniamnist.npz` — o dataset **PneumoniaMNIST**, exatamente como distribuído pelos
autores do MedMNIST v2.

| | |
|---|---|
| Origem | https://zenodo.org/records/10519652/files/pneumoniamnist.npz |
| MD5 | `28209eda62fecd6e6a2d98b1501bb15f` (confere com o registrado em `medmnist/info.py`) |
| Conteúdo | 5.856 raios-X de tórax pediátricos, 1×28×28, rótulos 0 = normal / 1 = pneumonia |
| Splits | treino 4.708 · validação 524 · teste 624 (74,2% de pneumonia no treino) |
| Licença | CC BY 4.0 |

Citação exigida pela licença:

> Yang, J., Shi, R., Wei, D., Liu, Z., Zhao, L., Ke, B., Pfister, H., Ni, B.
> *MedMNIST v2 — A large-scale lightweight benchmark for 2D and 3D biomedical image
> classification.* Scientific Data 10, 41 (2023).
>
> Fonte primária das imagens: Kermany, D. et al. *Identifying Medical Diagnoses and
> Treatable Diseases by Image-Based Deep Learning.* Cell, 2018.

## Por que o arquivo está versionado aqui

O script dos autores baixa o dataset sozinho com `--download`. A cópia existe para o
trabalho não depender de o Zenodo estar acessível na hora da apresentação — e porque
houve um ambiente, nesta disciplina, em que o Zenodo estava bloqueado por política de
rede.

Para usá-la sem baixar nada, copie o arquivo para a pasta que o pacote `medmnist`
procura por padrão, e rode os treinos **sem** a flag `--download`:

```bash
mkdir -p ~/.medmnist && cp dados/pneumoniamnist.npz ~/.medmnist/
```

No Windows a pasta é `C:\Users\<você>\.medmnist\`.

**Cuidado:** o `medmnist` não valida o conteúdo de um arquivo que já existe — ele só
verifica se o nome está lá e pula o download. Se houver um `pneumoniamnist.npz` de
outra origem nessa pasta, o treino roda em cima dele sem avisar. Confira o MD5 antes:

```bash
md5sum ~/.medmnist/pneumoniamnist.npz   # tem que dar 28209eda62fecd6e6a2d98b1501bb15f
```
