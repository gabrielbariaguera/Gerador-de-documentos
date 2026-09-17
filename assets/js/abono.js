import { buscarFuncionario, cadastrarAbono, LIMITE_ABONOS_POR_ANO, mensagemErroApi, preencherSelectFuncionarios, quantidadeAbonosNoAno } from "./api.js";
import { garantirEquipePadrao } from "./funcionarios-padrao.js";
import { formatarDataPorExtenso, showToast, validarCampos, setBotaoLoading, inicializarFormulario, gerarDocumentoDocx } from "./utils.js";

async function gerarAbono() {
    const campos = {
        nomeFuncionario: "nome do funcionário",
        dataAbono: "data do abono",
        tipoAbono: "tipo do abono"
    };

    if (!validarCampos(campos)) {
        return;
    }

    const botao = document.getElementById('btnGerarAbono');
    setBotaoLoading(botao, true);

    const employeeId = Number(document.getElementById("nomeFuncionario").value);
    const dataAbono = document.getElementById("dataAbono").value;
    const tipoAbono = document.getElementById("tipoAbono").value;

    try {
        const funcionarioInfo = await buscarFuncionario(employeeId);
        let modelo = "";

        switch (tipoAbono) {
            case "abono":
                modelo = "../../modelos/MODELO - PEDIDO DE ABONO.docx";
                break;
            case "maes":
                modelo = "../../modelos/dia maes.docx";
                break;
            default:
                showToast("Tipo de documento inválido", "error");
                return;
        }

        if (tipoAbono === "abono") {
            const anoAbono = dataAbono.slice(0, 4);
            const quantidade = await quantidadeAbonosNoAno(funcionarioInfo.name, anoAbono);
            if (quantidade >= LIMITE_ABONOS_POR_ANO) {
                showToast(`${funcionarioInfo.name} já possui ${LIMITE_ABONOS_POR_ANO} abonos em ${anoAbono}.`, 'error');
                return;
            }

            try {
                await cadastrarAbono({ date: dataAbono, employeeId });
            } catch (error) {
                showToast(mensagemErroApi(error), 'warning');
            }
        }

        await gerarDocumentoDocx({
            modeloRelativo: modelo,
            dados: {
                nome: funcionarioInfo.name,
                cod: funcionarioInfo.code,
                cargo: funcionarioInfo.position,
                dataAbono: formatarDataPorExtenso(dataAbono),
                data: formatarDataPorExtenso()
            },
            outputName: `Abono-${funcionarioInfo.name}.docx`,
            registro: {
                name: `Abono - ${funcionarioInfo.name}`,
                type: 'allowance',
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
    onSubmit: gerarAbono
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await garantirEquipePadrao();
        await preencherSelectFuncionarios('nomeFuncionario');
    } catch (error) {
        showToast(mensagemErroApi(error), 'error');
    }
});
