const olhoAberto = document.querySelector("#olhoAberto");
const olhoFechado = document.querySelector("#olhoFechado");
const senha = document.querySelector("#senha");
const email = document.querySelector("#email");

let senhaSalva = sessionStorage.getItem("senha");
let emailSalvo = sessionStorage.getItem("email");

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
    }
});

function entrar() {
    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emailServer: email.value,
            senhaServer: senha.value
        })
    })
    .then(resposta => {
        if (!resposta.ok) {
            console.log("Erro no login! Status: " + resposta.status);
            return;
        }
        return resposta.json();
    })
    .then(resultado => {
        console.log("Resultado: ", resultado);
        alert("Login realizado com sucesso!");
        window.location.href = "dashboardV2.html"
    })
    .catch(erro => {
        console.error("ERRO NO LOGIN:", erro);
    });
}