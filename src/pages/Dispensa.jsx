import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Actions, Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { buscarFuncionario, listarFuncionarios, mensagemErroApi } from "../lib/api.js";
import { garantirEquipePadrao } from "../lib/funcionarios-padrao.js";
import { caminhoModelo, camposVazios, formatarDataPorExtenso, gerarDocumentoDocx } from "../lib/docx.js";

const DIAS = { 1: "um", 2: "dois", 3: "três", 4: "quatro", 5: "cinco" };

export default function Dispensa() {
    const { toast } = useToast();
    const [funcionarios, setFuncionarios] = useState([]);
    const [form, setForm] = useState({ employeeId: "", dataDisp: "", diasDisp: "1" });
    const [loading, setLoading] = useState(false);

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

    async function gerar() {
        const faltando = camposVazios(form, {
            employeeId: "nome do funcionário",
            dataDisp: "data da dispensa",
            diasDisp: "quantidade de dias"
        });
        if (faltando.length) {
            toast(`Preencha: ${faltando.join(", ")}.`, "error");
            return;
        }
        setLoading(true);
        try {
            const funcionario = await buscarFuncionario(Number(form.employeeId));
            await gerarDocumentoDocx({
                modeloRelativo: caminhoModelo("MODELO - PEDIDO DISPENSA.docx"),
                dados: {
                    nome: funcionario.name,
                    cod: funcionario.code,
                    cargo: funcionario.position,
                    dataDispensa: formatarDataPorExtenso(form.dataDisp),
                    dia: form.diasDisp,
                    diaExtenso: DIAS[form.diasDisp] || form.diasDisp,
                    data: formatarDataPorExtenso()
                },
                outputName: `Dispensa-${funcionario.name}.docx`,
                registro: { name: `Dispensa - ${funcionario.name}`, type: "exemption", employeeId: Number(form.employeeId) },
                toast
            });
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <PageHeader title="Gerador de Dispensa" description="Preencha os dados abaixo para gerar um novo documento" />
            <Card icon={User} title="Dados do Funcionário">
                <Field label="Nome do funcionário:">
                    <select className="input-app" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                        <option value="">Selecione o funcionário</option>
                        {funcionarios.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                </Field>
            </Card>
            <Card title="Informações da dispensa" delay={40}>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Data da dispensa:">
                        <input type="date" className="input-app" value={form.dataDisp} onChange={(e) => setForm({ ...form, dataDisp: e.target.value })} />
                    </Field>
                    <Field label="Quantidade de dias:">
                        <select className="input-app" value={form.diasDisp} onChange={(e) => setForm({ ...form, diasDisp: e.target.value })}>
                            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </Field>
                </div>
            </Card>
            <Actions onClear={() => setForm({ employeeId: "", dataDisp: "", diasDisp: "1" })} onSubmit={gerar} loading={loading} />
        </>
    );
}
