import sys

from google import genai
from google.genai import types
from PIL import Image
import pytesseract

# a chave vem da variável de ambiente GEMINI_API_KEY (opção do README)
client = genai.Client()

for imagem in sys.argv[1:]:
    texto = pytesseract.image_to_string(Image.open(imagem), lang='por')
    response = client.models.generate_content(
        model='gemini-4-hydrogen',
        contents='Busque na internet e diga se o post abaixo é: confirmado, incoerente '
                 'ou não tem certeza. Responda em uma linha: "veredito: <rótulo>".\n\n' + texto,
        config=types.GenerateContentConfig(tools=[types.Tool(google_search=types.GoogleSearch())]),
    )
    print(imagem)
    print(response.text)
    busca = response.candidates[0].grounding_metadata
    for fonte in (busca.grounding_chunks or []) if busca else []:
        print('fonte:', fonte.web.title, '|', fonte.web.uri)
