import axios from "axios";

export const api = axios.create({
    baseURL: "/api"
});

export function mensagemErroApi(error) {
    return error.response?.data?.message || error.message || "Erro ao comunicar com a API";
}

function dadosDaResposta(resposta) {
    return resposta.data?.data ?? resposta.data;
}

export async function listarFuncionarios() {
    const dados = dadosDaResposta(await api.get("/employees"));
    return Array.isArray(dados) ? dados : [];
}

export async function buscarFuncionario(id) {
    return dadosDaResposta(await api.get(`/employees/${id}`));
}

export async function criarFuncionario(payload) {
    return dadosDaResposta(await api.post("/employees", payload));
}

export async function atualizarFuncionario(id, payload) {
    return dadosDaResposta(await api.patch(`/employees/${id}`, payload));
}

export async function excluirFuncionario(id) {
    return dadosDaResposta(await api.delete(`/employees/${id}`));
}

export async function cadastrarAbono(payload) {
    return dadosDaResposta(await api.post("/allowance", payload));
}

export async function excluirAbono(id) {
    return dadosDaResposta(await api.delete(`/allowance/${id}`));
}

export async function listarAbonosPorFuncionario(nome) {
    const dados = dadosDaResposta(await api.get(`/allowance/employee/${encodeURIComponent(nome)}`));
    return Array.isArray(dados) ? dados : [];
}

export const LIMITE_ABONOS_POR_ANO = 6;

export async function quantidadeAbonosNoAno(nome, ano) {
    const abonos = await listarAbonosPorFuncionario(nome);
    return abonos.filter((abono) => String(abono.date || "").slice(0, 4) === String(ano)).length;
}

export async function listarDocumentos() {
    const dados = dadosDaResposta(await api.get("/docs"));
    return Array.isArray(dados) ? dados : [];
}

export async function criarDocumento({ file, fileName, name, type, employeeId }) {
    const form = new FormData();
    const arquivo = file instanceof File
        ? file
        : new File([file], fileName, {
            type: file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });

    form.append("file", arquivo, fileName);
    form.append("name", name);
    form.append("type", type);
    if (employeeId) form.append("employeeId", String(employeeId));

    return dadosDaResposta(await api.post("/docs", form));
}

export async function baixarDocumentoArquivo(id) {
    return api.get(`/docs/${id}/download`, { responseType: "blob" });
}

export async function excluirDocumento(id) {
    const resposta = await api.delete(`/docs/${id}`);
    return dadosDaResposta(resposta);
}

export async function listarProfessoresColaborativo() {
    const dados = dadosDaResposta(await api.get("/collaborative/teachers"));
    return Array.isArray(dados) ? dados : [];
}

export async function adicionarProfessorColaborativo(payload) {
    return dadosDaResposta(await api.post("/collaborative/teachers", payload));
}

export async function excluirProfessorColaborativo(id) {
    return dadosDaResposta(await api.delete(`/collaborative/teachers/${id}`));
}

export async function listarMesesColaborativo() {
    const dados = dadosDaResposta(await api.get("/collaborative/months"));
    return Array.isArray(dados) ? dados.map(String).sort() : [];
}

export async function criarMesColaborativo(yearMonth) {
    return dadosDaResposta(await api.post("/collaborative/months", { yearMonth }));
}

export async function listarMarcacoesColaborativo(yearMonth) {
    const dados = dadosDaResposta(await api.get("/collaborative/entries", { params: { yearMonth } }));
    return Array.isArray(dados) ? dados : [];
}

export async function salvarMarcacaoColaborativo(payload) {
    return dadosDaResposta(await api.put("/collaborative/entries", payload));
}

export async function listarAlunosMedicamento(q = "") {
    const dados = dadosDaResposta(await api.get("/medication/students", { params: q ? { q } : {} }));
    return Array.isArray(dados) ? dados : [];
}

export async function buscarAlunoMedicamento(id) {
    return dadosDaResposta(await api.get(`/medication/students/${id}`));
}

export async function cadastrarAlunoMedicamento(payload) {
    return dadosDaResposta(await api.post("/medication/students", payload));
}

export async function registrarEntregaMedicamento(id, date) {
    return dadosDaResposta(await api.post(`/medication/students/${id}/deliveries`, { date }));
}

export async function excluirAlunoMedicamento(id) {
    return dadosDaResposta(await api.delete(`/medication/students/${id}`));
}
