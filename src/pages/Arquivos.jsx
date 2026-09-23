import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { Archive } from "lucide-react";
import { Card, Field, PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { baixarDocumentoArquivo, excluirDocumento, listarDocumentos, mensagemErroApi } from "../lib/api.js";

const TIPOS = {
    allowance: "Abono",
    exemption: "Dispensa",
    transfer: "Transferência",
    schooling: "Histórico escolar",
    enrollment: "Matrícula",
    event: "Evento"
};

function dataDoDocumento(documento) {
    const created = documento.createdAt || documento.created_at || documento.updatedAt;
    if (created) return String(created).slice(0, 10);
    const match = String(documento.name || "").match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : "";
}

function formatarDataExibicao(iso) {
    if (!iso) return "-";
    const [ano, mes, dia] = String(iso).split("-");
    if (!dia || !mes || !ano) return iso;
    return `${dia.padStart(2, "0")}-${mes.padStart(2, "0")}-${ano}`;
}

export default function Arquivos() {
    const { toast } = useToast();
    const [documentos, setDocumentos] = useState([]);
    const [tipo, setTipo] = useState("");
    const [data, setData] = useState("");

    async function carregar() {
        try {
            const lista = await listarDocumentos();
            setDocumentos(lista);
        } catch (error) {
            toast(mensagemErroApi(error), "error");
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const filtrados = documentos
        .filter((item) => !tipo || item.type === tipo)
        .filter((item) => !data || dataDoDocumento(item) === data)
        .sort((a, b) => (b.id || 0) - (a.id || 0));

    return (
        <>
            <PageHeader title="Histórico de documentos" description="Consulte, filtre por data e baixe os documentos gerados" />
            <Card icon={Archive} title="Filtros">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Tipo">
                        <select className="input-app" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value="">Todos</option>
                            {Object.entries(TIPOS).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
                        </select>
                    </Field>
                    <Field label="Data">
                        <input type="date" className="input-app" value={data} onChange={(e) => setData(e.target.value)} />
                    </Field>
                </div>
                <button type="button" className="btn-secondary" onClick={() => { setTipo(""); setData(""); }}>Limpar filtros</button>
            </Card>
            <Card title="Documentos gerados">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr style={{ color: "var(--app-primary)" }}>
                                <th className="p-2">Data</th>
                                <th className="p-2">Nome</th>
                                <th className="p-2">Tipo</th>
                                <th className="p-2">Arquivo</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.length === 0 ? (
                                <tr><td className="p-2" colSpan={5}>Nenhum documento encontrado.</td></tr>
                            ) : filtrados.map((documento) => (
                                <tr key={documento.id} className="border-t" style={{ borderColor: "var(--app-border)" }}>
                                    <td className="p-2">{formatarDataExibicao(dataDoDocumento(documento))}</td>
                                    <td className="p-2">{documento.name || "-"}</td>
                                    <td className="p-2">{TIPOS[documento.type] || documento.type}</td>
                                    <td className="p-2">{documento.fileName || "-"}</td>
                                    <td className="flex gap-2 p-2">
                                        <button type="button" className="btn-primary" onClick={async () => {
                                            try {
                                                const resposta = await baixarDocumentoArquivo(documento.id);
                                                saveAs(resposta.data, documento.fileName || "documento.docx");
                                            } catch (error) {
                                                toast(mensagemErroApi(error), "error");
                                            }
                                        }}>Baixar</button>
                                        <button type="button" className="btn-secondary" onClick={async () => {
                                            try {
                                                await excluirDocumento(documento.id);
                                                toast("Documento removido do histórico.");
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
        </>
    );
}
