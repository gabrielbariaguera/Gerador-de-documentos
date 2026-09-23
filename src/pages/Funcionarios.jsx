import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import {
    atualizarFuncionario,
    criarFuncionario,
    excluirAbono,
    excluirFuncionario,
    LIMITE_ABONOS_POR_ANO,
    listarAbonosPorFuncionario,
    listarFuncionarios,
    mensagemErroApi
} from "../lib/api.js";
import { garantirEquipePadrao } from "../lib/funcionarios-padrao.js";
import { formatarDataBr } from "../lib/docx.js";

function dataIso(valor) {
    return String(valor || "").slice(0, 10);
}

export default function Funcionarios() {
    const { toast } = useToast();
    const [lista, setLista] = useState([]);
    const [novo, setNovo] = useState({ code: "", name: "", position: "", birthday: "" });
    const [selecionado, setSelecionado] = useState("");
    const [abonos, setAbonos] = useState([]);

    async function carregar() {
        try {
            const funcionarios = await garantirEquipePadrao();
            setLista([...funcionarios].sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR")));
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    async function cadastrar() {
        if (!novo.code || !novo.name || !novo.position || !novo.birthday) {
            toast("Preencha código, nome, cargo e nascimento.", "error");
            return;
        }
        try {
            await criarFuncionario({ ...novo, code: Number(novo.code) });
            toast("Funcionário cadastrado com sucesso.");
            setNovo({ code: "", name: "", position: "", birthday: "" });
            await carregar();
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    async function salvar(item) {
        try {
            await atualizarFuncionario(item.id, {
                code: Number(item.code),
                name: item.name,
                position: item.position,
                birthday: item.birthday
            });
            toast("Funcionário atualizado.");
            await carregar();
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    async function carregarAbonos(id) {
        setSelecionado(id);
        const funcionario = lista.find((item) => String(item.id) === String(id));
        if (!funcionario) {
            setAbonos([]);
            return;
        }
        try {
            setAbonos(await listarAbonosPorFuncionario(funcionario.name));
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    const porAno = abonos.reduce((acc, abono) => {
        const ano = String(abono.date || "").slice(0, 4) || "Sem data";
        acc[ano] = acc[ano] || [];
        acc[ano].push(abono);
        return acc;
    }, {});

    return (
        <>
            <PageHeader title="Funcionários" description="Cadastre funcionários e acompanhe a quantidade de abonos por ano" />
            <Card icon={Users} title="Novo funcionário">
                <div className="grid gap-4 md:grid-cols-4">
                    <Field label="Código"><input className="input-app" value={novo.code} onChange={(e) => setNovo({ ...novo, code: e.target.value })} /></Field>
                    <Field label="Nome"><input className="input-app" value={novo.name} onChange={(e) => setNovo({ ...novo, name: e.target.value })} /></Field>
                    <Field label="Cargo"><input className="input-app" value={novo.position} onChange={(e) => setNovo({ ...novo, position: e.target.value })} /></Field>
                    <Field label="Nascimento"><input type="date" className="input-app" value={novo.birthday} onChange={(e) => setNovo({ ...novo, birthday: e.target.value })} /></Field>
                </div>
                <button type="button" className="btn-primary" onClick={cadastrar}>Cadastrar</button>
            </Card>
            <Card title="Lista">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr style={{ color: "var(--app-primary)" }}>
                                <th className="p-2">Código</th>
                                <th className="p-2">Nome</th>
                                <th className="p-2">Cargo</th>
                                <th className="p-2">Nascimento</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map((item) => (
                                <tr key={item.id} className="border-t" style={{ borderColor: "var(--app-border)" }}>
                                    <td className="p-2"><input className="input-app" value={item.code ?? ""} onChange={(e) => setLista((a) => a.map((f) => f.id === item.id ? { ...f, code: e.target.value } : f))} /></td>
                                    <td className="p-2"><input className="input-app" value={item.name ?? ""} onChange={(e) => setLista((a) => a.map((f) => f.id === item.id ? { ...f, name: e.target.value } : f))} /></td>
                                    <td className="p-2"><input className="input-app" value={item.position ?? ""} onChange={(e) => setLista((a) => a.map((f) => f.id === item.id ? { ...f, position: e.target.value } : f))} /></td>
                                    <td className="p-2"><input type="date" className="input-app" value={dataIso(item.birthday)} onChange={(e) => setLista((a) => a.map((f) => f.id === item.id ? { ...f, birthday: e.target.value } : f))} /></td>
                                    <td className="flex gap-2 p-2">
                                        <button type="button" className="btn-primary" onClick={() => salvar(item)}>Salvar</button>
                                        <button type="button" className="btn-secondary" onClick={async () => {
                                            try {
                                                await excluirFuncionario(item.id);
                                                toast("Funcionário removido.");
                                                await carregar();
                                            } catch (error) {
                                                toast(mensagemErroApi(error), "error");
                                            }
                                        }}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <Card title="Abonos do funcionário">
                <Field label="Funcionário">
                    <select className="input-app" value={selecionado} onChange={(e) => carregarAbonos(e.target.value)}>
                        <option value="">Selecione o funcionário</option>
                        {lista.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                </Field>
                {Object.keys(porAno).length === 0 ? (
                    <p style={{ color: "var(--app-muted)" }}>Selecione um funcionário para ver os abonos.</p>
                ) : Object.entries(porAno).sort((a, b) => b[0].localeCompare(a[0])).map(([ano, itens]) => (
                    <div key={ano} className="mb-3 rounded-[10px] border p-4" style={{ borderColor: "var(--app-border)" }}>
                        <p className="mb-2 font-bold">{ano} — {itens.length} / {LIMITE_ABONOS_POR_ANO}</p>
                        {itens.map((abono) => (
                            <div key={abono.id} className="mb-2 flex items-center justify-between">
                                <span>{formatarDataBr(dataIso(abono.date))}</span>
                                <button type="button" className="btn-secondary" onClick={async () => {
                                    try {
                                        await excluirAbono(abono.id);
                                        toast("Abono removido. A vaga daquele ano foi liberada.");
                                        await carregarAbonos(selecionado);
                                    } catch (error) {
                                        toast(mensagemErroApi(error), "error");
                                    }
                                }}>Excluir</button>
                            </div>
                        ))}
                    </div>
                ))}
            </Card>
        </>
    );
}
