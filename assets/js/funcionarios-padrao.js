import { criarFuncionario, listarFuncionarios } from "./api.js";

export const FUNCIONARIOS_PADRAO = [
    { code: 633, name: "AGNALDO MAURICIO DA SILVA", position: "SERVIÇOS GERAIS", birthday: "1990-01-01" },
    { code: 377, name: "ALINE ROSSI ROMERO", position: "ASSISTENTE SOCIAL", birthday: "1990-01-01" },
    { code: 376, name: "CACILDA RIBEIRO LEAL DE MORAIS", position: "SERVIÇOS GERAIS", birthday: "1990-01-01" },
    { code: 492, name: "CAMILA NUNES ANTONIASSI MOREIRA", position: "AUXILIAR PEDAGÓGICO", birthday: "1990-01-01" },
    { code: 296, name: "CAROLINA CONSTANTINO BUENO", position: "PEB II", birthday: "1990-01-01" },
    { code: 231, name: "CÉLIA DO CARMO TOSTA", position: "INSPETOR DE ALUNO", birthday: "1990-01-01" },
    { code: 626, name: "CLAUDIANA DE JESUS MORAIS", position: "SERVIÇOS GERAIS", birthday: "1990-01-01" },
    { code: 485, name: "CLAUDINÉIA DA SILVA MORAIS", position: "AUXILIAR PEDAGÓGICO", birthday: "1990-01-01" },
    { code: 298, name: "ELIAD GARCIA RAMOS PRADO", position: "PEB I", birthday: "1990-01-01" },
    { code: 305, name: "ELIANE CRISTINA DA COSTA", position: "PEB I", birthday: "1990-01-01" },
    { code: 395, name: "ELINETY LOURENÇO DE SOUZA SANTOS", position: "SERVIÇOS GERAIS", birthday: "1990-01-01" },
    { code: 900, name: "ENDAGABI MUNIQUI DE OLIVEIRA FERNANDES", position: "NÃO INFORMADO", birthday: "1990-01-01" },
    { code: 551, name: "FRANCIELLE PEREIRA DE OLIVEIRA", position: "SERVIÇOS GERAIS", birthday: "1990-01-01" },
    { code: 620, name: "IZABEL CRISTINA DE PAULA MARANGONI", position: "PEB I", birthday: "1990-01-01" },
    { code: 654, name: "JÚLIA DE LIMA BATISTA", position: "ESCRITURÁRIO I", birthday: "1990-01-01" },
    { code: 281, name: "LUCIANA ALVES DE OLIVEIRA", position: "PSICÓLOGA", birthday: "1990-01-01" },
    { code: 901, name: "MARCIA CELESTINA RAMOS", position: "NÃO INFORMADO", birthday: "1990-01-01" },
    { code: 309, name: "MARINEI DE FÁTIMA ELOI FRANÇA", position: "PEB I", birthday: "1990-01-01" },
    { code: 602, name: "MARLEI DE LIMA NANYA FELIPE", position: "PEB I", birthday: "1990-01-01" },
    { code: 299, name: "MATHIAS ROBERTO BATISTA", position: "PEB II", birthday: "1990-01-01" },
    { code: 301, name: "NEUCI DIAS RODRIGUES", position: "PEB I", birthday: "1990-01-01" },
    { code: 643, name: "NISLÉIA FERNANDA DE SOUZA SANTOS", position: "PEB I", birthday: "1990-01-01" },
    { code: 341, name: "ROSANA APARECIDA DOS SANTOS", position: "INSPETOR DE ALUNO", birthday: "1990-01-01" },
    { code: 338, name: "ROSIMAR ANTÔNIA POSSEBON", position: "MERENDEIRA", birthday: "1990-01-01" },
    { code: 387, name: "ROSINEIA FERREIRA LIMA", position: "MERENDEIRA", birthday: "1990-01-01" },
    { code: 902, name: "SEBASTIÃO RAMALHO FILHO", position: "NÃO INFORMADO", birthday: "1990-01-01" },
    { code: 641, name: "SUZIMARA DA SILVA", position: "SERVIÇOS GERAIS", birthday: "1990-01-01" },
    { code: 277, name: "VÂNIA PAULA DA SILVA RIBEIRO", position: "PEB II", birthday: "1990-01-01" }
];

export async function garantirEquipePadrao() {
    const existentes = await listarFuncionarios();
    const codes = new Set(existentes.map((item) => Number(item.code)));
    let criados = 0;

    for (const funcionario of FUNCIONARIOS_PADRAO) {
        if (codes.has(Number(funcionario.code))) {
            continue;
        }

        try {
            await criarFuncionario(funcionario);
            criados += 1;
        } catch (error) {
            console.warn(`Não foi possível cadastrar ${funcionario.name}`);
        }
    }

    if (criados === 0) {
        return existentes;
    }

    return listarFuncionarios();
}
