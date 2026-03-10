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

cnpj.addEventListener("input", () => {

    let numeros = "";

    for (let i = 0; i < cnpj.value.length; i++) {
        if (!isNaN(cnpj.value[i]) && cnpj.value[i] !== " ") {
            numeros += cnpj.value[i];
        }
    }

    if (numeros.length > 14) {
        numeros = numeros.substring(0, 14);
    }

    let formatado = "";

    for (let i = 0; i < numeros.length; i++) {

        formatado += numeros[i];

        if (i === 1 || i === 4) {
            formatado += ".";
        }

        if (i === 7) {
            formatado += "/";
        }

        if (i === 11) {
            formatado += "-";
        }
    }

    cnpj.value = formatado;

});

function validarCampos (input, msg, tamanho) {
    let dominios = [".com", ".br", ".net", ".org"];
    let tipoEmail = ["@gmail", "@outlook", "@hotmail", "@yahoo"];
    
    input.addEventListener('input', () => {
        
        if (input.id === "email") {
            let dominioValido = false;
            let tipoValido = false;

            for (let i = 0; i < dominios.length; i++) {
                if (email.value.includes(dominios[i])) {
                    dominioValido = true;
                }
            }

            for (let j = 0; j < tipoEmail.length; j++) {
                if (email.value.includes(tipoEmail[j])) {
                    tipoValido = true;
                }
            }

        if ((!dominioValido || !tipoValido) || input.value.includes(" ")) {
            msg.textContent = "O campo deve ser preenchido corretamente!";
            msg.style.color = "#ff4444";
            return;
        }

        msg.textContent = "Campo preenchido com sucesso!";
        msg.style.color = "#90EE90";
        }

        if (input.value.length < tamanho) {
            msg.textContent = "O campo deve ser preenchido corretamente!";
            msg.style.color = "#ff4444";
        } else {
            msg.style.color = "#90EE90";
            msg.textContent = "Campo preenchido com sucesso!";

            setTimeout(() => {
                msg.style.opacity = "0";
            }, 2500);

            setTimeout(() => {
                msg.style.opacity = "1";
                msg.textContent = "";
            }, 3000);
        }
    })
}

validarCampos(empresa, msgCorretoNome, 1);
validarCampos(email, msgCorretoEmail, 7);
validarCampos(cnpj, msgCorretoCnpj, 14);

function cadastrar() {
    sessionStorage.setItem("senha", senha.value);
    sessionStorage.setItem("email", email.value);
}



