const CHAVE = "medicamentos-documentos";

function estadoVazio() {
    return { alunos: [] };
}

export function carregarMedicamentos() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
        return { alunos: Array.isArray(salvo?.alunos) ? salvo.alunos : [] };
    } catch {
        return estadoVazio();
    }
}

export function salvarMedicamentos(estado) {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
}

export function ultimaEntrega(aluno) {
    const datas = [...(aluno.entregas || [])]
        .filter((dia) => /^\d{4}-\d{2}-\d{2}$/.test(String(dia)))
        .sort();
    return datas.at(-1) || "";
}

export function diaSeguinte(iso) {
    if (!iso) return "";
    const data = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(data.getTime())) return "";
    data.setDate(data.getDate() + 1);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}
