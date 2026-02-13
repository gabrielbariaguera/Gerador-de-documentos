import { formatarDataBr, funcionarios } from "./utils.js";

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
    let dataAbono = document.getElementById("dataDisp").value
    let novaDataAbono = new Date(dataAbono + 'T00:00')

    const hoje = new Date();
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const data = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
    const dataAbonoFormatada = `${novaDataAbono.getDate()} de ${meses[novaDataAbono.getMonth()]} de ${novaDataAbono.getFullYear()}`;    
    
    
    let funcionarioInfo = funcionarios[nomeFunc];
    let dias = document.getElementById("diasDisp").value
    let diasExtenso
    switch(dias){
        case "1":
            diasExtenso = "um";
            break;
        case "2":  
            diasExtenso = "dois";
            break;  
        case "3":   
            diasExtenso = "três";
            break; 
        case "4":   
            diasExtenso = "quatro";
            break; 
        case "5":   
            diasExtenso= "cinco";
            break; 
    }

    // Define o modelo baseado no tipo de documento
    let modelo = "../modelos/MODELO - PEDIDO DISPENSA.docx"


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
                dataDispensa: dataAbonoFormatada,
                dia: dias,
                diaExtenso: diasExtenso,
                data: data,
            });
            
            try {
                // Realiza a substituição no documento
                doc.render();
                // Gera o blob e faz o download
                const blob = doc.getZip().generate({ type: "blob" });
                saveAs(blob, `Dispensa-${nomeFunc}.docx`);
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
