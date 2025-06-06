#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

PORT = 8000

class SimpleDocHandler(http.server.SimpleHTTPRequestHandler):
    # Adiciona headers CORS para permitir requisições locais
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        http.server.SimpleHTTPRequestHandler.end_headers(self)
    
    # Correção para tipos MIME dos arquivos .docx
    def guess_type(self, path):
        mimetype = http.server.SimpleHTTPRequestHandler.guess_type(self, path)
        if path.endswith('.docx'):
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        return mimetype
    
    # Log mais simples
    def log_message(self, format, *args):
        if args[0].startswith('GET'):
            sys.stderr.write(" -> %s\n" % args[1])

# Garantir que o servidor seja executado no diretório do projeto
diretorio_atual = os.path.dirname(os.path.abspath(__file__))
os.chdir(diretorio_atual)

# Verificar se os modelos existem
modelo1 = os.path.join(diretorio_atual, "modelos", "DECLARAÇÃO OFICIAL - ESCOLARIDADE.docx")
modelo2 = os.path.join(diretorio_atual, "modelos", "DECLARAÇÃO OFICIAL - TRANSFERÊNCIA.docx")

print("\n== Verificando arquivos de modelo ==")
if not os.path.isdir(os.path.join(diretorio_atual, "modelos")):
    print("ERRO: A pasta 'modelos' não foi encontrada!")
    print(f"Criando pasta 'modelos' em: {os.path.join(diretorio_atual, 'modelos')}")
    os.makedirs(os.path.join(diretorio_atual, "modelos"), exist_ok=True)

if not os.path.isfile(modelo1):
    print(f"AVISO: O modelo 'DECLARAÇÃO OFICIAL - ESCOLARIDADE.docx' não foi encontrado!")
    print(f"Procurado em: {modelo1}")
else:
    print(f"✓ Modelo de Escolaridade encontrado")

if not os.path.isfile(modelo2):
    print(f"AVISO: O modelo 'DECLARAÇÃO OFICIAL - TRANSFERÊNCIA.docx' não foi encontrado!")
    print(f"Procurado em: {modelo2}")
else:
    print(f"✓ Modelo de Transferência encontrado")

print("\n== Iniciando servidor ==")
print(f"Servidor rodando em: http://localhost:{PORT}")
print("Acesse a URL acima no seu navegador para usar o sistema")
print("Pressione Ctrl+C para encerrar o servidor")

try:
    with socketserver.TCPServer(("", PORT), SimpleDocHandler) as httpd:
        print("\n== Servidor pronto ==")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServidor encerrado pelo usuário.")
except OSError as e:
    if e.errno == 48:  # Porta já em uso
        print(f"\nERRO: A porta {PORT} já está em uso.")
        print("Pode ser que o servidor já esteja rodando em outra janela.")
        print("Tente acessar: http://localhost:8000")
        print("Ou encerre o processo anterior e tente novamente.")
    else:
        print(f"\nERRO: {e}")
