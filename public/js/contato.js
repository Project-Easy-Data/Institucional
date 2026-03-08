const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const mensagem = document.querySelector("#mensagem");
const btnCadastro = document.querySelector("#enviar");

let dominios = [".com", ".br", ".net", ".org"];
let tipoEmail = ["@gmail", "@outlook", "@hotmail", "@yahoo"];

nome.addEventListener('input', () => {
    if (nome.value.length >= 3) {
        msgCorretoNome.textContent = "Campo preenchido com sucesso!";
        msgCorretoNome.style.color = "#90EE90";

        setTimeout(() => {
            msgCorretoNome.style.opacity = "0";
        }, 2500);

        setTimeout(() => {
            msgCorretoNome.style.opacity = "1";
            msgCorretoNome.textContent = "";
        }, 3000);
    } else {
        msgCorretoNome.textContent = "O campo deve ser preenchido corretamente!";
        msgCorretoNome.style.color = "#8B0000";
    }
});

email.addEventListener('input', () => {
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

    if ((!dominioValido || !tipoValido) || email.value.includes(" ")) {
        msgCorretoEmail.textContent = "O campo deve ser preenchido corretamente!";
        msgCorretoEmail.style.color = "#8B0000";
    } else {
        msgCorretoEmail.textContent = "Campo preenchido com sucesso!";
        msgCorretoEmail.style.color = "#90EE90";

        setTimeout(() => {
            msgCorretoEmail.style.opacity = "0";
        }, 2500);

        setTimeout(() => {
            msgCorretoEmail.style.opacity = "1";
            msgCorretoEmail.textContent = "";
        }, 3000);
    }
});

mensagem.addEventListener('input', () => {
    if (mensagem.value.length >= 20) {
        msgCorretoMensagem.textContent = "Campo preenchido com sucesso!";
        msgCorretoMensagem.style.color = "#90EE90";

        setTimeout(() => {
            msgCorretoMensagem.style.opacity = "0";
        }, 2500);

        setTimeout(() => {
            msgCorretoMensagem.style.opacity = "1";
            msgCorretoMensagem.textContent = "";
        }, 3000);
    } else {
        msgCorretoMensagem.textContent = "O campo deve ser preenchido corretamente!";
        msgCorretoMensagem.style.color = "#8B0000";
    }
});

function enviar() {
    if (
        nome.value.length >= 3 &&
        email.value.includes("@") &&
        (email.value.includes(".com") || email.value.includes(".br") || email.value.includes(".net") || email.value.includes(".org")) &&
        mensagem.value.length >= 20
    ) {
        enviadoSucesso.textContent = "Mensagem enviada com sucesso!";
        enviadoSucesso.style.color = "#90EE90";

        setTimeout(() => {
            enviadoSucesso.style.opacity = "0";
        }, 2500);

        setTimeout(() => {
            enviadoSucesso.style.opacity = "1";
            enviadoSucesso.textContent = "";
        }, 3000);
    }

    mensagem.value = "";
    email.value = "";
    nome.value = "";
}


