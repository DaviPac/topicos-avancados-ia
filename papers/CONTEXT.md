# papers/

> O artigo científico da disciplina, em LaTeX.

## `artigo/` — o artigo

`papers/artigo/` é um **repositório git separado**, cujo `remote` é o projeto do
professor no **Overleaf**. O conteúdo do artigo mora no Overleaf; o repositório do
workspace (no GitHub) **não** guarda esse conteúdo — a pasta está no `.gitignore`
da raiz.

Por que assim: no Overleaf os co-autores editam direto pelo site. Tratar o Overleaf
como a fonte autoritativa evita conflito. O git local serve para escrever com o
agente, compilar rápido e ter histórico fino.

## Sincronizar com o Overleaf

Sempre **puxar antes de enviar**:

```powershell
cd C:\Users\Usuário\Desktop\codigos\AAA\IA\workspace\papers\artigo
git pull --rebase        # traz o que os co-autores mudaram no site
# ... escreve / edita ...
git add -A
git commit -m "reescreve a seção de método"
git push                 # manda de volta pro Overleaf
```

Se der conflito: preserve a edição que veio do Overleaf e reaplique a sua por cima.

O token de acesso ao Overleaf fica no **Gerenciador de Credenciais do Windows**
(cofre do sistema), não em arquivo. Se o `git push`/`pull` pedir senha, o valor é
o token `olp_...` (usuário: `git`).

## Compilar o PDF localmente (MiKTeX)

O projeto que veio do Overleaf é o **template Springer LNCS**; o arquivo principal
é **`samplepaper.tex`** (renomeie quando o artigo tomar forma, e ajuste aqui).

```powershell
cd C:\Users\Usuário\Desktop\codigos\AAA\IA\workspace\papers\artigo
latexmk -pdf -halt-on-error -interaction=nonstopmode samplepaper.tex
```

Para classes que exigem fontes do sistema (`fontspec`), troque `-pdf` por `-xelatex`.

Limpar e recompilar do zero:

```powershell
latexmk -C
latexmk -pdf -halt-on-error -interaction=nonstopmode samplepaper.tex
```

O MiKTeX já está configurado para **baixar pacotes que faltam automaticamente**
(`initexmf --set-config-value "[MPM]AutoInstall=1"`), então a primeira compilação
pode demorar um pouco mas não trava pedindo confirmação.

## Escrita (herdado do workspace do professor)

- Cada afirmação precisa de fonte, experimento ou derivação. Todo número rastreia
  até um script, tabela ou log.
- Defina cada termo uma vez e use sempre igual. A lacuna que a introdução abre é a
  que a conclusão fecha.
- Commits pequenos e revisáveis, em vez de reescritas gigantes.
