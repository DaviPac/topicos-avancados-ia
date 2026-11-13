# exemplo oficial do SDK google-genai, trecho "Generate Content" do README:
# https://github.com/googleapis/python-genai#generate-content
# única escolha: o cliente lê a chave da variável GEMINI_API_KEY, opção que o próprio README oferece.
# alteração mínima do vero: a entrada é o print de um post + as checagens achadas na Lupa e na Boatos.org;
# a saída é o veredito da lupa.
# terceiro commit: sem checagem nas agências, o Gemini busca na web (Google Search).
import re
import sys

import pytesseract
import requests
from google import genai
from google.genai import types
from PIL import Image

AGENCIAS = ['https://agencialupa.org', 'https://www.boatos.org']

client = genai.Client()

for print_do_post in sys.argv[1:]:
    post = pytesseract.image_to_string(Image.open(print_do_post), lang='por')
    palavras = client.models.generate_content(
        model='gemini-3.8-flash',
        contents=f'Dê 2 ou 3 palavras-chave, em português, separadas por espaço, para buscar checagens deste post:\n{post}'
    ).text.strip()
    checagens = '\n'.join(
        f'- {re.sub("<[^>]+>", "", c["title"]["rendered"])} | {c["link"]}'
        for agencia in AGENCIAS
        for c in requests.get(f'{agencia}/wp-json/wp/v2/posts', params={'search': palavras, 'per_page': 5},
                              headers={'User-Agent': 'Mozilla/5.0'}, timeout=30).json()
    )
    response = client.models.generate_content(
        model='gemini-3.8-flash', contents=f'''Post lido da tela:
{post}
Checagens publicadas por agências brasileiras:
{checagens}
Compare o post com as checagens. Responda em 3 linhas:
veredito: confirmado, incoerente ou não tem certeza
checagem: o título da checagem que bate, ou "nenhuma"
link: o link dela, ou "nenhum"'''
    )
    if 'checagem: nenhuma' in response.text:
        response = client.models.generate_content(
            model='gemini-3.8-flash', contents=f'''Post lido da tela:
{post}
Nenhuma agência brasileira checou este post. Busque na internet e responda em 3 linhas:
veredito: confirmado, incoerente ou não tem certeza
fonte: o título da fonte mais confiável que você achou, ou "nenhuma"
link: o link dela, ou "nenhum"''',
            config=types.GenerateContentConfig(tools=[types.Tool(google_search=types.GoogleSearch())])
        )
    print(print_do_post)
    print('  lido:', ' '.join(post.split())[:200])
    print('  busca:', palavras)
    if 'fonte:' in response.text:
        print('  sem checagem nas agências: busca na web')
    print(response.text)
    metadados = response.candidates[0].grounding_metadata
    for fonte in (metadados.grounding_chunks or []) if metadados else []:
        print('  fonte da busca:', fonte.web.title, '|', fonte.web.uri)
