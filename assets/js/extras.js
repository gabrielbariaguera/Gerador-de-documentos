import { showToast } from "./utils.js";

const CAMINHO_EXTRAS = "../../extras";

function obterIconePorArquivo(nomeArquivo) {
    const extensao = nomeArquivo.split('.').pop()?.toLowerCase() || '';

    const icones = {
        docx: 'fa-file-word',
        doc: 'fa-file-word',
        xlsx: 'fa-file-excel',
        xls: 'fa-file-excel',
        pdf: 'fa-file-pdf',
        pptx: 'fa-file-powerpoint',
        ppt: 'fa-file-powerpoint'
    };

    return icones[extensao] || 'fa-file';
}

function baixarDocumento(arquivo) {
    const link = document.createElement('a');
    link.href = `${CAMINHO_EXTRAS}/${encodeURIComponent(arquivo)}`;
    link.download = arquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function criarItemDocumento({ nome, arquivo }) {
    const item = document.createElement('div');
    item.className = 'card extras-item';

    item.innerHTML = `
        <div class="extras-item-info">
            <i class="fas ${obterIconePorArquivo(arquivo)}"></i>
            <div>
                <strong>${nome}</strong>
                <span>${arquivo}</span>
            </div>
        </div>
        <button type="button" class="btn btn-primary extras-download-btn">
            <i class="fas fa-download"></i> Download
        </button>
    `;

    item.querySelector('.extras-download-btn').addEventListener('click', () => {
        baixarDocumento(arquivo);
    });

    return item;
}

function renderizarDocumentos(documentos) {
    const container = document.getElementById('listaDocumentosExtras');
    if (!container) return;

    container.innerHTML = '';

    if (!documentos.length) {
        container.innerHTML = `
            <div class="card extras-empty">
                <i class="fas fa-folder-open"></i>
                <p>Nenhum documento extra disponível no momento.</p>
            </div>
        `;
        return;
    }

    documentos.forEach((documento) => {
        container.appendChild(criarItemDocumento(documento));
    });
}

function carregarDocumentosExtras() {
    fetch(`${CAMINHO_EXTRAS}/documentos.json`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status}`);
            }
            return res.json();
        })
        .then((documentos) => {
            renderizarDocumentos(Array.isArray(documentos) ? documentos : []);
        })
        .catch((error) => {
            console.error('Erro ao carregar documentos extras:', error);
            showToast('Erro ao carregar a lista de documentos. Acesse pelo servidor local (http://localhost:8000).', 'error');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.content');
    if (content) {
        content.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    carregarDocumentosExtras();
});
