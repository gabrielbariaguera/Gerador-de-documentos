import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Actions, Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { buscarFuncionario, cadastrarAbono, LIMITE_ABONOS_POR_ANO, listarFuncionarios, mensagemErroApi, quantidadeAbonosNoAno } from "../lib/api.js";
import { garantirEquipePadrao } from "../lib/funcionarios-padrao.js";
import { caminhoModelo, camposVazios, formatarDataPorExtenso, gerarDocumentoDocx } from "../lib/docx.js";

export default function Abonada() {
    const { toast } = useToast();
    const [funcionarios, setFuncionarios] = useState([]);
    const [employeeId, setEmployeeId] = useState("");
    const [dataAbono, setDataAbono] = useState("");
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
        const faltando = camposVazios({ employeeId, dataAbono }, { employeeId: "nome do funcionário", dataAbono: "data do abono" });
        if (faltando.length) {
            toast(`Preencha: ${faltando.join(", ")}.`, "error");
            return;
        }
        setLoading(true);
        try {
            const funcionario = await buscarFuncionario(Number(employeeId));
            const quantidade = await quantidadeAbonosNoAno(funcionario.name, dataAbono.slice(0, 4));
            if (quantidade >= LIMITE_ABONOS_POR_ANO) {
                toast(`${funcionario.name} já possui ${LIMITE_ABONOS_POR_ANO} abonos em ${dataAbono.slice(0, 4)}.`, "error");
                return;
            }
            try {
                await cadastrarAbono({ date: dataAbono, employeeId: Number(employeeId) });
            } catch (error) {
                toast(mensagemErroApi(error), "warning");
            }
            await gerarDocumentoDocx({
                modeloRelativo: caminhoModelo("MODELO - PEDIDO DE ABONO.docx"),
                dados: {
                    nome: funcionario.name,
                    cod: funcionario.code,
                    cargo: funcionario.position,
                    dataAbono: formatarDataPorExtenso(dataAbono),
                    data: formatarDataPorExtenso()
                },
                outputName: `Abono-${funcionario.name}.docx`,
                registro: { name: `Abono - ${funcionario.name}`, type: "allowance", employeeId: Number(employeeId) },
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
            <PageHeader title="Gerador de Abonadas" description="Este pedido conta no limite de 6 abonos por ano. Eventos como Dia dos pais ficam no menu Eventos." />
            <Card icon={User} title="Dados do Funcionário">
                <Field label="Nome do funcionário:">
                    <select className="input-app" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                        <option value="">Selecione o funcionário</option>
                        {funcionarios.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </Field>
            </Card>
            <Card title="Informações do abono" delay={40}>
                <Field label="Data do abono:">
                    <input type="date" className="input-app" value={dataAbono} onChange={(e) => setDataAbono(e.target.value)} />
                </Field>
            </Card>
            <Actions onClear={() => { setEmployeeId(""); setDataAbono(""); }} onSubmit={gerar} loading={loading} />
        </>
    );
}
