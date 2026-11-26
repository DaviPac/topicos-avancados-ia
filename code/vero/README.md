# vero

Técnica central do Vero (Gemini, pelo SDK [google-genai](https://github.com/googleapis/python-genai)),
rodando a partir do código-fonte. Folha: `va2/tec.md`.

## rodar

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
set -a && . ../../segredos.env && set +a   # define GEMINI_API_KEY, fora do git
.venv/bin/python exemplo.py prints-cinza/*.jpg
```

`exemplo.py` recebe prints de posts (já preparados em tons de cinza, em `prints-cinza/`), lê o
texto com o Tesseract e pede ao Gemini, com a busca na internet ligada, o veredito da lupa.

Partiu do trecho "Generate Content" do README do google-genai (commit 997c85d), que só mudava a forma de
ler a chave da variável de ambiente `GEMINI_API_KEY` (opção oferecida pelo próprio README).
