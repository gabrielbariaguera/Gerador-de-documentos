import { useCallback, useEffect, useMemo, useState } from "react";
import { Pill, Search, Trash2 } from "lucide-react";
import { Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { formatarDataBr } from "../lib/docx.js";
import {
    buscarAlunoMedicamento,
    cadastrarAlunoMedicamento,
    excluirAlunoMedicamento,
    listarAlunosMedicamento,
    mensagemErroApi,
    registrarEntregaMedicamento
} from "../lib/api.js";
import { diaSeguinte, ultimaEntrega } from "../lib/medicamentos.js";

function dataValida(valor) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(valor || ""));
}

export default function Medicamentos() {
    const { toast } = useToast();
    const [alunos, setAlunos] = useState([]);
    const [nome, setNome] = useState("");
    const [data, setData] = useState("");
    const [busca, setBusca] = useState("");
    const [consulta, setConsulta] = useState(null);
    const [novasDatas, setNovasDatas] = useState({});

    const recarregar = useCallback(async (termo = busca) => {
        const lista = await listarAlunosMedicamento(termo.trim());
        setAlunos(lista);
        return lista;
    }, [busca]);

    useEffect(() => {
        recarregar("").catch((error) => toast(mensagemErroApi(error), "error"));
    }, [toast]);

    async function atualizarConsulta(id) {
        if (!id) {
            setConsulta(null);
            return;
        }
        const detalhe = await buscarAlunoMedicamento(id);
        setConsulta(detalhe);
    }

    async function cadastrar() {
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) {
            toast("Informe o nome do aluno.", "error");
            return;
        }
        if (!dataValida(data)) {
            toast("Informe o dia, o mês e o ano em que o aluno trouxe o remédio.", "error");
            return;
        }
        try {
            const aluno = await cadastrarAlunoMedicamento({ name: nomeLimpo, date: data });
            toast(aluno?.deliveries?.length > 1
                ? "Data registrada. O histórico anterior foi mantido."
                : "Aluno cadastrado no controle de medicamento.");
            setNome("");
            setData("");
            await recarregar("");
            if (aluno?.id) await atualizarConsulta(aluno.id);
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    async function salvarNovaData(aluno) {
        const novaData = novasDatas[aluno.id];
        if (!dataValida(novaData)) {
            toast("Escolha o dia, o mês e o ano completos antes de salvar.", "error");
            return;
        }
        const ultimo = ultimaEntrega(aluno);
        if (ultimo && novaData <= ultimo) {
            toast(`A data precisa ser depois de ${formatarDataBr(ultimo)}.`, "error");
            return;
        }
        try {
            await registrarEntregaMedicamento(aluno.id, novaData);
            setNovasDatas((atual) => ({ ...atual, [aluno.id]: "" }));
            toast("Novo dia registrado. As datas anteriores continuam no histórico.");
            await recarregar("");
            if (consulta?.id === aluno.id) await atualizarConsulta(aluno.id);
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    async function remover(id) {
        try {
            await excluirAlunoMedicamento(id);
            if (consulta?.id === id) setConsulta(null);
            await recarregar("");
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    const filtrados = useMemo(() => {
        const termo = busca.trim().toLocaleLowerCase("pt-BR");
        return [...alunos]
            .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"))
            .filter((aluno) => !termo || String(aluno.name).toLocaleLowerCase("pt-BR").includes(termo));
    }, [alunos, busca]);

    const historico = [...(consulta?.deliveries || [])]
        .map((dia) => String(dia).slice(0, 10))
        .filter(dataValida)
        .sort()
        .reverse();

    return (
        <>
            <PageHeader
                title="Controle de medicamento"
                description="Cadastre o aluno e o dia em que trouxe o remédio. Os registros ficam no banco e as datas antigas não são apagadas."
            />

            <Card icon={Pill} title="Registrar entrega">
                <div className="grid gap-4 md:grid-cols-[1fr_200px_auto]">
                    <Field label="Nome do aluno">
                        <input className="input-app" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome completo" />
                    </Field>
                    <Field label="Trouxe o remédio em">
                        <input type="date" className="input-app" value={data} onChange={(e) => setData(e.target.value)} />
                    </Field>
                    <div className="flex items-end pb-4">
                        <button type="button" className="btn-primary w-full md:w-auto" onClick={cadastrar}>Salvar</button>
                    </div>
                </div>
            </Card>

            <Card icon={Search} title="Alunos" delay={40}>
                <Field label="Buscar">
                    <input className="input-app" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Filtrar por nome" />
                </Field>
                {filtrados.length === 0 ? (
                    <p style={{ color: "var(--app-muted)" }}>Nenhum aluno cadastrado ainda.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr style={{ color: "var(--app-primary)" }}>
                                    <th className="p-2">Aluno</th>
                                    <th className="p-2">Último dia</th>
                                    <th className="p-2">Entregas</th>
                                    <th className="p-2">Nova data</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.map((aluno) => {
                                    const ultimo = ultimaEntrega(aluno);
                                    const minimo = diaSeguinte(ultimo);
                                    return (
                                        <tr key={aluno.id} className="border-t" style={{ borderColor: "var(--app-border)" }}>
                                            <td className="p-2 font-bold">{aluno.name}</td>
                                            <td className="p-2">{formatarDataBr(ultimo) || "-"}</td>
                                            <td className="p-2">{aluno.deliveryCount ?? aluno.deliveries?.length ?? 0}</td>
                                            <td className="p-2">
                                                <div className="flex min-w-[240px] items-center gap-2">
                                                    <input
                                                        type="date"
                                                        className="input-app"
                                                        min={minimo || undefined}
                                                        value={novasDatas[aluno.id] || ""}
                                                        onChange={(e) => setNovasDatas((atual) => ({ ...atual, [aluno.id]: e.target.value }))}
                                                    />
                                                    <button type="button" className="btn-primary" onClick={() => salvarNovaData(aluno)}>
                                                        Registrar
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="flex gap-2 p-2">
                                                <button type="button" className="btn-primary" onClick={() => atualizarConsulta(aluno.id).catch((error) => toast(mensagemErroApi(error), "error"))}>
                                                    Consultar
                                                </button>
                                                <button type="button" className="btn-secondary px-3" onClick={() => remover(aluno.id)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {consulta ? (
                <Card title={`Histórico · ${consulta.name}`} delay={80}>
                    <p className="mb-3 text-sm" style={{ color: "var(--app-muted)" }}>
                        Último dia: <strong>{formatarDataBr(ultimaEntrega(consulta)) || "-"}</strong>
                    </p>
                    <ul className="flex flex-col gap-2">
                        {historico.map((dia) => (
                            <li key={dia} className="rounded-md border px-4 py-3" style={{ borderColor: "var(--app-border)" }}>
                                {formatarDataBr(dia)}
                            </li>
                        ))}
                    </ul>
                </Card>
            ) : null}
        </>
    );
}
