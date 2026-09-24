export function ultimaEntrega(aluno) {
    if (aluno?.lastDate) return String(aluno.lastDate).slice(0, 10);
    const datas = [...(aluno?.deliveries || aluno?.entregas || [])]
        .map((dia) => String(dia).slice(0, 10))
        .filter((dia) => /^\d{4}-\d{2}-\d{2}$/.test(dia))
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
