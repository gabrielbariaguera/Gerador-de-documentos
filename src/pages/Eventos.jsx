import { useEffect, useState } from "react";
import { CalendarDays, User } from "lucide-react";
import { Actions, Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { buscarFuncionario, listarFuncionarios, mensagemErroApi } from "../lib/api.js";
import { garantirEquipePadrao } from "../lib/funcionarios-padrao.js";
import { caminhoModelo, camposVazios, formatarDataPorExtenso, gerarDocumentoDocx } from "../lib/docx.js";

const EVENTOS = {
    pais: { rotulo: "Dia dos pais", arquivo: "dia pais.docx" }
};

export default function Eventos() {
    const { toast } = useToast();
    const [funcionarios, setFuncionarios] = useState([]);
    const [form, setForm] = useState({ tipoEvento: "", employeeId: "", dataEvento: "" });
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
            tipoEvento: "evento",
            employeeId: "nome do funcionário",
            dataEvento: "data do evento"
        });
        if (faltando.length) {
            toast(`Preencha: ${faltando.join(", ")}.`, "error");
            return;
        }
        const evento = EVENTOS[form.tipoEvento];
        setLoading(true);
        try {
            const funcionario = await buscarFuncionario(Number(form.employeeId));
            await gerarDocumentoDocx({
                modeloRelativo: caminhoModelo(evento.arquivo),
                dados: {
                    nome: funcionario.name,
                    cod: funcionario.code,
                    cargo: funcionario.position,
                    dataAbono: formatarDataPorExtenso(form.dataEvento),
                    dataEvento: formatarDataPorExtenso(form.dataEvento),
                    data: formatarDataPorExtenso()
                },
                outputName: `${evento.rotulo}-${funcionario.name}.docx`,
                registro: { name: `${evento.rotulo} - ${funcionario.name}`, type: "event", employeeId: Number(form.employeeId) },
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
            <PageHeader title="Gerador de Eventos" description="Documentos de datas comemorativas. Não entram no limite de 6 abonos por ano." />
            <Card icon={CalendarDays} title="Evento">
                <Field label="Tipo de evento:">
                    <select className="input-app" value={form.tipoEvento} onChange={(e) => setForm({ ...form, tipoEvento: e.target.value })}>
                        <option value="">Selecione o evento</option>
                        <option value="pais">Dia dos pais</option>
                    </select>
                </Field>
            </Card>
            <Card icon={User} title="Dados do Funcionário" delay={40}>
                <Field label="Nome do funcionário:">
                    <select className="input-app" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                        <option value="">Selecione o funcionário</option>
                        {funcionarios.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                </Field>
            </Card>
            <Card title="Data" delay={80}>
                <Field label="Data do evento:">
                    <input type="date" className="input-app" value={form.dataEvento} onChange={(e) => setForm({ ...form, dataEvento: e.target.value })} />
                </Field>
            </Card>
            <Actions onClear={() => setForm({ tipoEvento: "", employeeId: "", dataEvento: "" })} onSubmit={gerar} loading={loading} />
        </>
    );
}
