# vero · tecnologia base

Técnica central do Vero rodando a partir do código-fonte: o Gemini, pelo SDK
[google-genai](https://github.com/googleapis/python-genai), compara o print de um post com checagens publicadas.

O que o `exemplo.py` faz com cada print: OCR (Tesseract, em tons de cinza) → o Gemini tira 2 ou 3 palavras-chave →
busca na API do WordPress da Lupa e da Boatos.org → o Gemini dá o veredito (confirmado, incoerente ou não tem
certeza) → sem checagem nas agências, o Gemini busca na web (Google Search) e mostra as fontes da busca.

## como rodar

```bash
sudo apt install tesseract-ocr tesseract-ocr-por
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
set -a; . ../../segredos.env; set +a   # define GEMINI_API_KEY (gitignorado)
python exemplo.py prints/*.jpg
```

A chave sai do [Google AI Studio](https://aistudio.google.com/apikey) e fica só no `segredos.env` da raiz.
O exemplo oficial, sem alteração, está no commit `cbb1724`.
