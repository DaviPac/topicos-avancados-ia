# code/

> Código dos experimentos da disciplina. Um subdiretório por projeto.

## Como organizar

- Cada projeto = uma pasta aqui dentro (ex.: `code/baseline/`, `code/experimento-folding/`).
- Cada projeto tem, no mínimo:
  - `README.md` — o que é, como rodar.
  - `CONTEXT.md` — mapa interno do projeto (para o agente).
- Projeto grande ou que vai virar repositório próprio pode ter o seu próprio
  `git init` — nesse caso, adicione a pasta dele ao `.gitignore` da raiz do
  workspace, do mesmo jeito que `papers/artigo/`.

## Regras (do `AGENTS.md`)

- Arquivos pequenos: avisa em ~150 linhas, evite passar de ~200.
- Nada de copiar-colar: extraia função/módulo.
- Corrigiu bug → escreveu teste que prova a correção.
- Leia o arquivo antes de editar; procure quem chama a função antes de mudá-la.

## Git

Segue o Git Flow de [`../SPECS-git.md`](../SPECS-git.md): trabalho em
`feature/<nome>`, nunca commit direto em `main`/`develop`.
