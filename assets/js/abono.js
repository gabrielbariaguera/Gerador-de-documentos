import { funcionarios, showToast, validarCampos, setBotaoLoading, inicializarFormulario, gerarDocumentoDocx } from "./utils.js";

function gerarAbono() {
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

    const nomeFunc = document.getElementById("nomeFuncionario").value;
    const dataAbono = document.getElementById("dataAbono").value;
    const novaDataAbono = new Date(`${dataAbono}T00:00`);

    const hoje = new Date();
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const data = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
    const dataAbonoFormatada = `${novaDataAbono.getDate()} de ${meses[novaDataAbono.getMonth()]} de ${novaDataAbono.getFullYear()}`;

    const funcionarioInfo = funcionarios[nomeFunc];
    const tipoAbono = document.getElementById("tipoAbono").value;
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
            setBotaoLoading(botao, false);
            return;
    }

    gerarDocumentoDocx({
        modeloRelativo: modelo,
        dados: {
            nome: funcionarioInfo.nomeCompleto,
            cod: funcionarioInfo.cod,
            cargo: funcionarioInfo.cargo,
            dataAbono: dataAbonoFormatada,
            data
        },
        outputName: `Abono-${nomeFunc}.docx`
    })
        .catch((error) => {
            console.error("Erro ao gerar documento:", error);
        })
        .finally(() => {
            setBotaoLoading(botao, false);
        });
}

inicializarFormulario({
    buttonId: 'btnGerarAbono',
    onSubmit: gerarAbono
});
