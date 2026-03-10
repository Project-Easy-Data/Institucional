const olhoAberto = document.querySelector("#olhoAberto");
const olhoFechado = document.querySelector("#olhoFechado");
const senha = document.querySelector("#senha");
const email = document.querySelector("#email");

let senhaSalva = sessionStorage.getItem("senha");

olhoAberto.addEventListener("click", () => {
    senha.type = "text";
    olhoAberto.style.display = "none";
    olhoFechado.style.display = "inline";
});

olhoFechado.addEventListener("click", () => {
    senha.type = "password";
    olhoFechado.style.display = "none";
    olhoAberto.style.display = "inline";
});

email.addEventListener("input", () => {
    if (email.value.length >= 10 && email.value.includes("@") && (email.value.includes(".com") || email.value.includes(".br") || email.value.includes(".net") || email.value.includes(".org")) ) {
        msgCorretoEmail.textContent = "Campo preenchido com sucesso!";
        msgCorretoEmail.style.color = "#90EE90";

        setTimeout(() => {
            msgCorretoEmail.style.opacity = "0";
        }, 2500);

        setTimeout(() => {
            msgCorretoEmail.style.opacity = "1";
            msgCorretoEmail.textContent = "";
        }, 3000);
    } else {
        msgCorretoEmail.textContent = "O campo deve ser preenchido corretamente!";
        msgCorretoEmail.style.color = "#ff4444";
    }
});

senha.addEventListener("input", () => {
    if (senha.value === senhaSalva) {
        msgCorretoSenha.textContent = "Campo preenchido com sucesso!";
        msgCorretoSenha.style.color = "#90EE90";

        setTimeout(() => {
            msgCorretoSenha.style.opacity = "0";
        }, 2500);

        setTimeout(() => {
            msgCorretoSenha.style.opacity = "1";
            msgCorretoSenha.textContent = "";
        }, 3000);
    } else {
        msgCorretoSenha.textContent = "O campo deve ser preenchido corretamente!";
        msgCorretoSenha.style.color = "#ff4444";
    }
});