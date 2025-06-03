function gerarDoc(){
    let tipodoc = document.getElementById("tipoDoc").value;
    let nomeAluno = document.getElementById("nomeAluno").value;
    let raAluno = document.getElementById("raAluno").value;
    let nascimento = document.getElementById("nascimento").value;
    let emissor = document.getElementById("emissor").value;
    let nascimentoFormatado = formatarDataBr(nascimento)

    const hoje = new Date()
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho","julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const data = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
    
    if (!tipodoc || !nomeAluno || !raAluno || !emissor) {
        alert("Preencha todos os campos!");
        return;
    }

    
    const emissores = {
        gabriel: {
            nome: "Gabriel Aguera Baria",
            cargo: "ESTAGIÁRIO"
        },
        julia: {
            nome: "Julia de Lima Batista",
            cargo: "ESCRITUÁRIA"
        }
    }
    let emissorInfo = emissores[emissor]

    let modelo = ""
    switch(tipodoc){
        case "declaEsc":
            modelo = "modelos/DECLARAÇÃO OFICIAL - ESCOLARIDADE.docx"
            break
        case "declaTransf":
            modelo = "modelos/DECLARAÇÃO OFICIAL - TRANSFERÊNCIA.docx"
            break
        case "#":
            alert("Selecione um tipo de documento válido!")
            break
        default:
            alert("Algo deu errado")


    }

    fetch(modelo).then(res => res.arrayBuffer()).then(content => {
        const zip = new PizZip(content);
        const doc = new window.docxtemplater().loadZip(zip);

        doc.setData({
            nome: nomeAluno,
            ra: raAluno,
            nascimento: nascimentoFormatado,
            data: data,
            emissor: emissorInfo.nome,
            cargoEmissor: emissorInfo.cargo
        })
        try {
                doc.render();
            } catch (error) {
                console.error("Erro ao renderizar o documento:", error);
                console.log("Tags do documento:", doc.getFullText());  // Exibe as tags no console
                console.log("Erros no modelo:", error.properties.errors);
                alert("Erro ao gerar o documento.");
                return;
            }
        const blob = doc.getZip().generate({ type: "blob" });
            saveAs(blob, `declaracao-${nomeAluno}.docx`);
        })
        .catch(err => {
            console.error("Erro ao carregar o modelo:", err);
            alert("Erro ao carregar o modelo.");
        });    
}

function formatarDataBr(nascimento) {
    const [ano, mes, dia] = nascimento.split('-');
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`

}