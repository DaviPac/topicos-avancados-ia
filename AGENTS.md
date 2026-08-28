# Workspace — Tópicos Avançados em IA

> Arquivo lido antes de qualquer tarefa, tanto pelo Claude Code quanto pelo opencode.
> Inspirado em https://github.com/lsfcin/workspace (versão enxuta para a disciplina).

## Para que serve

Uma pasta única que junta **as duas metades da disciplina**: o **código** dos
experimentos e o **artigo científico** (relatórios técnicos que evoluem até o paper
final). Tudo versionado no git.

**Princípio central:** o sistema de arquivos é a fonte da verdade. O que importa é
um arquivo salvo e versionado — nunca só a memória de um chat.

## Regras

- **NÃO ASSUMA.** Se houver dúvida sobre a intenção, pergunte ao usuário antes de agir.
- **EDITAR VENCE CRIAR.** Melhorar um arquivo existente é melhor do que criar um novo.
- **SEGREDOS FORA DO GIT.** Token, senha, chave de API vão em `segredos.env`
  (gitignorado). No texto versionado fica só o rótulo, nunca o valor.
- **ARQUIVOS PEQUENOS.** Um arquivo de código acima de ~200 linhas quase sempre são
  dois arquivos — separe em vez de deixar crescer.
- **NADA DE COPIAR-COLAR.** Repetiu lógica? Extraia uma função ou módulo.
- **CORRIGIU BUG, ESCREVEU TESTE.** "Agora funciona" precisa virar um teste que prova.
- **GIT FLOW SEMPRE.** Nunca commitar direto em `main` ou `develop`. Detalhes em
  [`SPECS-git.md`](SPECS-git.md). Um hook local bloqueia o commit errado.
- **CADA PASTA TEM UM `CONTEXT.md`** dizendo o que é e como se organiza. Leia o
  `CONTEXT.md` da pasta antes de mexer nos arquivos dela.

## Mapa das pastas

| Pasta | O que vive aqui |
|-------|-----------------|
| [`code/`](code/CONTEXT.md) | Código dos experimentos. Um subdiretório por projeto. |
| [`papers/`](papers/CONTEXT.md) | O artigo em LaTeX. A pasta do artigo é sincronizada com o Overleaf. |

## Arquivos na raiz

| Arquivo | Papel |
|---------|-------|
| `AGENTS.md` | Este arquivo — regras + mapa. |
| `CLAUDE.md` | Só aponta para o `AGENTS.md`. |
| `opencode.json` | Faz o opencode também ler o `AGENTS.md`. |
| `SPECS-git.md` | As regras de Git Flow, com exemplos de comandos. |
| `README.md` | Explicação para humanos. |
| `segredos.env` | Chaves e tokens. **Gitignorado — nunca entra no repositório.** |
