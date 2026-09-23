import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Actions, Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { caminhoModelo, camposVazios, formatarDataBr, gerarDocumentoDocx } from "../lib/docx.js";

const TOTAIS_PADRAO = {
    aulasBaseComum: "26",
    aulasDiversificada: "12",
    aulasSemanais: "38",
    aulasAnuais: "1520",
    cargaHorariaAnual: "1140"
};

const DISCIPLINAS = [
    { prefix: "lp", label: "Língua Portuguesa" },
    { prefix: "m", label: "Matemática" },
    { prefix: "h", label: "História" },
    { prefix: "g", label: "Geografia" },
    { prefix: "c", label: "Ciências" },
    { prefix: "a", label: "Arte" },
    { prefix: "ef", label: "Educação Física" },
    { prefix: "li", label: "Inglês" },
    { prefix: "pt", label: "Produção de Texto" },
    { prefix: "oe", label: "Orientação de Estudos" },
    { prefix: "oem", label: "Orientação de Estudos (Mat.)" },
    { prefix: "ass", label: "Assembleia" },
    { prefix: "pc", label: "Projeto Convivência" },
    { prefix: "pe", label: "Práticas Experimentais" },
    { prefix: "ti", label: "Tecnologia e Inovação" },
    { prefix: "cm", label: "Cultura e Movimento" },
    { prefix: "la", label: "Linguagens Artísticas" }
];

const NOTAS = ["B1", "B2", "B3", "B4", "F"];

function anoVazio() {
    return {
        anoLetivo: "", serieAno: "", estabelecimentoAno: "", municipioAno: "", ufAno: "",
        portugues: "", matematica: "", historia: "", geografia: "", ciencias: "", arte: "",
        educacaoFisica: "", ingles: "", producaoTexto: "", orientacaoEstudos: "", orientacaoEstudosMat: "",
        assembleia: "", projetoConvivencia: "", experienciaMatematica: "", praticasExperimentais: "",
        tecnologiaInovacao: "", linguagensArtisticas: "", educacaoSocioemocional: "", culturaMovimento: "",
        tipoTotais: "padrao", aulasBaseComum: "", aulasDiversificada: "", aulasSemanais: "", aulasAnuais: "", cargaHorariaAnual: ""
    };
}

function preencherPlaceholdersPorAno(dados, numero, ano) {
    const aliases = {
        ano: [`al${numero}`], serie: [`al${numero}Ano`], estabelecimento: [`estabelecimentoAL${numero}`],
        municipio: [`municipioAL${numero}`], uf: [`ufAL${numero}`],
        portugues: [`lpAl${numero}`, `lpA${numero}`], matematica: [`mAl${numero}`, `mA${numero}`],
        historia: [`hAl${numero}`, `hA${numero}`], geografia: [`gAl${numero}`, `gA${numero}`],
        ciencias: [`cAl${numero}`, `cA${numero}`], arte: [`aAl${numero}`, `aA${numero}`],
        educacaoFisica: [`efAl${numero}`, `efA${numero}`], ingles: [`liAl${numero}`, `liA${numero}`],
        producaoTexto: [`ptA${numero}`], orientacaoEstudos: [`oe${numero}`], orientacaoEstudosMat: [`oem${numero}`],
        assembleia: [`ass${numero}`, `assA${numero}`], projetoConvivencia: [`pcA${numero}`],
        praticasExperimentais: [`peA${numero}`], tecnologiaInovacao: [`ti${numero}`],
        linguagensArtisticas: [`laAl${numero}`, `laA${numero}`], educacaoSocioemocional: [`es${numero}`, `esA${numero}`],
        experienciaMatematica: [`em${numero}`, `emA${numero}`], culturaMovimento: [`cm${numero}`],
        aulasBaseComum: [`bc${numero}`], aulasDiversificada: [`dv${numero}`], aulasSemanais: [`as${numero}`],
        aulasAnuais: [`an${numero}`], cargaHorariaAnual: [`ha${numero}`]
    };
    const totais = ano.tipoTotais === "padrao" ? TOTAIS_PADRAO : ano;
    const valores = {
        ano: ano.anoLetivo, serie: ano.serieAno, estabelecimento: ano.estabelecimentoAno,
        municipio: ano.municipioAno, uf: ano.ufAno, portugues: ano.portugues, matematica: ano.matematica,
        historia: ano.historia, geografia: ano.geografia, ciencias: ano.ciencias, arte: ano.arte,
        educacaoFisica: ano.educacaoFisica, ingles: ano.ingles, producaoTexto: ano.producaoTexto,
        orientacaoEstudos: ano.orientacaoEstudos, orientacaoEstudosMat: ano.orientacaoEstudosMat,
        assembleia: ano.assembleia, projetoConvivencia: ano.projetoConvivencia, praticasExperimentais: ano.praticasExperimentais,
        tecnologiaInovacao: ano.tecnologiaInovacao, linguagensArtisticas: ano.linguagensArtisticas,
        educacaoSocioemocional: ano.educacaoSocioemocional, experienciaMatematica: ano.experienciaMatematica,
        culturaMovimento: ano.culturaMovimento, ...totais
    };
    Object.entries(aliases).forEach(([chave, placeholders]) => {
        placeholders.forEach((placeholder) => {
            dados[placeholder] = valores[chave];
        });
    });
}

const CAMPOS_ANO = [
    ["anoLetivo", "ANO:"], ["serieAno", "SÉRIE/ANO:"], ["estabelecimentoAno", "ESTABELECIMENTO:"],
    ["municipioAno", "MUNICÍPIO:"], ["ufAno", "UF:"], ["portugues", "Língua Portuguesa:"], ["matematica", "Matemática:"],
    ["historia", "História:"], ["geografia", "Geografia:"], ["ciencias", "Ciências:"], ["arte", "Arte:"],
    ["educacaoFisica", "Educação Física:"], ["ingles", "Inglês:"], ["producaoTexto", "Produção de Texto:"],
    ["orientacaoEstudos", "Orientação de Estudos:"], ["orientacaoEstudosMat", "Orientação de Estudos (Mat.):"],
    ["assembleia", "Assembleia:"], ["projetoConvivencia", "Projeto Convivência:"], ["experienciaMatematica", "Experiência Matemática:"],
    ["praticasExperimentais", "Práticas Experimentais:"], ["tecnologiaInovacao", "Tecnologia e Inovação:"],
    ["linguagensArtisticas", "Linguagens Artísticas:"], ["educacaoSocioemocional", "Educação Socioemocional:"],
    ["culturaMovimento", "Cultura e Movimento:"]
];

export default function Historico() {
    const { toast } = useToast();
    const [form, setForm] = useState({
        nomeAluno: "", raAluno: "", dataNascimento: "", municipioNascimento: "", ufNascimento: "",
        modeloHistorico: "padrao", anoAtual: "", dataSaida: ""
    });
    const [notas, setNotas] = useState({});
    const [anos, setAnos] = useState(() => Array.from({ length: 5 }, anoVazio));
    const [loading, setLoading] = useState(false);
    const transferencia = form.modeloHistorico === "transferencia";
    const set = (chave, valor) => setForm((atual) => ({ ...atual, [chave]: valor }));

    function atualizarAno(index, chave, valor) {
        setAnos((atual) => atual.map((ano, i) => (i === index ? { ...ano, [chave]: valor } : ano)));
    }

    async function gerar() {
        const rotulos = {
            nomeAluno: "nome do aluno",
            raAluno: "RA do aluno",
            dataNascimento: "data de nascimento",
            municipioNascimento: "município de nascimento",
            ufNascimento: "UF de nascimento"
        };
        if (transferencia) {
            rotulos.anoAtual = "série de saída";
            rotulos.dataSaida = "data de saída";
        }
        const faltando = camposVazios(form, rotulos);
        if (faltando.length) {
            toast(`Preencha: ${faltando.join(", ")}.`, "error");
            return;
        }

        const dados = {
            nomeAluno: form.nomeAluno,
            raAluno: form.raAluno,
            dataNascimento: formatarDataBr(form.dataNascimento),
            municipioNascimento: form.municipioNascimento,
            ufNascimento: form.ufNascimento,
            dataAtual: new Date().toLocaleDateString("pt-BR")
        };
        if (transferencia) {
            dados.anoAtual = form.anoAtual;
            dados.dataSaida = formatarDataBr(form.dataSaida);
            DISCIPLINAS.forEach(({ prefix }) => {
                NOTAS.forEach((bimestre) => {
                    dados[`${prefix}${bimestre}`] = notas[`${prefix}${bimestre}`] || "";
                });
            });
        }
        anos.forEach((ano, index) => preencherPlaceholdersPorAno(dados, index + 1, ano));

        const arquivo = transferencia ? "HISTÓRICO ESCOLAR TRANSF.docx" : "HISTÓRICO ESCOLAR.docx";
        const prefixo = transferencia ? "historico-transf" : "historico";
        setLoading(true);
        try {
            await gerarDocumentoDocx({
                modeloRelativo: caminhoModelo(arquivo),
                dados,
                outputName: `${prefixo}-${form.nomeAluno}.docx`,
                registro: { name: `Histórico escolar - ${form.nomeAluno}`, type: "schooling" },
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
            <PageHeader title="Histórico Escolar" description="Preencha os dados do aluno, o modelo e os anos letivos" />
            <Card icon={GraduationCap} title="Dados do aluno">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nome:" full><input className="input-app" value={form.nomeAluno} onChange={(e) => set("nomeAluno", e.target.value)} /></Field>
                    <Field label="RA:"><input className="input-app" value={form.raAluno} onChange={(e) => set("raAluno", e.target.value)} /></Field>
                    <Field label="Nascimento:"><input type="date" className="input-app" value={form.dataNascimento} onChange={(e) => set("dataNascimento", e.target.value)} /></Field>
                    <Field label="Município de nascimento:"><input className="input-app" value={form.municipioNascimento} onChange={(e) => set("municipioNascimento", e.target.value)} /></Field>
                    <Field label="UF:"><input className="input-app" value={form.ufNascimento} onChange={(e) => set("ufNascimento", e.target.value)} /></Field>
                    <Field label="Modelo:">
                        <select className="input-app" value={form.modeloHistorico} onChange={(e) => set("modeloHistorico", e.target.value)}>
                            <option value="padrao">Histórico padrão</option>
                            <option value="transferencia">Histórico transferência</option>
                        </select>
                    </Field>
                </div>
            </Card>

            {transferencia ? (
                <Card title="Dados de transferência">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Série de saída:">
                            <select className="input-app" value={form.anoAtual} onChange={(e) => set("anoAtual", e.target.value)}>
                                <option value="">Selecione</option>
                                {["1º ano", "2º ano", "3º ano", "4º ano", "5º ano"].map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </Field>
                        <Field label="Data de saída:"><input type="date" className="input-app" value={form.dataSaida} onChange={(e) => set("dataSaida", e.target.value)} /></Field>
                    </div>
                    {DISCIPLINAS.map(({ prefix, label }) => (
                        <div key={prefix} className="mb-3 rounded-[10px] border border-dashed p-3" style={{ borderColor: "var(--app-border)" }}>
                            <p className="mb-2 font-bold">{label}</p>
                            <div className="grid grid-cols-5 gap-2">
                                {NOTAS.map((bimestre) => (
                                    <Field key={bimestre} label={bimestre}>
                                        <input className="input-app" value={notas[`${prefix}${bimestre}`] || ""} onChange={(e) => setNotas((a) => ({ ...a, [`${prefix}${bimestre}`]: e.target.value }))} />
                                    </Field>
                                ))}
                            </div>
                        </div>
                    ))}
                </Card>
            ) : null}

            {anos.map((ano, index) => (
                <Card key={index} title={`Ano letivo ${index + 1}`}>
                    <div className="grid gap-4 md:grid-cols-2">
                        {CAMPOS_ANO.map(([chave, label]) => (
                            chave === "serieAno" ? (
                                <Field key={chave} label={label}>
                                    <select className="input-app" value={ano[chave]} onChange={(e) => atualizarAno(index, chave, e.target.value)}>
                                        <option value="">Selecione</option>
                                        {["1º ano", "2º ano", "3º ano", "4º ano", "5º ano"].map((s) => <option key={s}>{s}</option>)}
                                    </select>
                                </Field>
                            ) : (
                                <Field key={chave} label={label} full={chave === "estabelecimentoAno"}>
                                    <input className="input-app" value={ano[chave]} onChange={(e) => atualizarAno(index, chave, e.target.value)} />
                                </Field>
                            )
                        ))}
                        <Field label="TOTAIS DE AULAS:" full>
                            <select className="input-app" value={ano.tipoTotais} onChange={(e) => atualizarAno(index, "tipoTotais", e.target.value)}>
                                <option value="padrao">Ano letivo 2021 - 2026</option>
                                <option value="outros">Outros</option>
                            </select>
                        </Field>
                    </div>
                    {ano.tipoTotais === "outros" ? (
                        <div className="mt-2 grid gap-4 md:grid-cols-2">
                            <Field label="Total de aulas da base comum:"><input className="input-app" value={ano.aulasBaseComum} onChange={(e) => atualizarAno(index, "aulasBaseComum", e.target.value)} /></Field>
                            <Field label="Total da parte diversificada:"><input className="input-app" value={ano.aulasDiversificada} onChange={(e) => atualizarAno(index, "aulasDiversificada", e.target.value)} /></Field>
                            <Field label="Total de aulas semanais:"><input className="input-app" value={ano.aulasSemanais} onChange={(e) => atualizarAno(index, "aulasSemanais", e.target.value)} /></Field>
                            <Field label="Total de aulas anuais:"><input className="input-app" value={ano.aulasAnuais} onChange={(e) => atualizarAno(index, "aulasAnuais", e.target.value)} /></Field>
                            <Field label="Carga horária anual:"><input className="input-app" value={ano.cargaHorariaAnual} onChange={(e) => atualizarAno(index, "cargaHorariaAnual", e.target.value)} /></Field>
                        </div>
                    ) : null}
                </Card>
            ))}
            <Actions onClear={() => { setForm({ nomeAluno: "", raAluno: "", dataNascimento: "", municipioNascimento: "", ufNascimento: "", modeloHistorico: "padrao", anoAtual: "", dataSaida: "" }); setNotas({}); setAnos(Array.from({ length: 5 }, anoVazio)); }} onSubmit={gerar} loading={loading} />
        </>
    );
}
