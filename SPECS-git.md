# Git Flow

> Quais branches existem, o que pode ser commitado onde, e quando o trabalho sobe.
> Vale para: o repositório do workspace e cada projeto dentro de `code/`.
> A pasta `papers/artigo/` é **exceção** — lá o Overleaf manda, e se commita direto.

## Branches

| Branch | Para quê |
|--------|----------|
| `main` | Só versões estáveis, com tag (`v1.0`, `v1.1`, ...). |
| `develop` | Integração — toda feature termina aqui. |
| `feature/<nome>` | Trabalho novo. Sai de `develop` e volta para `develop`. |
| `release/<versão>` | Estabilização antes de uma entrega. Sai de `develop`, entra em `main` e `develop`. |
| `hotfix/<nome>` | Correção urgente. Sai de `main`, entra em `main` e `develop`. |

## Regras

- Nunca commitar direto em `main` ou `develop`.
- `develop` sempre tem que compilar / passar nos testes.
- Uma `feature/*` = um assunto só, e dura pouco.
- Junta-se `feature` em `develop` por *merge* (idealmente via Pull Request no GitHub).
- A cada entrega estável, cria-se uma tag em `main`: `git tag v1.0`.

## Trava automática

O hook `.githooks/pre-commit` **bloqueia** qualquer commit feito estando em
`main` ou `develop`, ou numa branch que não seja `feature/*`, `release/*` ou
`hotfix/*`. Ele é ativado neste repositório por:

```
git config core.hooksPath .githooks
```

Emergência (pula a trava, deixa rastro no histórico — use com parcimônia):

```
git commit --no-verify
```

## Fluxo do dia a dia

```powershell
# começar algo novo
git checkout develop
git pull
git checkout -b feature/experimento-baseline

# ... trabalha, faz vários commits pequenos ...
git add -A
git commit -m "adiciona baseline com regressão linear"

# terminou a feature: manda pro GitHub e abre PR para develop
git push -u origin feature/experimento-baseline
gh pr create --base develop --fill

# depois do merge, atualiza develop local
git checkout develop
git pull

# entrega estável
git checkout main
git merge --no-ff develop
git tag v1.0
git push --tags && git push
```
