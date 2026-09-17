import { criarDocumento, mensagemErroApi } from "./api.js";

export function formatarDataBr(data) {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}

const MESES_EXTENSO = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

export function formatarDataPorExtenso(data = new Date()) {
    const dataObj = data instanceof Date ? data : new Date(`${data}T00:00`);
    if (Number.isNaN(dataObj.getTime())) return '';
    return `${dataObj.getDate()} de ${MESES_EXTENSO[dataObj.getMonth()]} de ${dataObj.getFullYear()}`;
}

export function showToast(message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const icons = {
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    const icon = icons[type] || 'fa-check-circle';

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
    `;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export function validarCampos(campos) {
    const camposVazios = [];

    Object.entries(campos).forEach(([id, nome]) => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Elemento com ID '${id}' não encontrado no formulário`);
            return;
        }

        const valor = element.value?.trim();
        const invalido = !valor || valor === '#' || valor === 'Selecione uma das opções' || valor === 'Selecione o tipo de abono' || valor === 'Selecione o funcionário';

        if (invalido) {
            element.classList.add('campo-erro');
            camposVazios.push(nome);
        } else {
            element.classList.remove('campo-erro');
        }
    });

    if (camposVazios.length > 0) {
        const mensagem = `Por favor, preencha os seguintes campos: ${camposVazios.join(', ')}.`;
        showToast(mensagem, 'error');
        return false;
    }

    return true;
}

export function setBotaoLoading(button, isLoading, loadingText = 'Gerando...') {
    if (!button) return;
    if (!button.dataset.originalText) {
        button.dataset.originalText = button.innerHTML;
    }

    button.disabled = isLoading;
    button.innerHTML = isLoading
        ? `<span class="loading-spinner"></span> ${loadingText}`
        : button.dataset.originalText;
}

export function resetarFormulario(selector = '.form-control') {
    document.querySelectorAll(selector).forEach((input) => {
        if (input.tagName === 'SELECT') {
            input.value = input.querySelector('option')?.value || '';
        } else {
            input.value = '';
        }
        input.classList.remove('campo-erro');
    });
}

export function inicializarFormulario({ buttonId, onSubmit, onReset } = {}) {
    document.addEventListener('DOMContentLoaded', () => {
        const content = document.querySelector('.content');
        if (content) {
            content.scrollTop = 0;
        }
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
            if (content) {
                content.scrollTop = 0;
            }
            window.scrollTo(0, 0);
        });

        const botao = document.getElementById(buttonId);
        if (botao) {
            botao.addEventListener('click', onSubmit);
        }

        document.querySelectorAll('.form-control').forEach((input) => {
            input.addEventListener('change', function () {
                if (this.value) {
                    this.classList.remove('campo-erro');
                }
            });
        });

        const btnVoltar = document.querySelector('.btn-secondary');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => {
                resetarFormulario();
                if (onReset) {
                    onReset();
                }
            });
        }
    });
}

export function gerarDocumentoDocx({ modeloRelativo, dados, outputName, successMessage = 'Documento gerado com sucesso!', registro } = {}) {
    const serverURL = window.location.protocol + '//' + window.location.host;
    const modeloURL = `${serverURL}/${modeloRelativo.replace(/^\/+/, '')}`;

    return fetch(modeloURL)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status} - ${res.statusText}`);
            }
            return res.arrayBuffer();
        })
        .then(async (content) => {
            const zip = new PizZip(content);
            const doc = new window.docxtemplater().loadZip(zip);
            doc.setData(dados);
            doc.render();
            const blob = doc.getZip().generate({ type: 'blob' });
            saveAs(blob, outputName);

            if (registro?.type) {
                const dataHoje = new Date().toISOString().slice(0, 10);
                try {
                    await criarDocumento({
                        file: blob,
                        fileName: outputName,
                        name: `${registro.name || outputName} | ${dataHoje}`,
                        type: registro.type,
                        employeeId: registro.employeeId
                    });
                } catch (error) {
                    console.error('Erro ao salvar documento na API:', error);
                    showToast(`Documento gerado, mas não foi salvo no histórico: ${mensagemErroApi(error)}`, 'warning');
                    return;
                }
            }

            showToast(successMessage, 'success');
        })
        .catch((err) => {
            console.error('Erro ao gerar o documento:', err);
            showToast('Erro ao carregar o modelo. Certifique-se de acessar pelo servidor local (http://localhost:8000)', 'error');
            throw err;
        });
}
