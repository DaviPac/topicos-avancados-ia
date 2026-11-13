# vero · tecnologia base

Técnica central do Vero rodando a partir do código-fonte: o Gemini, pelo SDK
[google-genai](https://github.com/googleapis/python-genai), compara um post com checagens publicadas.

## como rodar

```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
set -a; . ../../segredos.env; set +a   # define GEMINI_API_KEY (gitignorado)
python exemplo.py
```

A chave sai do [Google AI Studio](https://aistudio.google.com/apikey) e fica só no `segredos.env` da raiz.
