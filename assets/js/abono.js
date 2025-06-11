import { formatarDataBr } from "./utils.js";

// Função para exibir mensagens de notificação
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

// Função para validar formulário
function validarCampos() {
    console.log("Validando campos do formulário");
    
    const campos = {
        
    };
    
    const camposVazios = [];
    
    for (const [id, nome] of Object.entries(campos)) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Elemento com ID '${id}' não encontrado no formulário`);
            continue;
        }
        
        if (!element.value || element.value === "#" || element.value === "Selecione uma das opções") {
            element.classList.add('campo-erro');
            camposVazios.push(nome);
            console.log(`Campo '${nome}' não preenchido`);
        } else {
            element.classList.remove('campo-erro');
        }
    }
    
    if (camposVazios.length > 0) {
        const mensagem = `Por favor, preencha os seguintes campos: ${camposVazios.join(", ")}.`;
        showToast(mensagem, 'error');
        console.log("Validação falhou:", mensagem);
        return false;
    }
    
    console.log("Todos os campos validados com sucesso");
    return true;
}

function gerarAbono() {
    console.log("Função gerarAbono() iniciada");
    
    if (!validarCampos()) {
        console.log("Validação de campos falhou");
        return;
    }
    
    // Pega o botão e guarda o texto original
    const botao = document.getElementById('btnGerarAbono');
    const textoOriginal = botao.innerHTML;
    
    try {
        // Mostra estado de loading
        botao.innerHTML = '<span class="loading-spinner"></span> Gerando...';
        botao.disabled = true;
        console.log("Botão alterado para estado de loading");
        
        // Coleta os dados do formulário
    let nomeFunc = document.getElementById("nomeFuncionario").value
    let dataAbono = document.getElementById("dataAbono").value
    let novaDataAbono = new Date(dataAbono + 'T00:00')

    const hoje = new Date();
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const data = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
    const dataAbonoFormatada = `${novaDataAbono.getDate()} de ${meses[novaDataAbono.getMonth()]} de ${novaDataAbono.getFullYear()}`;    
    
    const funcionarios = {
        agnaldo: { nomeCompleto: "AGNALDO MAURICIO DA SILVA", cod: "633", cargo: "SERVIÇOS GERAIS" },
        aline: { nomeCompleto: "ALINE ROSSI ROMERO", cod: "377", cargo: "ASSISTENTE SOCIAL" },
        cacilda: { nomeCompleto: "CACILDA RIBEIRO LEAL DE MORAIS", cod: "376", cargo: "SERVIÇOS GERAIS" },
        carolina: { nomeCompleto: "CAROLINA CONSTANTINO BUENO", cod: "296", cargo: "PEB" },
        celia: { nomeCompleto: "CÉLIA DO CARMO TOSTA", cod: "231", cargo: "INSPETOR DE ALUNO" },
        claudiana: { nomeCompleto: "CLAUDIANA DE JESUS MORAIS", cod: "626", cargo: "SERVIÇOS GERAIS" },
        danieli: { nomeCompleto: "DANIELI RINARDI DA SILVEIRA", cod: "594", cargo: "PEB" },
        eliad: { nomeCompleto: "ELIAD GARCIA RAMOS PRADO", cod: "298", cargo: "PEB" },
        eliane: { nomeCompleto: "ELIANE CRISTINA DA COSTA", cod: "305", cargo: "PEB" },
        elinety: { nomeCompleto: "ELINETY LOURENÇO DE SOUZA SANTOS", cod: "395", cargo: "SERVIÇOS GERAIS" },
        endagabi: { nomeCompleto: "ENDAGABI MUNIQUI DE OLIVEIRA FERNANDES", cod: "", cargo: "" },
        gabriel: { nomeCompleto: "GABRIEL AGUERA BARIA", cod: "", cargo: "ESTAGIÁRIO" },
        izabel: { nomeCompleto: "IZABEL CRISTINA DE PAULA MARANGONI", cod: "620", cargo: "PEB" },
        julia: { nomeCompleto: "JÚLIA DE LIMA BATISTA", cod: "654", cargo: "ESCRITURÁRIO I" },
        marcia: { nomeCompleto: "MARCIA CELESTINA RAMOS", cod: "", cargo: "" },
        mariana: { nomeCompleto: "MARIANA FANTINI RIBEIRO", cod: "571", cargo: "PEB" },
        marinei: { nomeCompleto: "MARINEI DE FÁTIMA ELOI FRANÇA", cod: "309", cargo: "PEB" },
        marisa: { nomeCompleto: "MARISA FERNANDES", cod: "294", cargo: "MERENDEIRA" },
        marlei: { nomeCompleto: "MARLEI DE LIMA NANYA FELIPE", cod: "602", cargo: "PEB" },
        mathias: { nomeCompleto: "MATHIAS ROBERTO BATISTA", cod: "299", cargo: "PEB" },
        neuci: { nomeCompleto: "NEUCI DIAS RODRIGUES", cod: "301", cargo: "PEB" },
        nisleia: { nomeCompleto: "NISLÉIA FERNANDA DE SOUZA SANTOS", cod: "643", cargo: "PEB" },
        rosana: { nomeCompleto: "ROSANA APARECIDA DOS SANTOS", cod: "341", cargo: "INSPETOR DE ALUNO" },
        rosimar: { nomeCompleto: "ROSIMAR ANTÔNIA POSSEBON", cod: "338", cargo: "MERENDEIRA" },
        rosineia: { nomeCompleto: "ROSINEIA FERREIRA LIMA", cod: "387", cargo: "MERENDEIRA" },
        sebastiao: { nomeCompleto: "SEBASTIÃO RAMALHO FILHO", cod: "", cargo: "" },
        suzimara: { nomeCompleto: "SUZIMARA DA SILVA", cod: "641", cargo: "SERVIÇOS GERAIS" }
        
    };
    
    let funcionarioInfo = funcionarios[nomeFunc];


    // Define o modelo baseado no tipo de documento
    let tipoAbono = document.getElementById("tipoAbono").value;
    let modelo = "";
    switch(tipoAbono) {
        case "abono":
            modelo = "../../modelos/MODELO - PEDIDO DE ABONO.docx";
            break;
        case "maes":
            modelo = "../../modelos/dia maes.docx";
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
                nome: funcionarioInfo.nomeCompleto,
                cod: funcionarioInfo.cod,
                cargo: funcionarioInfo.cargo,
                dataAbono: dataAbonoFormatada,
                data: data,
            });
            
            try {
                // Realiza a substituição no documento
                doc.render();
                // Gera o blob e faz o download
                const blob = doc.getZip().generate({ type: "blob" });
                saveAs(blob, `Abono-${nomeFunc}.docx`);
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
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o evento click ao botão de gerar documento
    document.getElementById('btnGerarAbono').addEventListener('click', gerarAbono);
    
    // Adiciona evento para remover erro ao modificar campos
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
    
    // Os botões da barra de ferramentas não têm funcionalidade atribuída
    // Isso mantém a UI limpa sem mensagens de recursos indisponíveis
});
