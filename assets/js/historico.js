import { formatarDataBr, showToast, validarCampos, setBotaoLoading, inicializarFormulario, gerarDocumentoDocx } from "./utils.js";

function criarBlocoAno(index) {
    return `
        <div class="card" style="margin-bottom: 14px; border: 1px dashed rgba(15, 118, 110, 0.28);">
            <div class="card-header" style="padding: 14px 16px;">
                <i class="fas fa-calendar-alt"></i>
                <h3>Ano letivo ${index + 1}</h3>
            </div>
            <div class="card-body" style="padding: 16px;">
                <div class="form-row">
                    <div class="form-group">
                        <label for="anoLetivo_${index}">ANO:</label>
                        <input type="text" id="anoLetivo_${index}" class="form-control" placeholder="Ex.: 2024">
                    </div>
                    <div class="form-group">
                        <label for="serieAno_${index}">SÉRIE/ANO:</label>
                        <input type="text" id="serieAno_${index}" class="form-control" placeholder="Ex.: 2º ano">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="estabelecimentoAno_${index}">ESTABELECIMENTO DE ENSINO:</label>
                        <input type="text" id="estabelecimentoAno_${index}" class="form-control" placeholder="Ex.: Escola Estadual X">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="municipioAno_${index}">MUNICÍPIO:</label>
                        <input type="text" id="municipioAno_${index}" class="form-control" placeholder="Ex.: São Paulo">
                    </div>
                    <div class="form-group">
                        <label for="ufAno_${index}">UF:</label>
                        <input type="text" id="ufAno_${index}" class="form-control" placeholder="Ex.: SP">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="portugues_${index}">LP:</label>
                        <input type="number" step="0.1" min="0" max="10" id="portugues_${index}" class="form-control" placeholder="Ex.: 8.5">
                    </div>
                    <div class="form-group">
                        <label for="matematica_${index}">MAT:</label>
                        <input type="number" step="0.1" min="0" max="10" id="matematica_${index}" class="form-control" placeholder="Ex.: 7.8">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="historia_${index}">HIS:</label>
                        <input type="number" step="0.1" min="0" max="10" id="historia_${index}" class="form-control" placeholder="Ex.: 9.0">
                    </div>
                    <div class="form-group">
                        <label for="geografia_${index}">GEO:</label>
                        <input type="number" step="0.1" min="0" max="10" id="geografia_${index}" class="form-control" placeholder="Ex.: 8.2">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="ciencias_${index}">CIE:</label>
                        <input type="number" step="0.1" min="0" max="10" id="ciencias_${index}" class="form-control" placeholder="Ex.: 8.7">
                    </div>
                    <div class="form-group">
                        <label for="arte_${index}">ARTE:</label>
                        <input type="number" step="0.1" min="0" max="10" id="arte_${index}" class="form-control" placeholder="Ex.: 8.5">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="educacaoFisica_${index}">EDF:</label>
                        <input type="number" step="0.1" min="0" max="10" id="educacaoFisica_${index}" class="form-control" placeholder="Ex.: 9.0">
                    </div>
                    <div class="form-group">
                        <label for="ingles_${index}">ING:</label>
                        <input type="number" step="0.1" min="0" max="10" id="ingles_${index}" class="form-control" placeholder="Ex.: 8.3">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="producaoTexto_${index}">PT:</label>
                        <input type="number" step="0.1" min="0" max="10" id="producaoTexto_${index}" class="form-control" placeholder="Ex.: 8.8">
                    </div>
                    <div class="form-group">
                        <label for="orientacaoEstudos_${index}">OE:</label>
                        <input type="number" step="0.1" min="0" max="10" id="orientacaoEstudos_${index}" class="form-control" placeholder="Ex.: 8.6">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="orientacaoEstudosMat_${index}">OEM:</label>
                        <input type="number" step="0.1" min="0" max="10" id="orientacaoEstudosMat_${index}" class="form-control" placeholder="Ex.: 8.6">
                    </div>
                    <div class="form-group">
                        <label for="assembleia_${index}">ASS:</label>
                        <input type="number" step="0.1" min="0" max="10" id="assembleia_${index}" class="form-control" placeholder="Ex.: 8.7">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="projetoConvivencia_${index}">PC:</label>
                        <input type="number" step="0.1" min="0" max="10" id="projetoConvivencia_${index}" class="form-control" placeholder="Ex.: 9.1">
                    </div>
                    <div class="form-group">
                        <label for="experienciaMatematica_${index}">EM:</label>
                        <input type="number" step="0.1" min="0" max="10" id="experienciaMatematica_${index}" class="form-control" placeholder="Ex.: 8.8">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="praticasExperimentais_${index}">PE:</label>
                        <input type="number" step="0.1" min="0" max="10" id="praticasExperimentais_${index}" class="form-control" placeholder="Ex.: 8.9">
                    </div>
                    <div class="form-group">
                        <label for="tecnologiaInovacao_${index}">TI:</label>
                        <input type="number" step="0.1" min="0" max="10" id="tecnologiaInovacao_${index}" class="form-control" placeholder="Ex.: 8.4">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="linguagensArtisticas_${index}">LA:</label>
                        <input type="number" step="0.1" min="0" max="10" id="linguagensArtisticas_${index}" class="form-control" placeholder="Ex.: 8.6">
                    </div>
                    <div class="form-group">
                        <label for="educacaoSocioemocional_${index}">ES:</label>
                        <input type="number" step="0.1" min="0" max="10" id="educacaoSocioemocional_${index}" class="form-control" placeholder="Ex.: 8.7">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="culturaMovimento_${index}">CM:</label>
                        <input type="number" step="0.1" min="0" max="10" id="culturaMovimento_${index}" class="form-control" placeholder="Ex.: 8.5">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function adicionarAnoLetivo(container, index = container.children.length) {
    const bloco = document.createElement('div');
    bloco.innerHTML = criarBlocoAno(index);
    container.appendChild(bloco.firstElementChild);
}

function coletarAnosLetivos() {
    const container = document.getElementById('anosLetivosContainer');
    const anos = [];

    Array.from(container.children).forEach((bloco, index) => {
        const ano = {
            anoLetivo: document.getElementById(`anoLetivo_${index}`)?.value.trim() || '',
            serieAno: document.getElementById(`serieAno_${index}`)?.value.trim() || '',
            estabelecimentoAno: document.getElementById(`estabelecimentoAno_${index}`)?.value.trim() || '',
            municipioAno: document.getElementById(`municipioAno_${index}`)?.value.trim() || '',
            ufAno: document.getElementById(`ufAno_${index}`)?.value.trim() || '',
            portugues: document.getElementById(`portugues_${index}`)?.value.trim() || '',
            matematica: document.getElementById(`matematica_${index}`)?.value.trim() || '',
            historia: document.getElementById(`historia_${index}`)?.value.trim() || '',
            geografia: document.getElementById(`geografia_${index}`)?.value.trim() || '',
            ciencias: document.getElementById(`ciencias_${index}`)?.value.trim() || '',
            arte: document.getElementById(`arte_${index}`)?.value.trim() || '',
            educacaoFisica: document.getElementById(`educacaoFisica_${index}`)?.value.trim() || '',
            ingles: document.getElementById(`ingles_${index}`)?.value.trim() || '',
            producaoTexto: document.getElementById(`producaoTexto_${index}`)?.value.trim() || '',
            orientacaoEstudos: document.getElementById(`orientacaoEstudos_${index}`)?.value.trim() || '',
            orientacaoEstudosMat: document.getElementById(`orientacaoEstudosMat_${index}`)?.value.trim() || '',
            assembleia: document.getElementById(`assembleia_${index}`)?.value.trim() || '',
            projetoConvivencia: document.getElementById(`projetoConvivencia_${index}`)?.value.trim() || '',
            praticasExperimentais: document.getElementById(`praticasExperimentais_${index}`)?.value.trim() || '',
            tecnologiaInovacao: document.getElementById(`tecnologiaInovacao_${index}`)?.value.trim() || '',
            linguagensArtisticas: document.getElementById(`linguagensArtisticas_${index}`)?.value.trim() || '',
            educacaoSocioemocional: document.getElementById(`educacaoSocioemocional_${index}`)?.value.trim() || '',
            experienciaMatematica: document.getElementById(`experienciaMatematica_${index}`)?.value.trim() || '',
            culturaMovimento: document.getElementById(`culturaMovimento_${index}`)?.value.trim() || ''
        };
        anos.push(ano);
    });

    return anos;
}

function preencherPlaceholdersPorAno(dados, numero, ano) {
    const aliases = {
        ano: [`al${numero}`],
        serie: [`al${numero}Ano`],
        estabelecimento: [`estabelecimentoAL${numero}`],
        municipio: [`municipioAL${numero}`],
        uf: [`ufAL${numero}`],
        portugues: [`lpAl${numero}`, `lpA${numero}`],
        matematica: [`mAl${numero}`, `mA${numero}`],
        historia: [`hAl${numero}`, `hA${numero}`],
        geografia: [`gAl${numero}`, `gA${numero}`],
        ciencias: [`cAl${numero}`, `cA${numero}`],
        arte: [`aAl${numero}`, `aA${numero}`],
        educacaoFisica: [`efAl${numero}`, `efA${numero}`],
        ingles: [`liAl${numero}`, `liA${numero}`],
        producaoTexto: [`ptA${numero}`],
        orientacaoEstudos: [`oe${numero}`],
        orientacaoEstudosMat: [`oem${numero}`],
        assembleia: [`ass${numero}`, `assA${numero}`],
        projetoConvivencia: [`pcA${numero}`],
        praticasExperimentais: [`peA${numero}`],
        tecnologiaInovacao: [`ti${numero}`],
        linguagensArtisticas: [`laAl${numero}`, `laA${numero}`],
        educacaoSocioemocional: [`es${numero}`, `esA${numero}`],
        experienciaMatematica: [`em${numero}`, `emA${numero}`],
        culturaMovimento: [`cm${numero}`]
    };

    const valores = {
        ano: ano.anoLetivo,
        serie: ano.serieAno,
        estabelecimento: ano.estabelecimentoAno,
        municipio: ano.municipioAno,
        uf: ano.ufAno,
        portugues: ano.portugues,
        matematica: ano.matematica,
        historia: ano.historia,
        geografia: ano.geografia,
        ciencias: ano.ciencias,
        arte: ano.arte,
        educacaoFisica: ano.educacaoFisica,
        ingles: ano.ingles,
        producaoTexto: ano.producaoTexto,
        orientacaoEstudos: ano.orientacaoEstudos,
        orientacaoEstudosMat: ano.orientacaoEstudosMat,
        assembleia: ano.assembleia,
        projetoConvivencia: ano.projetoConvivencia,
        praticasExperimentais: ano.praticasExperimentais,
        tecnologiaInovacao: ano.tecnologiaInovacao,
        linguagensArtisticas: ano.linguagensArtisticas,
        educacaoSocioemocional: ano.educacaoSocioemocional,
        experienciaMatematica: ano.experienciaMatematica,
        culturaMovimento: ano.culturaMovimento
    };

    Object.entries(aliases).forEach(([chave, placeholders]) => {
        placeholders.forEach((placeholder) => {
            dados[placeholder] = valores[chave];
        });
    });
}

function gerarHistorico() {
    const campos = {
        nomeAluno: "nome do aluno",
        raAluno: "RA do aluno",
        dataNascimento: "data de nascimento",
        municipioNascimento: "município de nascimento",
        ufNascimento: "UF de nascimento"
    };

    if (!validarCampos(campos)) {
        return;
    }

    const anosLetivos = coletarAnosLetivos();
    if (anosLetivos.length === 0) {
        showToast('Adicione pelo menos um ano letivo para gerar o documento.', 'error');
        return;
    }

    const botao = document.getElementById('btnGerarHistorico');
    setBotaoLoading(botao, true);

    const nomeAluno = document.getElementById('nomeAluno').value.trim();
    const raAluno = document.getElementById('raAluno').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const municipioNascimento = document.getElementById('municipioNascimento').value.trim();
    const ufNascimento = document.getElementById('ufNascimento').value.trim();

    const dados = {
        nomeAluno,
        raAluno,
        dataNascimento: formatarDataBr(dataNascimento),
        municipioNascimento,
        ufNascimento,
        data: new Date().toLocaleDateString('pt-BR')
    };

    anosLetivos.forEach((ano, index) => {
        const numero = index + 1;
        preencherPlaceholdersPorAno(dados, numero, ano);
    });

    gerarDocumentoDocx({
        modeloRelativo: '../../modelos/HISTÓRICO ESCOLAR.docx',
        dados,
        outputName: `historico-${nomeAluno}.docx`
    })
        .catch((error) => {
            console.error('Erro ao gerar histórico escolar:', error);
        })
        .finally(() => {
            setBotaoLoading(botao, false);
        });
}

function inicializarHistorico() {
    const container = document.getElementById('anosLetivosContainer');

    if (container) {
        container.innerHTML = '';
        for (let i = 0; i < 5; i += 1) {
            adicionarAnoLetivo(container, i);
        }
    }
}

inicializarFormulario({
    buttonId: 'btnGerarHistorico',
    onSubmit: gerarHistorico
});

inicializarHistorico();
