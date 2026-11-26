# vero

Técnica central do Vero (Gemini, pelo SDK [google-genai](https://github.com/googleapis/python-genai)),
rodando a partir do código-fonte. Folha: `va2/tec.md`.

## rodar

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
set -a && . ../../segredos.env && set +a   # define GEMINI_API_KEY, fora do git
.venv/bin/python exemplo.py
```

`exemplo.py` é o trecho "Generate Content" do README do google-genai, sem mudanças além de
ler a chave da variável de ambiente `GEMINI_API_KEY` (opção oferecida pelo próprio README).
