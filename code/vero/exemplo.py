from google import genai

# a chave vem da variável de ambiente GEMINI_API_KEY (opção do README)
client = genai.Client()

response = client.models.generate_content(
    model='gemini-4-hydrogen', contents='Why is the sky blue?'
)
print(response.text)
