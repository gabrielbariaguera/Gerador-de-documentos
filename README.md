# Sistema de Geração de Declarações

Este é um aplicativo web local para geração de declarações escolares em formato Word (.docx) com interface moderna para ambiente de escritório. O sistema permite selecionar um tipo de documento, preencher informações do aluno e gerar um documento automaticamente.

## Requisitos

- Python 3.x
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Arquivos de modelo (.docx) na pasta `modelos/`

## Como utilizar

### Método 1: Usando o script de inicialização (Recomendado)

1. Abra o Terminal (você pode pesquisar por "Terminal" no Spotlight do Mac)
2. Navegue até a pasta do projeto:
   ```
   cd /Users/arielaio/Desktop/Projetos/Gerador-de-declaracoes
   ```
3. Execute o script de inicialização:
   ```
   ./iniciar.sh
   ```
4. O navegador abrirá automaticamente com o aplicativo
5. Quando terminar de usar, volte ao Terminal e pressione Ctrl+C para encerrar o servidor

### Método 2: Iniciando manualmente

1. Abra o Terminal
2. Navegue até a pasta do projeto:
   ```
   cd /Users/arielaio/Desktop/Projetos/Gerador-de-declaracoes
   ```
3. Inicie o servidor Python:
   ```
   python3 server.py
   ```
4. Abra o navegador e acesse: http://localhost:8000
5. Quando terminar, volte ao Terminal e pressione Ctrl+C para encerrar o servidor

## Diagnóstico

Se encontrar problemas ao usar o sistema, execute o script de diagnóstico:

```
./diagnostico.sh
```

Este script verificará automaticamente a estrutura de arquivos, permissões e disponibilidade de portas.

## Solução de Problemas

- **O botão não funciona**
  - Certifique-se de estar acessando pelo servidor local (http://localhost:8000)
  - Verifique se todos os campos do formulário estão preenchidos

- **Erro ao carregar o modelo**: 
  - Certifique-se de que está acessando o aplicativo via http://localhost:8000 e não abrindo o arquivo HTML diretamente
  - Verifique se os arquivos de modelo estão na pasta "modelos" e se os nomes estão corretos, incluindo acentos

- **Servidor não inicia**:
  - Verifique se a porta 8000 já está em uso
  - Certifique-se que Python 3.x está instalado

## Estrutura de arquivos

- `index.html` - Interface do usuário
- `style.css` - Estilos e aparência
- `script.js` - Lógica de funcionamento
- `server.py` - Servidor HTTP local
- `iniciar.sh` - Script de inicialização
- `diagnostico.sh` - Script de diagnóstico
- `modelos/` - Pasta com templates de documentos
