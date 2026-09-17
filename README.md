# Sistema de Documentos — EMEF Alfredina Coelho

Aplicativo local (v3.0.0) para gerar documentos escolares em **Word (.docx)**. Preenche os dados na tela, aplica o modelo e baixa o arquivo pronto.

Também cadastra funcionários, controla abonos (até **6 por ano**) e guarda o histórico dos documentos gerados em uma API remota.

As pastas `modelos/` e `extras/` **não entram no Git** (arquivos da escola). A URL da API também não: fica só no `.env` da sua máquina.

---

## O que o sistema gera

| Tela | Uso |
| --- | --- |
| **Transferência** | Declaração de transferência |
| **Abonada** | Termo de abono de falta |
| **Dispensa** | Dispensa de funcionário |
| **Histórico escolar** | Histórico (incluindo modelo de transferência), notas e totais de aulas |
| **Matrícula** | Ficha de matrícula |
| **Documentos extras** | Download de prontuários, termos e requisições prontos |

### Gestão

- **Funcionários** — cadastro, edição e consulta de abonos
- **Histórico de documentos** — lista o que já foi gerado, com data e download

---

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Windows (para o app Electron e o instalador `.exe`)
- Internet (funcionários, abonos e histórico passam pela API)
- Pasta `modelos/` com os `.docx` de template
- Pasta `extras/` com os arquivos de download direto (opcional)

---

## Passo a passo (clonar e rodar)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a API

Copie o arquivo de exemplo e informe a URL da API (sem barra no final):

```bash
cp .env.example .env
```

No Windows (Git Bash) o comando acima funciona. No Prompt do Windows:

```bat
copy .env.example .env
```

Edite o `.env`:

```
API_ORIGIN=https://sua-api.exemplo.com
```

O servidor local faz proxy de `/api` para essa URL (evita CORS). O front **não** guarda o endereço da API no código.

### 3. Colocar os modelos Word

Crie a pasta `modelos/` na raiz do projeto e coloque os `.docx` usados pelos formulários. Os placeholders precisam bater com os nomes nos scripts em `assets/js/` (ex.: `{nome}`).

Sem esses arquivos a geração do Word falha ao buscar o modelo.

### 4. Colocar os documentos extras (opcional)

Crie `extras/` na raiz. Dentro dela:

- os arquivos para download (`.docx`, `.xlsx`, etc.)
- um `documentos.json` listando o que aparece na tela **Documentos Extras**:

```json
[
  {
    "nome": "Nome amigável na tela",
    "arquivo": "arquivo-real.docx"
  }
]
```

O campo `arquivo` deve ser o nome exato do arquivo na pasta `extras/`.

### 5. Subir o sistema

**Navegador:**

```bash
npm start
```

Abra [http://localhost:8000](http://localhost:8000).

**App desktop:**

```bash
npm run app
```

Sobe o servidor na porta **8000** e abre o Electron.

---

## Instalador Windows

```bash
npm run dist
```

O instalador fica em:

`dist/Sistema de Documentos Setup 3.0.0.exe`

Envie **esse** arquivo. Não envie só o `.exe` de `dist/win-unpacked/` — ele depende da pasta inteira.

O PC de destino precisa de Windows 64 bits e internet. Não precisa de Node nem desta pasta do projeto. O `.env` precisa estar no pacote no momento do `npm run dist` (o Electron usa o mesmo `server.js`).

---

## Estrutura

```
├── index.html
├── main.js                 # Electron
├── server.js               # Estáticos + proxy da API
├── .env.example            # Modelo da URL da API
├── .env                    # URL real (não versionado)
├── modelos/                # Templates .docx (não versionado)
├── extras/                 # Downloads prontos (não versionado)
└── assets/
    ├── css/style.css
    ├── js/
    └── pages/
```

Geração dos documentos: **PizZip + docxtemplater + FileSaver** (CDN). Comunicação com a API: **Axios** via `/api`.

---

## API

Rotas usadas pelo proxy (`API_ORIGIN` + caminho):

| Recurso | Função |
| --- | --- |
| `/employees` | Funcionários |
| `/allowance` | Abonos |
| `/docs` | Histórico e upload do Word gerado |

Cada funcionário pode ter no máximo **6 abonos por ano**. Excluir o documento gerado **não** libera a vaga; é preciso excluir o registro em `/allowance`.

---

## Scripts npm

| Comando | O que faz |
| --- | --- |
| `npm start` | Servidor em `http://localhost:8000` |
| `npm run app` | Abre o Electron |
| `npm run dist` | Gera o instalador NSIS para Windows |

---

## Autor

[Gabriel Aguera Baria](https://github.com/gabrielbariaguera)
