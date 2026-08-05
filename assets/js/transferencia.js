import { formatarDataBr, showToast, validarCampos, setBotaoLoading, inicializarFormulario, gerarDocumentoDocx } from "./utils.js";

function gerarTransferencia() {
    const campos = {
        nomeAluno: "nome do aluno",
        raAluno: "RA do aluno",
        nascimento: "data de nascimento",
        emissor: "emissor do documento",
        serie: "série do aluno"
    };

    if (!validarCampos(campos)) {
        return;
    }

    const botao = document.getElementById('btnGerarDec');
    setBotaoLoading(botao, true);

    const nomeAluno = document.getElementById("nomeAluno").value;
    const raAluno = document.getElementById("raAluno").value;
    const nascimento = document.getElementById("nascimento").value;
    const emissor = document.getElementById("emissor").value;
    const nascimentoFormatado = formatarDataBr(nascimento);
    const serie = document.getElementById("serie").value;

    const hoje = new Date();
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const data = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

    const emissores = {
        gabriel: {
            nome: "Gabriel Aguera Baria",
            cargo: "ESTAGIÁRIO"
        },
        julia: {
            nome: "Julia de Lima Batista",
            cargo: "ESCRITUÁRIA"
        }
    };

    const emissorInfo = emissores[emissor];

    gerarDocumentoDocx({
        modeloRelativo: "../../modelos/DECLARAÇÃO OFICIAL - TRANSFERÊNCIA.docx",
        dados: {
            nome: nomeAluno,
            ra: raAluno,
            nascimento: nascimentoFormatado,
            data,
            emissor: emissorInfo.nome,
            cargoEmissor: emissorInfo.cargo,
            serie
        },
        outputName: `declaracao-${nomeAluno}.docx`
    })
        .catch((error) => {
            console.error("Erro ao gerar documento:", error);
        })
        .finally(() => {
            setBotaoLoading(botao, false);
        });
}

inicializarFormulario({
    buttonId: 'btnGerarDec',
    onSubmit: gerarTransferencia
});
