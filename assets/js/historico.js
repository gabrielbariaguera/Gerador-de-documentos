let notas = {}
let aulas = {}
let estudos = {}

document.getElementById("btnSalvarNota").addEventListener("click", () => {
  const materia = document.getElementById("materia").value;

  notas[materia] = {
    ano1: +document.getElementById("notaAno1").value || 0,
    ano2: +document.getElementById("notaAno2").value || 0,
    ano3: +document.getElementById("notaAno3").value || 0,
    ano4: +document.getElementById("notaAno4").value || 0,
    ano5: +document.getElementById("notaAno5").value || 0,
  };
  console.log("Dados de notas salvos:", notas); 
})

document.getElementById("btnSalvarAula").addEventListener("click", () => {
  const tipoaula = document.getElementById("tipoaula").value;

  aulas[tipoaula] = {
    ano1: +document.getElementById("cargaAno1").value || 0,
    ano2: +document.getElementById("cargaAno2").value || 0,
    ano3: +document.getElementById("cargaAno3").value || 0,
    ano4: +document.getElementById("cargaAno4").value || 0,
    ano5: +document.getElementById("cargaAno5").value || 0,
  }
  console.log("Dados de aulas salvos:", aulas);
}); 

document.getElementById("btnSalvarEstudoRealizado").addEventListener("click", () => {
  const ano = document.getElementById("anoEstudoRealizado").value;
  const local = document.getElementById("localEnsino").value;
  const municipio = document.getElementById("municipioEstudoRealizado").value;
  const uf = document.getElementById("ufEstudoRealizado").value;

  estudos[ano] = {
    local,
    municipio,
    uf,
  };

  console.log("Dados de estudos salvos:", estudos);
});

// Formata data de YYYY-MM-DD para DD/MM/YYYY
function formatarDataBr(nascimento) {
    if (!nascimento) return '';
    const [ano, mes, dia] = nascimento.split('-');
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}

// Função principal para gerar documentos
function gerarHist() {
    console.log("Função gerarHist() iniciada");
    
    
    // Pega o botão e guarda o texto original
    const botao = document.getElementById('btnGerarHist');
    const textoOriginal = botao.innerHTML;
    
    try {
        // Mostra estado de loading
        botao.innerHTML = '<span class="loading-spinner"></span> Gerando...';
        botao.disabled = true;
        console.log("Botão alterado para estado de loading");
        
        // Coleta os dados do formulário
    let nomeAluno = document.getElementById("nomeAluno").value;
    let raAluno = document.getElementById("raAluno").value;
    let nascimento = document.getElementById("nascimento").value;
    let nascimentoFormatado = formatarDataBr(nascimento);
    let municipio = document.getElementById("municipio").value;
    let uf = document.getElementById("uf").value;
    let anoInicio = document.getElementById("anoInicio").value;

    const hoje = new Date();
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const data = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
    
    // Define o modelo baseado no tipo de documento
    let tipoDoc = document.getElementById("tipoDoc").value;
    let modelo = "";
    console.log("Valor de tipoDoc:", tipoDoc);
    switch(tipoDoc) {
        case "hist":
            modelo = "../../modelos/HISTORICO ESCOLAR.xlsx";
            break;
        case "histTrans":
            modelo = "../../modelos/DECLARAÇÃO OFICIAL - TRANSFERÊNCIA.docx";
            break;
        default:
            showToast("Tipo de documento inválido", "error");
            resetarBotao();
            return;
    }
    // Função para resetar o botão
    function resetarBotao() {
        console.log("Restaurando botão ao estado original");
        botao.innerHTML = textoOriginal;
        botao.disabled = false;
    }

    // Obtém o URL do servidor atual
    const serverURL = window.location.protocol + '//' + window.location.host;
    const modeloURL = `${serverURL}/${modelo}`;
    
    console.log("Carregando modelo de: ", modeloURL);
    
    // Faz o fetch do modelo
    fetch(modeloURL)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status} - ${res.statusText}`);
            }
            return res.arrayBuffer();
        })
        .then(content => {
            // Processa o documento
            const zip = new PizZip(content);
            const doc = new window.docxtemplater().loadZip(zip);

            // Define os valores a serem inseridos
            doc.setData({
                nome: nomeAluno,
                ra: raAluno,
                dataNascimento: nascimentoFormatado,
                data: data,
                municipio: municipio,
                uf: uf,
                ano1a: anoInicio,
                ano2a: anoInicio + 1,
                ano3a: anoInicio + 2,
                ano4a: anoInicio + 3,
                ano5a: anoInicio + 4,
                
            });
            
            try {
                // Realiza a substituição no documento
                doc.render();
                // Gera o blob e faz o download
                const blob = doc.getZip().generate({ type: "blob" });
                saveAs(blob, `historico-${nomeAluno}.docx`);
                showToast("Documento gerado com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao renderizar o documento:", error);
                showToast("Erro ao gerar o documento. Verifique os campos preenchidos.", "error");
            }
            
            resetarBotao();
        })
        .catch(err => {
            console.error("Erro ao carregar o modelo:", err);
            showToast(`Erro ao carregar o modelo. Certifique-se de acessar pelo servidor local (http://localhost:8000)`, "error");
            resetarBotao();
        });
    } catch (error) {
        console.error("Exceção geral:", error);
        showToast("Ocorreu um erro inesperado ao processar o documento", "error");
        
        // Garante que o botão seja restaurado mesmo em caso de erro
        try {
            botao.innerHTML = textoOriginal;
            botao.disabled = false;
        } catch (e) {
            console.error("Erro ao restaurar botão:", e);
        }
    }
}

// Inicializa os event listeners quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    const tipoDoc = document.getElementById("tipoDoc").value

    document.getElementById('btnGerarHist').addEventListener('click', () => {
        gerarHist(tipoDoc);
    });

    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value) {
                this.classList.remove('campo-erro');
            }
        });
    });
    
    // Adiciona comportamentos simples aos elementos da interface
    // Botão voltar - apenas limpa o formulário
    const btnVoltar = document.querySelector('.btn-secondary');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            // Limpa formulário silenciosamente
            document.querySelectorAll('.form-control').forEach(input => {
                input.value = input.tagName === 'SELECT' ? (input.querySelector('option').value || '') : '';
                input.classList.remove('campo-erro');
            });
            // Sem exibir mensagem toast
        });
    }
});    

function showToast(message, type = 'success') {
    // Cria o container de toasts se não existir
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Define o ícone baseado no tipo de mensagem
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'info') icon = 'fa-info-circle';
    
    // Cria o elemento toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adiciona ao container
    toastContainer.appendChild(toast);
    
    // Anima a entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}