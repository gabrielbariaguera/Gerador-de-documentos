import { buscarFuncionario, mensagemErroApi, preencherSelectFuncionarios } from "./api.js";
import { garantirEquipePadrao } from "./funcionarios-padrao.js";
import { formatarDataPorExtenso, showToast, validarCampos, setBotaoLoading, inicializarFormulario, gerarDocumentoDocx } from "./utils.js";

async function gerarDispensa() {
    const campos = {
        nomeFuncionario: "nome do funcionário",
        dataDisp: "data da dispensa",
        diasDisp: "quantidade de dias"
    };

    if (!validarCampos(campos)) {
        return;
    }

    const botao = document.getElementById('btnGerarAbono');
    setBotaoLoading(botao, true);

    const employeeId = Number(document.getElementById("nomeFuncionario").value);
    const dataDispensa = document.getElementById("dataDisp").value;
    const dias = document.getElementById("diasDisp").value;
    const diasExtenso = {
        1: "um",
        2: "dois",
        3: "três",
        4: "quatro",
        5: "cinco"
    }[dias] || dias;

    try {
        const funcionarioInfo = await buscarFuncionario(employeeId);

        await gerarDocumentoDocx({
            modeloRelativo: "../../modelos/MODELO - PEDIDO DISPENSA.docx",
            dados: {
                nome: funcionarioInfo.name,
                cod: funcionarioInfo.code,
                cargo: funcionarioInfo.position,
                dataDispensa: formatarDataPorExtenso(dataDispensa),
                dia: dias,
                diaExtenso: diasExtenso,
                data: formatarDataPorExtenso()
            },
            outputName: `Dispensa-${funcionarioInfo.name}.docx`,
            registro: {
                name: `Dispensa - ${funcionarioInfo.name}`,
                type: 'exemption',
                employeeId
            }
        });
    } catch (error) {
        console.error("Erro ao gerar documento:", error);
        showToast(mensagemErroApi(error), 'error');
    } finally {
        setBotaoLoading(botao, false);
    }
}

inicializarFormulario({
    buttonId: 'btnGerarAbono',
    onSubmit: gerarDispensa
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await garantirEquipePadrao();
        await preencherSelectFuncionarios('nomeFuncionario');
    } catch (error) {
        showToast(mensagemErroApi(error), 'error');
    }
});
