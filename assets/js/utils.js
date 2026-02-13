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
        danieli: { nomeCompleto: "DANIELI RINARDI DA SILVEIRA", cod: "594", cargo: "PEB I" },
        eliad: { nomeCompleto: "ELIAD GARCIA RAMOS PRADO", cod: "298", cargo: "PEB I" },
        eliane: { nomeCompleto: "ELIANE CRISTINA DA COSTA", cod: "305", cargo: "PEB I" },
        elinety: { nomeCompleto: "ELINETY LOURENÇO DE SOUZA SANTOS", cod: "395", cargo: "SERVIÇOS GERAIS" },
        endagabi: { nomeCompleto: "ENDAGABI MUNIQUI DE OLIVEIRA FERNANDES", cod: "", cargo: "" },
        gabriel: { nomeCompleto: "GABRIEL AGUERA BARIA", cod: "", cargo: "ESTAGIÁRIO" },
        izabel: { nomeCompleto: "IZABEL CRISTINA DE PAULA MARANGONI", cod: "620", cargo: "PEB I" },
        julia: { nomeCompleto: "JÚLIA DE LIMA BATISTA", cod: "654", cargo: "ESCRITURÁRIO I" },
        marcia: { nomeCompleto: "MARCIA CELESTINA RAMOS", cod: "", cargo: "" },
        mariana: { nomeCompleto: "MARIANA FANTINI RIBEIRO", cod: "571", cargo: "PEB I" },
        marinei: { nomeCompleto: "MARINEI DE FÁTIMA ELOI FRANÇA", cod: "309", cargo: "PEB I" },
        marisa: { nomeCompleto: "MARISA FERNANDES", cod: "294", cargo: "MERENDEIRA" },
        marlei: { nomeCompleto: "MARLEI DE LIMA NANYA FELIPE", cod: "602", cargo: "PEB I" },
        mathias: { nomeCompleto: "MATHIAS ROBERTO BATISTA", cod: "299", cargo: "PEB II" },
        neuci: { nomeCompleto: "NEUCI DIAS RODRIGUES", cod: "301", cargo: "PEB I" },
        nisleia: { nomeCompleto: "NISLÉIA FERNANDA DE SOUZA SANTOS", cod: "643", cargo: "PEB I" },
        rosana: { nomeCompleto: "ROSANA APARECIDA DOS SANTOS", cod: "341", cargo: "INSPETOR DE ALUNO" },
        rosimar: { nomeCompleto: "ROSIMAR ANTÔNIA POSSEBON", cod: "338", cargo: "MERENDEIRA" },
        rosineia: { nomeCompleto: "ROSINEIA FERREIRA LIMA", cod: "387", cargo: "MERENDEIRA" },
        sebastiao: { nomeCompleto: "SEBASTIÃO RAMALHO FILHO", cod: "", cargo: "" },
        suzimara: { nomeCompleto: "SUZIMARA DA SILVA", cod: "641", cargo: "SERVIÇOS GERAIS" },
        luciana: {nomeCompleto: "LUCIANA ALVES DE OLIVEIRA", cod: "281", cargo: "PSICÓLOGA"},
        maria: {nomeCompleto: "MARIA CLARA RODRIGUES ALVES", cod: "663", cargo: "AUXILIAR PEDAGÓGICO"}
}