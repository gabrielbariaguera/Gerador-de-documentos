import { useEffect, useState } from "react";
import { File, FileSpreadsheet, FileText, FolderOpen } from "lucide-react";
import { PageHeader } from "../components/Ui.jsx";
import { useToast } from "../components/Toast.jsx";

function icone(arquivo) {
    const ext = arquivo.split(".").pop()?.toLowerCase();
    if (["xlsx", "xls"].includes(ext)) return FileSpreadsheet;
    if (["pdf"].includes(ext)) return FileText;
    if (["docx", "doc"].includes(ext)) return FileText;
    return File;
}

export default function Extras() {
    const { toast } = useToast();
    const [documentos, setDocumentos] = useState([]);

    useEffect(() => {
        fetch("/extras/documentos.json")
            .then((res) => {
                if (!res.ok) throw new Error("lista indisponível");
                return res.json();
            })
            .then((lista) => setDocumentos(Array.isArray(lista) ? lista : []))
            .catch(() => toast("Erro ao carregar a lista de documentos extras.", "error"));
    }, [toast]);

    return (
        <>
            <PageHeader title="Documentos Extras" description="Baixe documentos auxiliares disponíveis para download" />
            <div className="flex flex-col gap-3">
                {documentos.length === 0 ? (
                    <div className="card-app p-10 text-center" style={{ color: "var(--app-muted)" }}>
                        <FolderOpen className="mx-auto mb-3" />
                        Nenhum documento extra disponível no momento.
                    </div>
                ) : documentos.map((documento) => {
                    const Icon = icone(documento.arquivo);
                    return (
                        <div key={documento.arquivo} className="card-app flex items-center justify-between gap-4 p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <Icon style={{ color: "var(--app-primary)" }} />
                                <div>
                                    <strong className="block">{documento.nome}</strong>
                                    <span className="text-sm" style={{ color: "var(--app-muted)" }}>{documento.arquivo}</span>
                                </div>
                            </div>
                            <a className="btn-primary" href={`/extras/${encodeURIComponent(documento.arquivo)}`} download>
                                Download
                            </a>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
