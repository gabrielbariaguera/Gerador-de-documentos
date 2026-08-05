// Formata data de YYYY-MM-DD para DD/MM/YYYY
export function formatarDataBr(data) {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}

export const funcionarios = {
    agnaldo: { nomeCompleto: "AGNALDO MAURICIO DA SILVA", cod: "633", cargo: "SERVIÇOS GERAIS" },
    aline: { nomeCompleto: "ALINE ROSSI ROMERO", cod: "377", cargo: "ASSISTENTE SOCIAL" },
    cacilda: { nomeCompleto: "CACILDA RIBEIRO LEAL DE MORAIS", cod: "376", cargo: "SERVIÇOS GERAIS" },
    carolina: { nomeCompleto: "CAROLINA CONSTANTINO BUENO", cod: "296", cargo: "PEB II" },
    celia: { nomeCompleto: "CÉLIA DO CARMO TOSTA", cod: "231", cargo: "INSPETOR DE ALUNO" },
    claudiana: { nomeCompleto: "CLAUDIANA DE JESUS MORAIS", cod: "626", cargo: "SERVIÇOS GERAIS" },
    eliad: { nomeCompleto: "ELIAD GARCIA RAMOS PRADO", cod: "298", cargo: "PEB I" },
    eliane: { nomeCompleto: "ELIANE CRISTINA DA COSTA", cod: "305", cargo: "PEB I" },
    elinety: { nomeCompleto: "ELINETY LOURENÇO DE SOUZA SANTOS", cod: "395", cargo: "SERVIÇOS GERAIS" },
    endagabi: { nomeCompleto: "ENDAGABI MUNIQUI DE OLIVEIRA FERNANDES", cod: "", cargo: "" },
    izabel: { nomeCompleto: "IZABEL CRISTINA DE PAULA MARANGONI", cod: "620", cargo: "PEB I" },
    julia: { nomeCompleto: "JÚLIA DE LIMA BATISTA", cod: "654", cargo: "ESCRITURÁRIO I" },
    marcia: { nomeCompleto: "MARCIA CELESTINA RAMOS", cod: "", cargo: "" },
    marinei: { nomeCompleto: "MARINEI DE FÁTIMA ELOI FRANÇA", cod: "309", cargo: "PEB I" },
    marlei: { nomeCompleto: "MARLEI DE LIMA NANYA FELIPE", cod: "602", cargo: "PEB I" },
    mathias: { nomeCompleto: "MATHIAS ROBERTO BATISTA", cod: "299", cargo: "PEB II" },
    neuci: { nomeCompleto: "NEUCI DIAS RODRIGUES", cod: "301", cargo: "PEB I" },
    nisleia: { nomeCompleto: "NISLÉIA FERNANDA DE SOUZA SANTOS", cod: "643", cargo: "PEB I" },
    rosana: { nomeCompleto: "ROSANA APARECIDA DOS SANTOS", cod: "341", cargo: "INSPETOR DE ALUNO" },
    rosimar: { nomeCompleto: "ROSIMAR ANTÔNIA POSSEBON", cod: "338", cargo: "MERENDEIRA" },
    rosineia: { nomeCompleto: "ROSINEIA FERREIRA LIMA", cod: "387", cargo: "MERENDEIRA" },
    sebastiao: { nomeCompleto: "SEBASTIÃO RAMALHO FILHO", cod: "", cargo: "" },
    suzimara: { nomeCompleto: "SUZIMARA DA SILVA", cod: "641", cargo: "SERVIÇOS GERAIS" },
    luciana: { nomeCompleto: "LUCIANA ALVES DE OLIVEIRA", cod: "281", cargo: "PSICÓLOGA" },
    vania: { nomeCompleto: "VÂNIA PAULA DA SILVA RIBEIRO", cod: "277", cargo: "PEB II" },
    claudineia: { nomeCompleto: "CLAUDINÉIA DA SILVA MORAIS", cod: "485", cargo: "AUXILIAR PEDAGÓGICO" },
    francielle: { nomeCompleto: "FRANCIELLE PEREIRA DE OLIVEIRA", cod: "551", cargo: "SERVIÇOS GERAIS" },
    camila: { nomeCompleto: "CAMILA NUNES ANTONIASSI MOREIRA", cod: "492", cargo: "AUXILIAR PEDAGÓGICO" }
};

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

export function gerarDocumentoDocx({ modeloRelativo, dados, outputName, successMessage = 'Documento gerado com sucesso!' }) {
    const serverURL = window.location.protocol + '//' + window.location.host;
    const modeloURL = `${serverURL}/${modeloRelativo.replace(/^\/+/, '')}`;

    return fetch(modeloURL)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status} - ${res.statusText}`);
            }
            return res.arrayBuffer();
        })
        .then((content) => {
            const zip = new PizZip(content);
            const doc = new window.docxtemplater().loadZip(zip);
            doc.setData(dados);
            doc.render();
            const blob = doc.getZip().generate({ type: 'blob' });
            saveAs(blob, outputName);
            showToast(successMessage, 'success');
        })
        .catch((err) => {
            console.error('Erro ao gerar o documento:', err);
            showToast('Erro ao carregar o modelo. Certifique-se de acessar pelo servidor local (http://localhost:8000)', 'error');
            throw err;
        });
}