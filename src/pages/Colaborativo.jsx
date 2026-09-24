import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarRange, Trash2, Users } from "lucide-react";
import { Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import {
    adicionarProfessorColaborativo,
    criarMesColaborativo,
    excluirProfessorColaborativo,
    listarFuncionarios,
    listarMarcacoesColaborativo,
    listarMesesColaborativo,
    listarProfessoresColaborativo,
    mensagemErroApi,
    salvarMarcacaoColaborativo
} from "../lib/api.js";
import { garantirEquipePadrao } from "../lib/funcionarios-padrao.js";
import {
    chaveMes,
    intervaloSemana,
    partirChaveMes,
    proximoMesChave,
    quantidadeSemanas,
    rotuloMes
} from "../lib/colaborativo.js";

const hoje = new Date();
const mesAtual = chaveMes(hoje.getFullYear(), hoje.getMonth() + 1);

export default function Colaborativo() {
    const { toast } = useToast();
    const [funcionarios, setFuncionarios] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [meses, setMeses] = useState([mesAtual]);
    const [marcacoes, setMarcacoes] = useState([]);
    const [mesChave, setMesChave] = useState(mesAtual);
    const [novoId, setNovoId] = useState("");
    const [limite, setLimite] = useState("1");
    const [rascunho, setRascunho] = useState({});

    const { ano, mes } = partirChaveMes(mesChave);
    const semanas = quantidadeSemanas(ano, mes);
    const idsNoQuadro = useMemo(() => new Set(professores.map((item) => String(item.employeeId))), [professores]);
    const disponiveis = funcionarios.filter((item) => !idsNoQuadro.has(String(item.id)));

    const recarregarProfessores = useCallback(async () => {
        const lista = await listarProfessoresColaborativo();
        setProfessores(lista);
    }, []);

    const recarregarMeses = useCallback(async () => {
        const lista = await listarMesesColaborativo();
        const unicos = [...new Set([mesAtual, ...lista])].sort();
        setMeses(unicos);
        return unicos;
    }, []);

    const recarregarMarcacoes = useCallback(async (chave) => {
        const lista = await listarMarcacoesColaborativo(chave);
        setMarcacoes(lista);
        setRascunho({});
    }, []);

    useEffect(() => {
        (async () => {
            try {
                await garantirEquipePadrao();
                const lista = await listarFuncionarios();
                setFuncionarios([...lista].sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR")));
                await recarregarProfessores();
                const mesesApi = await recarregarMeses();
                if (!mesesApi.includes(mesAtual)) {
                    await criarMesColaborativo(mesAtual);
                    await recarregarMeses();
                }
                await recarregarMarcacoes(mesAtual);
            } catch (error) {
                toast(mensagemErroApi(error), "error");
            }
        })();
    }, [recarregarMarcacoes, recarregarMeses, recarregarProfessores, toast]);

    async function abrirMes(chave) {
        try {
            await criarMesColaborativo(chave);
            const mesesApi = await recarregarMeses();
            setMesChave(chave);
            if (!mesesApi.includes(chave)) {
                setMeses((atual) => [...new Set([...atual, chave])].sort());
            }
            await recarregarMarcacoes(chave);
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    async function abrirProximoMes() {
        const ultimo = [...meses].sort().at(-1) || mesChave;
        await abrirMes(proximoMesChave(ultimo));
    }

    async function adicionar() {
        const funcionario = funcionarios.find((item) => String(item.id) === String(novoId));
        const weeklyLimit = Number(limite);
        if (!funcionario) {
            toast("Selecione o professor.", "error");
            return;
        }
        if (!weeklyLimit || weeklyLimit < 1) {
            toast("Informe quantos colaborativos ele pode dar por semana.", "error");
            return;
        }
        try {
            await adicionarProfessorColaborativo({ employeeId: Number(funcionario.id), weeklyLimit });
            setNovoId("");
            setLimite("1");
            await recarregarProfessores();
            toast(`${funcionario.name} entrou no colaborativo.`);
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    async function remover(id) {
        try {
            await excluirProfessorColaborativo(id);
            await recarregarProfessores();
            await recarregarMarcacoes(mesChave);
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    function valorCelula(teacherId, semana) {
        const chave = `${teacherId}-${semana}`;
        if (rascunho[chave] !== undefined) return rascunho[chave];
        const item = marcacoes.find((marcacao) => Number(marcacao.teacherId) === Number(teacherId) && Number(marcacao.week) === semana);
        return Number(item?.count || 0);
    }

    async function confirmarMarcacao(teacherId, semana, weeklyLimit) {
        const quantidade = Math.max(0, Number(valorCelula(teacherId, semana)) || 0);
        if (quantidade > weeklyLimit) {
            toast(`O limite deste professor é ${weeklyLimit} por semana.`, "error");
            return;
        }
        try {
            await salvarMarcacaoColaborativo({
                teacherId: Number(teacherId),
                yearMonth: mesChave,
                week: semana,
                count: quantidade
            });
            await recarregarMarcacoes(mesChave);
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    return (
        <>
            <PageHeader
                title="Colaborativo"
                description="Os meses e as marcações ficam salvos no banco. Troque pelo select ou abra o mês seguinte."
            />

            <Card icon={CalendarRange} title="Mês">
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <Field label="Mês armazenado">
                        <select className="input-app" value={mesChave} onChange={(e) => abrirMes(e.target.value)}>
                            {meses.map((chave) => (
                                <option key={chave} value={chave}>{rotuloMes(chave)}</option>
                            ))}
                        </select>
                    </Field>
                    <div className="flex items-end pb-4">
                        <button type="button" className="btn-primary w-full md:w-auto" onClick={abrirProximoMes}>
                            Abrir próximo mês
                        </button>
                    </div>
                </div>
            </Card>

            <Card icon={Users} title="Professores do colaborativo" delay={40}>
                <div className="grid gap-4 md:grid-cols-[1fr_160px_auto]">
                    <Field label="Professor">
                        <select className="input-app" value={novoId} onChange={(e) => setNovoId(e.target.value)}>
                            <option value="">Selecione o professor</option>
                            {disponiveis.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Por semana">
                        <input type="number" min="1" max="20" className="input-app" value={limite} onChange={(e) => setLimite(e.target.value)} />
                    </Field>
                    <div className="flex items-end pb-4">
                        <button type="button" className="btn-primary w-full md:w-auto" onClick={adicionar}>Adicionar</button>
                    </div>
                </div>
            </Card>

            <Card title={`Quadro · ${rotuloMes(mesChave)}`} delay={80}>
                {professores.length === 0 ? (
                    <p style={{ color: "var(--app-muted)" }}>Nenhum professor no colaborativo ainda.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 z-10 bg-white p-3 text-left font-extrabold" style={{ color: "var(--app-primary)" }}>
                                        Professor
                                    </th>
                                    {Array.from({ length: semanas }, (_, index) => {
                                        const semana = index + 1;
                                        const { inicio, fim } = intervaloSemana(ano, mes, semana);
                                        return (
                                            <th key={semana} className="p-3 text-center font-extrabold" style={{ color: "var(--app-primary)" }}>
                                                Semana {semana}
                                                <span className="mt-1 block text-xs font-medium" style={{ color: "var(--app-muted)" }}>
                                                    {String(inicio).padStart(2, "0")} a {String(fim).padStart(2, "0")}
                                                </span>
                                            </th>
                                        );
                                    })}
                                    <th className="w-14 p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {professores.map((professor) => (
                                    <tr key={professor.id}>
                                        <td className="sticky left-0 z-10 border-t bg-white p-3" style={{ borderColor: "var(--app-border)" }}>
                                            <strong className="block">{professor.name}</strong>
                                            <span className="text-xs" style={{ color: "var(--app-muted)" }}>
                                                até {professor.weeklyLimit} por semana
                                            </span>
                                        </td>
                                        {Array.from({ length: semanas }, (_, index) => {
                                            const semana = index + 1;
                                            const valor = valorCelula(professor.id, semana);
                                            const estourou = valor > professor.weeklyLimit;
                                            const completo = valor === professor.weeklyLimit;
                                            return (
                                                <td key={semana} className="border-t p-2 text-center" style={{ borderColor: "var(--app-border)" }}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="input-app mx-auto max-w-[88px] text-center font-bold"
                                                        value={valor}
                                                        onChange={(e) => setRascunho((atual) => ({ ...atual, [`${professor.id}-${semana}`]: e.target.value }))}
                                                        onBlur={() => confirmarMarcacao(professor.id, semana, professor.weeklyLimit)}
                                                        style={{
                                                            borderColor: estourou ? "var(--app-accent)" : completo ? "var(--app-primary)" : "var(--app-border)",
                                                            background: estourou ? "color-mix(in srgb, var(--app-accent) 12%, white)" : "var(--app-card)"
                                                        }}
                                                    />
                                                </td>
                                            );
                                        })}
                                        <td className="border-t p-2" style={{ borderColor: "var(--app-border)" }}>
                                            <button type="button" className="btn-secondary px-3" onClick={() => remover(professor.id)} title="Remover">
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </>
    );
}
