const empresa = document.querySelector("#empresa");
const cnpj = document.querySelector("#cnpj");
const email = document.querySelector("#email");

const btnCadastro = document.querySelector(".botaoCadastro");

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Gera uma senha aleatória com 30 caracteres (15 caracteres de cada parte separados por um hífen).
 * Mostra a mensagem de "Senha gerada com sucesso!" por 2.5 segundos com cor #90EE90.
 * Após 2.5 segundos, oculta a mensagem.
 * Após 3 segundos, volta a mostrar a mensagem com a cor original.
 * @returns {void}
/*******  a654ef0c-b10d-4c92-8373-4abf3bf8a754  *******/
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
                if (input.value.includes(dominios[i])) {
                    dominioValido = true;
                }
            }

            for (let j = 0; j < tipoEmail.length; j++) {
                if (input.value.includes(tipoEmail[j])) {
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
    });
}

btnCadastro.addEventListener("click", () => {

    let cnpjLimpo = cnpj.value.replace(/\D/g, "");

    if (
        empresa.value.length >= 1 &&
        email.value.length >= 7 &&
        cnpjLimpo.length === 14
    ) {
        fetch("/usuarios/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                empresaServer: empresa.value,
                emailServer: email.value,
                cnpjServer: cnpjLimpo
            })
        })
        .then(resposta => {
            if (resposta.ok) {
                alert("Cadastro realizado com sucesso!")
                sessionStorage.setItem("email", email.value);
            } else {
                alert("Erro ao realizar o cadastro.");
            }
        })
        .catch(erro => {
            console.error("Erro:", erro);
        });

    } else {
        alert("Preencha todos os campos corretamente!");
    }
});



validarCampos(empresa, msgCorretoNome, 1);
validarCampos(email, msgCorretoEmail, 7);
validarCampos(cnpj, msgCorretoCnpj, 14);



