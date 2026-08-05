import { funcionarios, showToast, validarCampos, setBotaoLoading, inicializarFormulario, gerarDocumentoDocx } from "./utils.js";

function gerarDispensa() {
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

    const nomeFunc = document.getElementById("nomeFuncionario").value;
    const dataDispensa = document.getElementById("dataDisp").value;
    const novaDataDispensa = new Date(`${dataDispensa}T00:00`);
    const hoje = new Date();
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const data = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
    const dataDispensaFormatada = `${novaDataDispensa.getDate()} de ${meses[novaDataDispensa.getMonth()]} de ${novaDataDispensa.getFullYear()}`;

    const funcionarioInfo = funcionarios[nomeFunc];
    const dias = document.getElementById("diasDisp").value;
    const diasExtenso = {
        1: "um",
        2: "dois",
        3: "três",
        4: "quatro",
        5: "cinco"
    }[dias] || dias;

    gerarDocumentoDocx({
        modeloRelativo: "../modelos/MODELO - PEDIDO DISPENSA.docx",
        dados: {
            nome: funcionarioInfo.nomeCompleto,
            cod: funcionarioInfo.cod,
            cargo: funcionarioInfo.cargo,
            dataDispensa: dataDispensaFormatada,
            dia: dias,
            diaExtenso: diasExtenso,
            data
        },
        outputName: `Dispensa-${nomeFunc}.docx`
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
    onSubmit: gerarDispensa
});
