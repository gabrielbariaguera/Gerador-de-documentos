#!/bin/zsh

# Cores para saída no terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}=== Sistema de Geração de Declarações ===${NC}"
echo "${YELLOW}Iniciando o servidor...${NC}"

# Verifica se o diretório de modelos existe
if [ ! -d "./modelos" ]; then
  echo "${YELLOW}AVISO: Pasta 'modelos' não encontrada. Criando...${NC}"
  mkdir -p modelos
  echo "${GREEN}✓ Pasta 'modelos' criada${NC}"
fi

# Verifica se os modelos estão presentes
MODELO1="./modelos/DECLARAÇÃO OFICIAL - ESCOLARIDADE.docx"
MODELO2="./modelos/DECLARAÇÃO OFICIAL - TRANSFERÊNCIA.docx"

echo "${BLUE}Verificando modelos de documentos...${NC}"
ERRO_MODELOS=0

if [ ! -f "$MODELO1" ]; then
  echo "${YELLOW}AVISO: Modelo de escolaridade não encontrado:${NC}"
  echo "  - $MODELO1"
  ERRO_MODELOS=1
else
  echo "${GREEN}✓ Modelo de escolaridade encontrado${NC}"
fi

if [ ! -f "$MODELO2" ]; then
  echo "${YELLOW}AVISO: Modelo de transferência não encontrado:${NC}"
  echo "  - $MODELO2"
  ERRO_MODELOS=1
else
  echo "${GREEN}✓ Modelo de transferência encontrado${NC}"
fi

if [ $ERRO_MODELOS -eq 1 ]; then
  echo "${YELLOW}Alguns modelos de documento estão faltando.${NC}"
  echo "O sistema pode não funcionar corretamente sem esses arquivos."
fi

# Abre o navegador
(sleep 1 && open http://localhost:8000) &

# Inicia o servidor Python
python3 server.py
