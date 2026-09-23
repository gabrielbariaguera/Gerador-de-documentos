import { useState } from "react";
import { GraduationCap, UserPen } from "lucide-react";
import { Actions, Card, Field, PageHeader } from "../components/Ui.jsx";
import { camposVazios, caminhoModelo, formatarDataBr, formatarDataPorExtenso, gerarDocumentoDocx } from "../lib/docx.js";
import { useToast } from "../components/Toast.jsx";

const EMISSORES = {
    gabriel: { nome: "Gabriel Aguera Baria", cargo: "ESTAGIÁRIO" },
    julia: { nome: "Julia de Lima Batista", cargo: "ESCRITUÁRIA" },
    thayna: { nome: "Thayna Vitória Andrade Queiroz", cargo: "ESTAGIÁRIA" }
};

const VAZIO = { nomeAluno: "", raAluno: "", nascimento: "", serie: "", emissor: "" };

export default function Transferencia() {
    const { toast } = useToast();
    const [form, setForm] = useState(VAZIO);
    const [loading, setLoading] = useState(false);

    function set(chave, valor) {
        setForm((atual) => ({ ...atual, [chave]: valor }));
    }

    async function gerar() {
        const faltando = camposVazios(form, {
            nomeAluno: "nome do aluno",
            raAluno: "RA do aluno",
            nascimento: "data de nascimento",
            emissor: "emissor do documento",
            serie: "série do aluno"
        });
        if (faltando.length) {
            toast(`Preencha: ${faltando.join(", ")}.`, "error");
            return;
        }

        setLoading(true);
        try {
            const emissorInfo = EMISSORES[form.emissor];
            await gerarDocumentoDocx({
                modeloRelativo: caminhoModelo("DECLARAÇÃO OFICIAL - TRANSFERÊNCIA.docx"),
                dados: {
                    nome: form.nomeAluno,
                    ra: form.raAluno,
                    nascimento: formatarDataBr(form.nascimento),
                    data: formatarDataPorExtenso(),
                    emissor: emissorInfo.nome,
                    cargoEmissor: emissorInfo.cargo,
                    serie: form.serie
                },
                outputName: `declaracao-${form.nomeAluno}.docx`,
                registro: { name: `Transferência - ${form.nomeAluno}`, type: "transfer" },
                toast
            });
        } catch (error) {
            toast(error.message || "Erro ao gerar documento.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <PageHeader title="Gerador de Transferência" description="Preencha os dados abaixo para gerar um novo documento" />
            <Card icon={GraduationCap} title="Dados do Aluno">
                <Field label="Nome completo do aluno:" full>
                    <input className="input-app" value={form.nomeAluno} onChange={(e) => set("nomeAluno", e.target.value)} placeholder="Digite o nome completo" />
                </Field>
                <div className="grid gap-4 md:grid-cols-3">
                    <Field label="RA do aluno:">
                        <input className="input-app" value={form.raAluno} onChange={(e) => set("raAluno", e.target.value)} />
                    </Field>
                    <Field label="Data de nascimento:">
                        <input type="date" className="input-app" value={form.nascimento} onChange={(e) => set("nascimento", e.target.value)} />
                    </Field>
                    <Field label="Série:">
                        <select className="input-app" value={form.serie} onChange={(e) => set("serie", e.target.value)}>
                            <option value="">Selecione a série</option>
                            {["1º ano", "2º ano", "3º ano", "4º ano", "5º ano"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                    </Field>
                </div>
            </Card>
            <Card icon={UserPen} title="Emissor do Documento" delay={40}>
                <Field label="Responsável pela emissão:">
                    <select className="input-app" value={form.emissor} onChange={(e) => set("emissor", e.target.value)}>
                        <option value="">Selecione uma das opções</option>
                        <option value="julia">Julia</option>
                        <option value="gabriel">Gabriel</option>
                        <option value="thayna">Thayna</option>
                    </select>
                </Field>
            </Card>
            <Actions onClear={() => setForm(VAZIO)} onSubmit={gerar} loading={loading} />
        </>
    );
}
