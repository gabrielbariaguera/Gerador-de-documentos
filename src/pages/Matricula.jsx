import { useState } from "react";
import { GraduationCap, Home, School, Users } from "lucide-react";
import { Actions, Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { caminhoModelo, camposVazios, formatarDataBr, formatarDataPorExtenso, gerarDocumentoDocx } from "../lib/docx.js";

function marcarSimNao(valor) {
    if (valor === "sim") return { sim: "X", nao: "" };
    if (valor === "nao") return { sim: "", nao: "X" };
    return { sim: "", nao: "" };
}

function marcarNovaAntiga(valor) {
    if (valor === "nova") return { nova: "X", antiga: "" };
    if (valor === "antiga") return { nova: "", antiga: "X" };
    return { nova: "", antiga: "" };
}

const VAZIO = {
    nomeAluno: "", rmAluno: "", generoAluno: "", nascimentoAluno: "", cpfAluno: "", raAluno: "",
    nacionalidadeAluno: "", naturalidadeAluno: "", tipoCertidao: "", matriculaCertidao: "",
    maeAluno: "", telMae: "", paiAluno: "", telPai: "", ruaAluno: "", numeroCasaAluno: "",
    bairroAluno: "", transporte: "", atendimentoEspecial: "", cidAluno: "", restricaoAlimentar: "",
    resAlimentar: "", escolaAntiga: "", cidadeEscolaAntiga: "", ufEscolaAntiga: ""
};

export default function Matricula() {
    const { toast } = useToast();
    const [form, setForm] = useState(VAZIO);
    const [loading, setLoading] = useState(false);
    const set = (chave, valor) => setForm((atual) => ({ ...atual, [chave]: valor }));

    async function gerar() {
        const rotulos = {
            nomeAluno: "nome do aluno", rmAluno: "RM", generoAluno: "gênero", nascimentoAluno: "data de nascimento",
            cpfAluno: "CPF", raAluno: "RA", nacionalidadeAluno: "nacionalidade", naturalidadeAluno: "naturalidade",
            tipoCertidao: "tipo da certidão", matriculaCertidao: "nº de matrícula da certidão", maeAluno: "nome da mãe",
            telMae: "telefone da mãe", paiAluno: "nome do pai", telPai: "telefone do pai", ruaAluno: "rua",
            numeroCasaAluno: "número da residência", bairroAluno: "bairro", transporte: "transporte",
            atendimentoEspecial: "atendimento especial", restricaoAlimentar: "restrição alimentar",
            escolaAntiga: "escola de procedência", cidadeEscolaAntiga: "município da escola", ufEscolaAntiga: "UF da escola"
        };
        if (form.atendimentoEspecial === "sim") rotulos.cidAluno = "CID";
        if (form.restricaoAlimentar === "sim") rotulos.resAlimentar = "qual restrição alimentar";
        const faltando = camposVazios(form, rotulos);
        if (faltando.length) {
            toast(`Preencha: ${faltando.join(", ")}.`, "error");
            return;
        }

        const transporte = marcarSimNao(form.transporte);
        const atendimento = marcarSimNao(form.atendimentoEspecial);
        const restricao = marcarSimNao(form.restricaoAlimentar);
        const certidao = marcarNovaAntiga(form.tipoCertidao);
        setLoading(true);
        try {
            await gerarDocumentoDocx({
                modeloRelativo: caminhoModelo("FICHA DE MATRÍCULA.docx"),
                dados: {
                    ...form,
                    nascimentoAluno: formatarDataBr(form.nascimentoAluno),
                    nova: certidao.nova,
                    antiga: certidao.antiga,
                    transporteS: transporte.sim,
                    transporteN: transporte.nao,
                    aEspecialS: atendimento.sim,
                    aEspecialN: atendimento.nao,
                    cidAluno: form.atendimentoEspecial === "sim" ? form.cidAluno : "",
                    restricaoS: restricao.sim,
                    restricaoN: restricao.nao,
                    resAlimentar: form.restricaoAlimentar === "sim" ? form.resAlimentar : "",
                    anoAtual: String(new Date().getFullYear()),
                    dataAtual: formatarDataPorExtenso()
                },
                outputName: `matricula-${form.nomeAluno}.docx`,
                registro: { name: `Matrícula - ${form.nomeAluno}`, type: "enrollment" },
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
            <PageHeader title="Gerador de Ficha de Matrícula" description="Preencha os dados abaixo para gerar a ficha cadastral de matrícula em Word" />
            <Card icon={GraduationCap} title="Dados do aluno">
                <Field label="Nome do aluno:" full>
                    <input className="input-app" value={form.nomeAluno} onChange={(e) => set("nomeAluno", e.target.value)} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="RM:"><input className="input-app" value={form.rmAluno} onChange={(e) => set("rmAluno", e.target.value)} /></Field>
                    <Field label="Gênero:">
                        <select className="input-app" value={form.generoAluno} onChange={(e) => set("generoAluno", e.target.value)}>
                            <option value="">Selecione</option>
                            <option>Masculino</option>
                            <option>Feminino</option>
                        </select>
                    </Field>
                    <Field label="Data de nascimento:"><input type="date" className="input-app" value={form.nascimentoAluno} onChange={(e) => set("nascimentoAluno", e.target.value)} /></Field>
                    <Field label="CPF:"><input className="input-app" value={form.cpfAluno} onChange={(e) => set("cpfAluno", e.target.value)} /></Field>
                    <Field label="RA:"><input className="input-app" value={form.raAluno} onChange={(e) => set("raAluno", e.target.value)} /></Field>
                    <Field label="Nacionalidade:"><input className="input-app" value={form.nacionalidadeAluno} onChange={(e) => set("nacionalidadeAluno", e.target.value)} /></Field>
                    <Field label="Naturalidade:" full><input className="input-app" value={form.naturalidadeAluno} onChange={(e) => set("naturalidadeAluno", e.target.value)} /></Field>
                </div>
            </Card>
            <Card title="Certidão" delay={40}>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Tipo da certidão:">
                        <select className="input-app" value={form.tipoCertidao} onChange={(e) => set("tipoCertidao", e.target.value)}>
                            <option value="">Selecione</option>
                            <option value="nova">Nova</option>
                            <option value="antiga">Antiga</option>
                        </select>
                    </Field>
                    <Field label="Nº de matrícula da certidão:"><input className="input-app" value={form.matriculaCertidao} onChange={(e) => set("matriculaCertidao", e.target.value)} /></Field>
                </div>
            </Card>
            <Card icon={Users} title="Filiação" delay={80}>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nome da mãe:"><input className="input-app" value={form.maeAluno} onChange={(e) => set("maeAluno", e.target.value)} /></Field>
                    <Field label="Telefone da mãe:"><input className="input-app" value={form.telMae} onChange={(e) => set("telMae", e.target.value)} /></Field>
                    <Field label="Nome do pai:"><input className="input-app" value={form.paiAluno} onChange={(e) => set("paiAluno", e.target.value)} /></Field>
                    <Field label="Telefone do pai:"><input className="input-app" value={form.telPai} onChange={(e) => set("telPai", e.target.value)} /></Field>
                </div>
            </Card>
            <Card icon={Home} title="Residência e transporte" delay={120}>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Rua:"><input className="input-app" value={form.ruaAluno} onChange={(e) => set("ruaAluno", e.target.value)} /></Field>
                    <Field label="Nº:"><input className="input-app" value={form.numeroCasaAluno} onChange={(e) => set("numeroCasaAluno", e.target.value)} /></Field>
                    <Field label="Bairro:"><input className="input-app" value={form.bairroAluno} onChange={(e) => set("bairroAluno", e.target.value)} /></Field>
                    <Field label="Transporte:">
                        <select className="input-app" value={form.transporte} onChange={(e) => set("transporte", e.target.value)}>
                            <option value="">Selecione</option>
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </Field>
                </div>
            </Card>
            <Card title="Informações adicionais">
                <Field label="Necessita de atendimento especial:">
                    <select className="input-app" value={form.atendimentoEspecial} onChange={(e) => set("atendimentoEspecial", e.target.value)}>
                        <option value="">Selecione</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                </Field>
                {form.atendimentoEspecial === "sim" ? (
                    <Field label="CID:" full><input className="input-app" value={form.cidAluno} onChange={(e) => set("cidAluno", e.target.value)} /></Field>
                ) : null}
                <Field label="Restrição alimentar:">
                    <select className="input-app" value={form.restricaoAlimentar} onChange={(e) => set("restricaoAlimentar", e.target.value)}>
                        <option value="">Selecione</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                </Field>
                {form.restricaoAlimentar === "sim" ? (
                    <Field label="Qual:" full><input className="input-app" value={form.resAlimentar} onChange={(e) => set("resAlimentar", e.target.value)} /></Field>
                ) : null}
            </Card>
            <Card icon={School} title="Procedência do aluno">
                <Field label="Escola:" full><input className="input-app" value={form.escolaAntiga} onChange={(e) => set("escolaAntiga", e.target.value)} /></Field>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Município:"><input className="input-app" value={form.cidadeEscolaAntiga} onChange={(e) => set("cidadeEscolaAntiga", e.target.value)} /></Field>
                    <Field label="UF:"><input className="input-app" value={form.ufEscolaAntiga} onChange={(e) => set("ufEscolaAntiga", e.target.value)} /></Field>
                </div>
            </Card>
            <Actions onClear={() => setForm(VAZIO)} onSubmit={gerar} loading={loading} />
        </>
    );
}
