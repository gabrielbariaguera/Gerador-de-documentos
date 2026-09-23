const CHAVE = "colaborativo-documentos";

function estadoVazio() {
    return { professores: [], registros: {}, meses: [] };
}

export function carregarColaborativo() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
        const registros = salvo?.registros || {};
        const meses = [...new Set([
            ...(salvo?.meses || []),
            ...Object.keys(registros),
            chaveMes(new Date().getFullYear(), new Date().getMonth() + 1)
        ])].sort();
        return {
            professores: salvo?.professores || [],
            registros,
            meses
        };
    } catch {
        return estadoVazio();
    }
}

export function salvarColaborativo(estado) {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
}

export function chaveMes(ano, mes) {
    return `${ano}-${String(mes).padStart(2, "0")}`;
}

export function quantidadeSemanas(ano, mes) {
    return Math.ceil(new Date(ano, mes, 0).getDate() / 7);
}

export function intervaloSemana(ano, mes, semana) {
    const ultimo = new Date(ano, mes, 0).getDate();
    const inicio = (semana - 1) * 7 + 1;
    const fim = Math.min(semana * 7, ultimo);
    return { inicio, fim };
}

export const MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function partirChaveMes(chave) {
    const [ano, mes] = String(chave).split("-").map(Number);
    return { ano, mes };
}

export function rotuloMes(chave) {
    const { ano, mes } = partirChaveMes(chave);
    return `${MESES[mes - 1] || mes} ${ano}`;
}

export function proximoMesChave(chave) {
    const { ano, mes } = partirChaveMes(chave);
    if (mes === 12) return chaveMes(ano + 1, 1);
    return chaveMes(ano, mes + 1);
}

export function garantirMes(estado, chave) {
    const meses = [...new Set([...(estado.meses || []), chave])].sort();
    const registros = estado.registros[chave]
        ? estado.registros
        : { ...estado.registros, [chave]: {} };
    return { ...estado, meses, registros };
}
