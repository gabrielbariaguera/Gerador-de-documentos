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
