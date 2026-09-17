import {
    atualizarFuncionario,
    criarFuncionario,
    excluirAbono,
    excluirFuncionario,
    LIMITE_ABONOS_POR_ANO,
    listarAbonosPorFuncionario,
    mensagemErroApi,
    preencherSelectFuncionarios
} from "./api.js";
import { garantirEquipePadrao } from "./funcionarios-padrao.js";
import { showToast, validarCampos, formatarDataBr } from "./utils.js";

function dataIso(valor) {
    return String(valor || '').slice(0, 10);
}

function agruparAbonosPorAno(abonos) {
    return abonos.reduce((acc, abono) => {
        const ano = String(abono.date || '').slice(0, 4) || 'Sem data';
        acc[ano] = (acc[ano] || 0) + 1;
        return acc;
    }, {});
}

async function carregarListaFuncionarios() {
    const corpo = document.getElementById('tabelaFuncionarios');
    if (!corpo) return [];

    try {
        const funcionarios = await garantirEquipePadrao();
        const ordenados = [...funcionarios].sort((a, b) =>
            String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR')
        );

        corpo.innerHTML = ordenados.length
            ? ordenados.map((funcionario) => `
                <tr data-id="${funcionario.id}">
                    <td><input type="number" class="form-control" data-field="code" value="${funcionario.code ?? ''}"></td>
                    <td><input type="text" class="form-control" data-field="name" value="${funcionario.name ?? ''}"></td>
                    <td><input type="text" class="form-control" data-field="position" value="${funcionario.position ?? ''}"></td>
                    <td><input type="date" class="form-control" data-field="birthday" value="${dataIso(funcionario.birthday)}"></td>
                    <td>
                        <button type="button" class="btn btn-primary" data-salvar="${funcionario.id}">
                            <i class="fas fa-save"></i>
                        </button>
                        <button type="button" class="btn btn-secondary" data-excluir="${funcionario.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('')
            : '<tr><td colspan="5">Nenhum funcionário cadastrado.</td></tr>';

        await preencherSelectFuncionarios('funcionarioAbonos');
        return ordenados;
    } catch (error) {
        corpo.innerHTML = '<tr><td colspan="5">Erro ao carregar funcionários.</td></tr>';
        showToast(mensagemErroApi(error), 'error');
        return [];
    }
}

function valoresDaLinha(linha) {
    return {
        code: Number(linha.querySelector('[data-field="code"]').value),
        name: linha.querySelector('[data-field="name"]').value.trim(),
        position: linha.querySelector('[data-field="position"]').value.trim(),
        birthday: linha.querySelector('[data-field="birthday"]').value
    };
}

async function salvarFuncionario(id, linha) {
    const dados = valoresDaLinha(linha);
    if (!dados.code || !dados.name || dados.name.length < 2 || !dados.position || dados.position.length < 2 || !dados.birthday) {
        showToast('Preencha código, nome, cargo e nascimento para salvar.', 'error');
        return;
    }

    try {
        await atualizarFuncionario(id, dados);
        showToast('Funcionário atualizado.');
        await carregarListaFuncionarios();
    } catch (error) {
        showToast(mensagemErroApi(error), 'error');
    }
}

async function cadastrarFuncionario() {
    const campos = {
        code: 'código',
        name: 'nome',
        position: 'cargo',
        birthday: 'data de nascimento'
    };

    if (!validarCampos(campos)) {
        return;
    }

    try {
        await criarFuncionario({
            code: Number(document.getElementById('code').value),
            name: document.getElementById('name').value.trim(),
            position: document.getElementById('position').value.trim(),
            birthday: document.getElementById('birthday').value
        });
        showToast('Funcionário cadastrado com sucesso.');
        document.getElementById('code').value = '';
        document.getElementById('name').value = '';
        document.getElementById('position').value = '';
        document.getElementById('birthday').value = '';
        await carregarListaFuncionarios();
    } catch (error) {
        showToast(mensagemErroApi(error), 'error');
    }
}

async function mostrarAbonosDoFuncionario() {
    const select = document.getElementById('funcionarioAbonos');
    const container = document.getElementById('resumoAbonos');
    if (!select || !container) return;

    const option = select.options[select.selectedIndex];
    if (!select.value) {
        container.innerHTML = '<p>Selecione um funcionário para ver os abonos.</p>';
        return;
    }

    try {
        const abonos = await listarAbonosPorFuncionario(option.textContent);
        const porAno = agruparAbonosPorAno(abonos);
        const anos = Object.keys(porAno).sort((a, b) => b.localeCompare(a));
        const abonosPorAno = anos.reduce((acc, ano) => {
            acc[ano] = abonos
                .filter((abono) => String(abono.date || '').slice(0, 4) === ano)
                .sort((a, b) => String(b.date).localeCompare(String(a.date)));
            return acc;
        }, {});

        if (!anos.length) {
            container.innerHTML = '<p>Nenhum abono cadastrado para este funcionário.</p>';
            return;
        }

        container.innerHTML = `
            <p><strong>Total:</strong> ${abonos.length} · limite de ${LIMITE_ABONOS_POR_ANO} por ano</p>
            <div class="extras-list">
                ${anos.map((ano) => {
                    const quantidade = porAno[ano];
                    const esgotado = quantidade >= LIMITE_ABONOS_POR_ANO;
                    const itens = abonosPorAno[ano].map((abono) => `
                        <div class="extras-item" style="padding: 12px 0; box-shadow: none; border: none; margin: 0;">
                            <div class="extras-item-info">
                                <i class="fas fa-calendar-day"></i>
                                <div>
                                    <strong>${formatarDataBr(dataIso(abono.date))}</strong>
                                </div>
                            </div>
                            <button type="button" class="btn btn-secondary" data-excluir-abono="${abono.id}">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    `).join('');
                    return `
                    <div class="card extras-item" style="flex-direction: column; align-items: stretch;">
                        <div class="extras-item-info">
                            <i class="fas fa-calendar-alt"></i>
                            <div>
                                <strong>${ano}</strong>
                                <span>${quantidade} / ${LIMITE_ABONOS_POR_ANO} abono(s)${esgotado ? ' — limite atingido' : ''}</span>
                            </div>
                        </div>
                        ${itens}
                    </div>
                `;
                }).join('')}
            </div>
        `;
    } catch (error) {
        container.innerHTML = '<p>Não foi possível carregar os abonos.</p>';
        showToast(mensagemErroApi(error), 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarListaFuncionarios();

    document.getElementById('btnCadastrarFuncionario')?.addEventListener('click', cadastrarFuncionario);
    document.getElementById('funcionarioAbonos')?.addEventListener('change', mostrarAbonosDoFuncionario);

    document.getElementById('resumoAbonos')?.addEventListener('click', async (event) => {
        const botao = event.target.closest('[data-excluir-abono]');
        if (!botao) return;

        try {
            await excluirAbono(botao.dataset.excluirAbono);
            showToast('Abono removido. A vaga daquele ano foi liberada.');
            await mostrarAbonosDoFuncionario();
        } catch (error) {
            showToast(mensagemErroApi(error), 'error');
        }
    });

    document.getElementById('tabelaFuncionarios')?.addEventListener('click', async (event) => {
        const botaoSalvar = event.target.closest('[data-salvar]');
        const botaoExcluir = event.target.closest('[data-excluir]');

        if (botaoSalvar) {
            const linha = botaoSalvar.closest('tr');
            await salvarFuncionario(botaoSalvar.dataset.salvar, linha);
            return;
        }

        if (!botaoExcluir) return;

        try {
            await excluirFuncionario(botaoExcluir.dataset.excluir);
            showToast('Funcionário removido.');
            await carregarListaFuncionarios();
            document.getElementById('resumoAbonos').innerHTML = '<p>Selecione um funcionário para ver os abonos.</p>';
        } catch (error) {
            showToast(mensagemErroApi(error), 'error');
        }
    });
});
