import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { criarDocumento, mensagemErroApi } from "./api.js";

const MESES = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

export function formatarDataBr(data) {
    if (!data) return "";
    const [ano, mes, dia] = String(data).split("-");
    return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${ano}`;
}

export function formatarDataPorExtenso(data = new Date()) {
    const dataObj = data instanceof Date ? data : new Date(`${data}T00:00`);
    if (Number.isNaN(dataObj.getTime())) return "";
    return `${dataObj.getDate()} de ${MESES[dataObj.getMonth()]} de ${dataObj.getFullYear()}`;
}

export function camposVazios(valores, rotulos) {
    return Object.entries(rotulos)
        .filter(([chave]) => {
            const valor = String(valores[chave] ?? "").trim();
            return !valor || valor === "#";
        })
        .map(([, nome]) => nome);
}

export function caminhoModelo(arquivo) {
    return `/modelos/${arquivo}`;
}

export async function gerarDocumentoDocx({ modeloRelativo, dados, outputName, successMessage = "Documento gerado com sucesso!", registro, toast } = {}) {
    const resposta = await fetch(modeloRelativo.startsWith("/") ? modeloRelativo : `/${modeloRelativo}`);
    if (!resposta.ok) {
        throw new Error("Não foi possível carregar o modelo Word.");
    }

    const content = await resposta.arrayBuffer();
    const zip = new PizZip(content);
    const doc = new Docxtemplater().loadZip(zip);
    doc.setData(dados);
    doc.render();
    const blob = doc.getZip().generate({ type: "blob" });
    saveAs(blob, outputName);

    if (registro?.type) {
        const dataHoje = new Date().toISOString().slice(0, 10);
        try {
            await criarDocumento({
                file: blob,
                fileName: outputName,
                name: `${registro.name || outputName} | ${dataHoje}`,
                type: registro.type,
                employeeId: registro.employeeId
            });
        } catch (error) {
            toast?.(`Documento gerado, mas não foi salvo no histórico: ${mensagemErroApi(error)}`, "warning");
            return;
        }
    }

    toast?.(successMessage, "success");
}
