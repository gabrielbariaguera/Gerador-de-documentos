import { baixarDocumentoArquivo, excluirDocumento, listarDocumentos, mensagemErroApi } from "./api.js";
import { showToast } from "./utils.js";

const TIPOS = {
    allowance: 'Abono',
    exemption: 'Dispensa',
    transfer: 'Transferência',
    schooling: 'Histórico escolar',
    enrollment: 'Matrícula'
};

function dataDoDocumento(documento) {
    const created = documento.createdAt || documento.created_at || documento.updatedAt;
    if (created) {
        return String(created).slice(0, 10);
    }

    const match = String(documento.name || '').match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '';
}

function formatarDataExibicao(iso) {
    if (!iso) return '-';
    const [ano, mes, dia] = String(iso).split('-');
    if (!dia || !mes || !ano) return iso;
    return `${dia.padStart(2, '0')}-${mes.padStart(2, '0')}-${ano}`;
}

function rotuloTipo(tipo) {
    return TIPOS[tipo] || tipo || '-';
}

function renderizarDocumentos(documentos) {
    const corpo = document.getElementById('tabelaDocumentos');
    if (!corpo) return;

    if (!documentos.length) {
        corpo.innerHTML = '<tr><td colspan="5">Nenhum documento encontrado.</td></tr>';
        return;
    }

    corpo.innerHTML = documentos.map((documento) => `
        <tr>
            <td>${formatarDataExibicao(dataDoDocumento(documento))}</td>
            <td>${documento.name || '-'}</td>
            <td>${rotuloTipo(documento.type)}</td>
            <td>${documento.fileName || '-'}</td>
            <td>
                <button type="button" class="btn btn-primary" data-download="${documento.id}" data-filename="${documento.fileName || 'documento.docx'}">
                    <i class="fas fa-download"></i>
                </button>
                <button type="button" class="btn btn-secondary" data-excluir="${documento.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function carregarDocumentos() {
    const tipo = document.getElementById('filtroTipo')?.value || '';
    const data = document.getElementById('filtroData')?.value || '';

    try {
        const documentos = await listarDocumentos();
        const filtrados = documentos
            .filter((documento) => !tipo || documento.type === tipo)
            .filter((documento) => !data || dataDoDocumento(documento) === data)
            .sort((a, b) => (b.id || 0) - (a.id || 0));

        renderizarDocumentos(filtrados);
    } catch (error) {
        document.getElementById('tabelaDocumentos').innerHTML = '<tr><td colspan="5">Erro ao carregar o histórico.</td></tr>';
        showToast(mensagemErroApi(error), 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDocumentos();

    document.getElementById('filtroTipo')?.addEventListener('change', carregarDocumentos);
    document.getElementById('filtroData')?.addEventListener('change', carregarDocumentos);
    document.getElementById('btnLimparFiltros')?.addEventListener('click', () => {
        document.getElementById('filtroTipo').value = '';
        document.getElementById('filtroData').value = '';
        carregarDocumentos();
    });

    document.getElementById('tabelaDocumentos')?.addEventListener('click', async (event) => {
        const botaoDownload = event.target.closest('[data-download]');
        const botaoExcluir = event.target.closest('[data-excluir]');

        if (botaoDownload) {
            try {
                const resposta = await baixarDocumentoArquivo(botaoDownload.dataset.download);
                saveAs(resposta.data, botaoDownload.dataset.filename);
            } catch (error) {
                showToast(mensagemErroApi(error), 'error');
            }
        }

        if (botaoExcluir) {
            try {
                await excluirDocumento(botaoExcluir.dataset.excluir);
                showToast('Documento removido do histórico.');
                await carregarDocumentos();
            } catch (error) {
                showToast(mensagemErroApi(error), 'error');
            }
        }
    });
});
