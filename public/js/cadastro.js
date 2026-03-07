const empresa = document.querySelector("#empresa");
const senha = document.querySelector("#senha");
const cnpj = document.querySelector("#cnpj");
const email = document.querySelector("#email");

const btnCadastro = document.querySelector(".botaoCadastro");

function gerarSenha() {
    senha.value = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    msgCorretoSenha.textContent = "Senha gerada com sucesso!";
    msgCorretoSenha.style.color = "#90EE90";    
    msgCorretoSenha.style.opacity = "1";

    setTimeout(() => {
        msgCorretoSenha.style.opacity = "0";
    }, 2500);

    setTimeout(() => {
        msgCorretoSenha.style.opacity = "1";
        msgCorretoSenha.textContent = "";
    }, 3000);
}

function validarCampos (input, msg, tamanho) {
    input.addEventListener('input', () => {
        if (input.value.length < tamanho) {
            msg.textContent = "O campo deve ser preenchido corretamente!";
            msg.style.color = "#8B0000";
        } else {
            msg.style.color = "#90EE90";
            msg.textContent = "Campo preenchido com sucesso!";
        }
    })
}

validarCampos(empresa, msgCorretoNome, 1);
validarCampos(email, msgCorretoEmail, 7);
validarCampos(cnpj, msgCorretoCnpj, 14);



