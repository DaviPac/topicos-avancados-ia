# Workspace — Tópicos Avançados em IA

Pasta única de trabalho da disciplina, juntando **código** e **artigo científico**
no mesmo lugar, tudo versionado no git. É uma versão enxuta do
[`lsfcin/workspace`](https://github.com/lsfcin/workspace) do professor.

## Estrutura

```
workspace/
  AGENTS.md        regras + mapa (lido pelo Claude Code e pelo opencode)
  CLAUDE.md        aponta para o AGENTS.md
  opencode.json    aponta o opencode para o AGENTS.md
  SPECS-git.md     regras de Git Flow com exemplos
  segredos.env     chaves/tokens — NÃO versionado
  code/            experimentos (um subdiretório por projeto)
  papers/
    artigo/        o artigo em LaTeX — sincronizado com o Overleaf
```

## Como usar

Abra o harness (Claude Code ou opencode) **com esta pasta como diretório atual**:

```powershell
cd C:\Users\Usuário\Desktop\codigos\AAA\IA\workspace
claude          # harness principal
# ou
opencode        # harness de backup
```

Ele lê o `AGENTS.md` sozinho e já sabe as regras e onde fica cada coisa.

## Git Flow (resumo)

- Trabalho novo sai de `develop` numa branch `feature/<nome>`.
- Nunca se commita direto em `main` nem em `develop` (um hook local bloqueia).
- `develop` = integração; `main` = versões estáveis com tag.
- Detalhes e comandos: [`SPECS-git.md`](SPECS-git.md).

## O artigo (pasta `papers/artigo/`)

É um repositório git separado, ligado ao **Overleaf** do professor. O conteúdo do
artigo mora no Overleaf, não é duplicado no GitHub. Para compilar o PDF localmente
e para sincronizar, veja [`papers/CONTEXT.md`](papers/CONTEXT.md).
