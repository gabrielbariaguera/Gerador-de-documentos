import { useEffect, useMemo, useState } from "react";
import { CalendarRange, Trash2, Users } from "lucide-react";
import { Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { listarFuncionarios, mensagemErroApi } from "../lib/api.js";
import { garantirEquipePadrao } from "../lib/funcionarios-padrao.js";
import {
    carregarColaborativo,
    chaveMes,
    garantirMes,
    intervaloSemana,
    partirChaveMes,
    proximoMesChave,
    quantidadeSemanas,
    rotuloMes,
    salvarColaborativo
} from "../lib/colaborativo.js";

const hoje = new Date();

export default function Colaborativo() {
    const { toast } = useToast();
    const [funcionarios, setFuncionarios] = useState([]);
    const [estado, setEstado] = useState(() => {
        const inicial = carregarColaborativo();
        return garantirMes(inicial, chaveMes(hoje.getFullYear(), hoje.getMonth() + 1));
    });
    const [mesChave, setMesChave] = useState(() => chaveMes(hoje.getFullYear(), hoje.getMonth() + 1));
    const [novoId, setNovoId] = useState("");
    const [limite, setLimite] = useState("1");

    const { ano, mes } = partirChaveMes(mesChave);
    const semanas = quantidadeSemanas(ano, mes);
    const idsNoQuadro = useMemo(() => new Set(estado.professores.map((item) => String(item.employeeId))), [estado.professores]);
    const disponiveis = funcionarios.filter((item) => !idsNoQuadro.has(String(item.id)));

    useEffect(() => {
        (async () => {
            try {
                await garantirEquipePadrao();
                const lista = await listarFuncionarios();
                setFuncionarios([...lista].sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR")));
            } catch (error) {
                toast(mensagemErroApi(error), "error");
            }
        })();
    }, [toast]);

    function persistir(proximo) {
        setEstado(proximo);
        salvarColaborativo(proximo);
    }

    function abrirMes(chave) {
        const proximo = garantirMes(estado, chave);
        persistir(proximo);
        setMesChave(chave);
    }

    function abrirProximoMes() {
        const ultimo = [...estado.meses].sort().at(-1) || mesChave;
        abrirMes(proximoMesChave(ultimo));
    }

    function adicionar() {
        const funcionario = funcionarios.find((item) => String(item.id) === String(novoId));
        const limiteSemana = Number(limite);
        if (!funcionario) {
            toast("Selecione o professor.", "error");
            return;
        }
        if (!limiteSemana || limiteSemana < 1) {
            toast("Informe quantos colaborativos ele pode dar por semana.", "error");
            return;
        }
        persistir({
            ...estado,
            professores: [
                ...estado.professores,
                {
                    id: crypto.randomUUID(),
                    employeeId: funcionario.id,
                    name: funcionario.name,
                    limiteSemana
                }
            ]
        });
        setNovoId("");
        setLimite("1");
        toast(`${funcionario.name} entrou no colaborativo.`);
    }

    function remover(id) {
        persistir({
            ...estado,
            professores: estado.professores.filter((item) => item.id !== id)
        });
    }

    function valorCelula(professorId, semana) {
        return Number(estado.registros?.[mesChave]?.[professorId]?.[semana] || 0);
    }

    function marcar(professorId, semana, valor, limiteSemana) {
        const quantidade = Math.max(0, Number(valor) || 0);
        if (quantidade > limiteSemana) {
            toast(`O limite deste professor é ${limiteSemana} por semana.`, "error");
        }
        const registrosMes = { ...(estado.registros[mesChave] || {}) };
        const doProfessor = { ...(registrosMes[professorId] || {}) };
        doProfessor[semana] = quantidade;
        registrosMes[professorId] = doProfessor;
        persistir({
            ...estado,
            registros: { ...estado.registros, [mesChave]: registrosMes }
        });
    }

    return (
        <>
            <PageHeader
                title="Colaborativo"
                description="Os meses usados ficam salvos. Troque pelo select ou abra o mês seguinte."
            />

            <Card icon={CalendarRange} title="Mês">
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <Field label="Mês armazenado">
                        <select className="input-app" value={mesChave} onChange={(e) => abrirMes(e.target.value)}>
                            {estado.meses.map((chave) => (
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
                        <input
                            type="number"
                            min="1"
                            max="20"
                            className="input-app"
                            value={limite}
                            onChange={(e) => setLimite(e.target.value)}
                        />
                    </Field>
                    <div className="flex items-end pb-4">
                        <button type="button" className="btn-primary w-full md:w-auto" onClick={adicionar}>Adicionar</button>
                    </div>
                </div>
            </Card>

            <Card title={`Quadro · ${rotuloMes(mesChave)}`} delay={80}>
                {estado.professores.length === 0 ? (
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
                                {estado.professores.map((professor) => (
                                    <tr key={professor.id}>
                                        <td className="sticky left-0 z-10 border-t bg-white p-3" style={{ borderColor: "var(--app-border)" }}>
                                            <strong className="block">{professor.name}</strong>
                                            <span className="text-xs" style={{ color: "var(--app-muted)" }}>
                                                até {professor.limiteSemana} por semana
                                            </span>
                                        </td>
                                        {Array.from({ length: semanas }, (_, index) => {
                                            const semana = index + 1;
                                            const valor = valorCelula(professor.id, semana);
                                            const estourou = valor > professor.limiteSemana;
                                            const completo = valor === professor.limiteSemana;
                                            return (
                                                <td key={semana} className="border-t p-2 text-center" style={{ borderColor: "var(--app-border)" }}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="input-app mx-auto max-w-[88px] text-center font-bold"
                                                        value={valor}
                                                        onChange={(e) => marcar(professor.id, semana, e.target.value, professor.limiteSemana)}
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
