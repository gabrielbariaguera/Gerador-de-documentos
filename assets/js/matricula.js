import { formatarDataBr, formatarDataPorExtenso, validarCampos, setBotaoLoading, inicializarFormulario, gerarDocumentoDocx } from "./utils.js";

function marcarSimNao(valor) {
    if (valor === 'sim') {
        return { sim: 'X', nao: '' };
    }

    if (valor === 'nao') {
        return { sim: '', nao: 'X' };
    }

    return { sim: '', nao: '' };
}

function marcarNovaAntiga(valor) {
    if (valor === 'nova') {
        return { nova: 'X', antiga: '' };
    }

    if (valor === 'antiga') {
        return { nova: '', antiga: 'X' };
    }

    return { nova: '', antiga: '' };
}

function valorCampo(id) {
    return document.getElementById(id)?.value.trim() || '';
}

function alternarCampoCondicional(selectId, containerId) {
    const select = document.getElementById(selectId);
    const container = document.getElementById(containerId);
    if (!select || !container) return;

    const mostrar = select.value === 'sim';
    container.hidden = !mostrar;

    if (!mostrar) {
        container.querySelectorAll('.form-control').forEach((input) => {
            input.value = '';
            input.classList.remove('campo-erro');
        });
    }
}

function configurarCamposCondicionais() {
    const atendimento = document.getElementById('atendimentoEspecial');
    const restricao = document.getElementById('restricaoAlimentar');

    atendimento?.addEventListener('change', () => {
        alternarCampoCondicional('atendimentoEspecial', 'campoCid');
    });

    restricao?.addEventListener('change', () => {
        alternarCampoCondicional('restricaoAlimentar', 'campoRestricao');
    });

    alternarCampoCondicional('atendimentoEspecial', 'campoCid');
    alternarCampoCondicional('restricaoAlimentar', 'campoRestricao');
}

function gerarMatricula() {
    const campos = {
        nomeAluno: 'nome do aluno',
        rmAluno: 'RM',
        generoAluno: 'gênero',
        nascimentoAluno: 'data de nascimento',
        cpfAluno: 'CPF',
        raAluno: 'RA',
        nacionalidadeAluno: 'nacionalidade',
        naturalidadeAluno: 'naturalidade',
        tipoCertidao: 'tipo da certidão',
        matriculaCertidao: 'nº de matrícula da certidão',
        maeAluno: 'nome da mãe',
        telMae: 'telefone da mãe',
        paiAluno: 'nome do pai',
        telPai: 'telefone do pai',
        ruaAluno: 'rua',
        numeroCasaAluno: 'número da residência',
        bairroAluno: 'bairro',
        transporte: 'transporte',
        atendimentoEspecial: 'atendimento especial',
        restricaoAlimentar: 'restrição alimentar',
        escolaAntiga: 'escola de procedência',
        cidadeEscolaAntiga: 'município da escola',
        ufEscolaAntiga: 'UF da escola'
    };

    if (valorCampo('atendimentoEspecial') === 'sim') {
        campos.cidAluno = 'CID';
    }

    if (valorCampo('restricaoAlimentar') === 'sim') {
        campos.resAlimentar = 'qual restrição alimentar';
    }

    if (!validarCampos(campos)) {
        return;
    }

    const botao = document.getElementById('btnGerarMatricula');
    setBotaoLoading(botao, true);

    const nomeAluno = valorCampo('nomeAluno');
    const transporte = marcarSimNao(valorCampo('transporte'));
    const atendimento = marcarSimNao(valorCampo('atendimentoEspecial'));
    const restricao = marcarSimNao(valorCampo('restricaoAlimentar'));
    const certidao = marcarNovaAntiga(valorCampo('tipoCertidao'));

    const dados = {
        nomeAluno,
        rmAluno: valorCampo('rmAluno'),
        generoAluno: valorCampo('generoAluno'),
        nascimentoAluno: formatarDataBr(valorCampo('nascimentoAluno')),
        cpfAluno: valorCampo('cpfAluno'),
        raAluno: valorCampo('raAluno'),
        nacionalidadeAluno: valorCampo('nacionalidadeAluno'),
        naturalidadeAluno: valorCampo('naturalidadeAluno'),
        matriculaCertidao: valorCampo('matriculaCertidao'),
        nova: certidao.nova,
        antiga: certidao.antiga,
        maeAluno: valorCampo('maeAluno'),
        telMae: valorCampo('telMae'),
        paiAluno: valorCampo('paiAluno'),
        telPai: valorCampo('telPai'),
        ruaAluno: valorCampo('ruaAluno'),
        numeroCasaAluno: valorCampo('numeroCasaAluno'),
        bairroAluno: valorCampo('bairroAluno'),
        transporteS: transporte.sim,
        transporteN: transporte.nao,
        aEspecialS: atendimento.sim,
        aEspecialN: atendimento.nao,
        cidAluno: valorCampo('atendimentoEspecial') === 'sim' ? valorCampo('cidAluno') : '',
        restricaoS: restricao.sim,
        restricaoN: restricao.nao,
        resAlimentar: valorCampo('restricaoAlimentar') === 'sim' ? valorCampo('resAlimentar') : '',
        escolaAntiga: valorCampo('escolaAntiga'),
        cidadeEscolaAntiga: valorCampo('cidadeEscolaAntiga'),
        ufEscolaAntiga: valorCampo('ufEscolaAntiga'),
        anoAtual: String(new Date().getFullYear()),
        dataAtual: formatarDataPorExtenso()
    };

    gerarDocumentoDocx({
        modeloRelativo: '../../modelos/FICHA DE MATRÍCULA.docx',
        dados,
        outputName: `matricula-${nomeAluno}.docx`
    })
        .catch((error) => {
            console.error('Erro ao gerar ficha de matrícula:', error);
        })
        .finally(() => {
            setBotaoLoading(botao, false);
        });
}

inicializarFormulario({
    buttonId: 'btnGerarMatricula',
    onSubmit: gerarMatricula,
    onReset: () => {
        alternarCampoCondicional('atendimentoEspecial', 'campoCid');
        alternarCampoCondicional('restricaoAlimentar', 'campoRestricao');
    }
});

document.addEventListener('DOMContentLoaded', configurarCamposCondicionais);
