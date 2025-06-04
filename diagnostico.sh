#!/bin/zsh

# Cores para saída no terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}=== Diagnóstico do Sistema de Geração de Declarações ===${NC}"

# Verificar estrutura de diretórios
echo "\n${BLUE}Verificando estrutura de arquivos:${NC}"

# Lista de arquivos necessários
ARQUIVOS=(
  "index.html"
  "style.css"
  "script.js"
  "server.py"
  "modelos/DECLARAÇÃO OFICIAL - ESCOLARIDADE.docx"
  "modelos/DECLARAÇÃO OFICIAL - TRANSFERÊNCIA.docx"
)

for arquivo in "${ARQUIVOS[@]}"
do
  if [ -f "$arquivo" ]; then
    echo "${GREEN}✓ $arquivo encontrado${NC}"
  else
    echo "${RED}✗ $arquivo não encontrado${NC}"
  fi
done

# Verificar permissões
echo "\n${BLUE}Verificando permissões de execução:${NC}"
if [ -x "./server.py" ]; then
  echo "${GREEN}✓ server.py tem permissão de execução${NC}"
else
  echo "${YELLOW}! server.py não tem permissão de execução${NC}"
  echo "  Corrigindo permissão..."
  chmod +x ./server.py
  echo "${GREEN}✓ Permissão corrigida${NC}"
fi

if [ -x "./iniciar.sh" ]; then
  echo "${GREEN}✓ iniciar.sh tem permissão de execução${NC}"
else
  echo "${YELLOW}! iniciar.sh não tem permissão de execução${NC}"
  echo "  Corrigindo permissão..."
  chmod +x ./iniciar.sh
  echo "${GREEN}✓ Permissão corrigida${NC}"
fi

# Verificar se a porta 8000 está em uso
echo "\n${BLUE}Verificando disponibilidade da porta 8000:${NC}"
if lsof -i :8000 > /dev/null ; then
  echo "${YELLOW}! A porta 8000 já está em uso${NC}"
  echo "  Isso pode causar problemas ao iniciar o servidor."
  echo "  Processos usando a porta 8000:"
  lsof -i :8000
else
  echo "${GREEN}✓ Porta 8000 disponível${NC}"
fi

# Verificar a instalação do Python
echo "\n${BLUE}Verificando o Python:${NC}"
if command -v python3 > /dev/null; then
  PYTHON_VERSION=$(python3 --version)
  echo "${GREEN}✓ $PYTHON_VERSION instalado${NC}"
else
  echo "${RED}✗ Python3 não encontrado${NC}"
  echo "  O servidor requer Python3 para funcionar."
fi

echo "\n${BLUE}Diagnóstico concluído.${NC}"
echo "Para iniciar o sistema, execute: ./iniciar.sh"
