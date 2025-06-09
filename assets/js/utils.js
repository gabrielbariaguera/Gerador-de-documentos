// Formata data de YYYY-MM-DD para DD/MM/YYYY
export function formatarDataBr(data) {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}