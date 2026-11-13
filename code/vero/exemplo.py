# exemplo oficial do SDK google-genai, trecho "Generate Content" do README:
# https://github.com/googleapis/python-genai#generate-content
# única escolha: o cliente lê a chave da variável GEMINI_API_KEY, opção que o próprio README oferece.
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model='gemini-3.8-flash', contents='Why is the sky blue?'
)
print(response.text)
