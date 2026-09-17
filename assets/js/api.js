const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const api = axios.create({
    baseURL: local ? `${window.location.origin}/api` : 'https://docsemef.onrender.com'
});

export function mensagemErroApi(error) {
    return error.response?.data?.message || error.message || 'Erro ao comunicar com a API';
}

function dadosDaResposta(resposta) {
    return resposta.data?.data ?? resposta.data;
}

export async function listarFuncionarios() {
    const resposta = await api.get('/employees');
    const dados = dadosDaResposta(resposta);
    return Array.isArray(dados) ? dados : [];
}

export async function buscarFuncionario(id) {
    const resposta = await api.get(`/employees/${id}`);
    return dadosDaResposta(resposta);
}

export async function criarFuncionario(payload) {
    const resposta = await api.post('/employees', payload);
    return dadosDaResposta(resposta);
}

export async function atualizarFuncionario(id, payload) {
    const resposta = await api.patch(`/employees/${id}`, payload);
    return dadosDaResposta(resposta);
}

export async function excluirFuncionario(id) {
    const resposta = await api.delete(`/employees/${id}`);
    return dadosDaResposta(resposta);
}

export async function cadastrarAbono(payload) {
    const resposta = await api.post('/allowance', payload);
    return dadosDaResposta(resposta);
}

export async function excluirAbono(id) {
    const resposta = await api.delete(`/allowance/${id}`);
    return dadosDaResposta(resposta);
}

export async function listarAbonos() {
    const resposta = await api.get('/allowance');
    const dados = dadosDaResposta(resposta);
    return Array.isArray(dados) ? dados : [];
}

export async function listarAbonosPorFuncionario(nome) {
    const resposta = await api.get(`/allowance/employee/${encodeURIComponent(nome)}`);
    const dados = dadosDaResposta(resposta);
    return Array.isArray(dados) ? dados : [];
}

export const LIMITE_ABONOS_POR_ANO = 6;

export async function quantidadeAbonosNoAno(nome, ano) {
    const abonos = await listarAbonosPorFuncionario(nome);
    return abonos.filter((abono) => String(abono.date || '').slice(0, 4) === String(ano)).length;
}

export async function listarAbonosPorData(data) {
    const resposta = await api.get(`/allowance/date/${data}`);
    const dados = dadosDaResposta(resposta);
    return Array.isArray(dados) ? dados : [];
}

export async function listarDocumentos() {
    const resposta = await api.get('/docs');
    const dados = dadosDaResposta(resposta);
    return Array.isArray(dados) ? dados : [];
}

export async function listarDocumentosPorTipo(tipo) {
    const resposta = await api.get(`/docs/type/${encodeURIComponent(tipo)}`);
    const dados = dadosDaResposta(resposta);
    return Array.isArray(dados) ? dados : [];
}

export async function criarDocumento({ file, fileName, name, type, employeeId }) {
    const form = new FormData();
    const arquivo = file instanceof File
        ? file
        : new File([file], fileName, {
            type: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

    form.append('file', arquivo, fileName);
    form.append('name', name);
    form.append('type', type);
    if (employeeId) {
        form.append('employeeId', String(employeeId));
    }

    const resposta = await api.post('/docs', form);
    return dadosDaResposta(resposta);
}

export async function baixarDocumentoArquivo(id) {
    return api.get(`/docs/${id}/download`, { responseType: 'blob' });
}

export async function excluirDocumento(id) {
    const resposta = await api.delete(`/docs/${id}`);
    return dadosDaResposta(resposta);
}

export async function preencherSelectFuncionarios(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return [];

    const funcionarios = await listarFuncionarios();
    const ordenados = [...funcionarios].sort((a, b) =>
        String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR')
    );

    select.innerHTML = '<option value="" hidden>Selecione o funcionário</option>';
    ordenados.forEach((funcionario) => {
        const option = document.createElement('option');
        option.value = String(funcionario.id);
        option.textContent = funcionario.name;
        select.appendChild(option);
    });

    return ordenados;
}
