const olhoAberto = document.querySelector("#olhoAberto");
const olhoFechado = document.querySelector("#olhoFechado");
const senha = document.querySelector("#senha");
const email = document.querySelector("#email");

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

function entrar() {
    const emailValor = email.value.trim();
    const senhaValor = senha.value.trim();

    if (!emailValor) {
        msgCorretoEmail.textContent = "Preencha o campo de e-mail!";
        msgCorretoEmail.style.color = "#ff4444";
        return;
    }

    if (!senhaValor) {
        msgCorretoSenha.textContent = "Preencha o campo de senha!";
        msgCorretoSenha.style.color = "#ff4444";
        return;
    }

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emailServer: emailValor,
            senhaServer: senhaValor
        })
    })
    .then(resposta => {
        if (resposta.status === 403) {
            msgCorretoEmail.textContent = "E-mail e/ou senha inválido(s)!";
            msgCorretoEmail.style.color = "#ff4444";
            msgCorretoSenha.textContent = "Verifique suas credenciais.";
            msgCorretoSenha.style.color = "#ff4444";
            return null;
        }

        if (resposta.status === 500) {
            msgCorretoEmail.textContent = "Erro interno no servidor. Tente novamente.";
            msgCorretoEmail.style.color = "#ff4444";
            return null;
        }

        if (!resposta.ok) {
            msgCorretoEmail.textContent = "Erro inesperado. Status: " + resposta.status;
            msgCorretoEmail.style.color = "#ff4444";
            return null;
        }

        return resposta.json();
    })
    .then(resultado => {
        if (!resultado) return;

        msgCorretoEmail.textContent = "Login realizado com sucesso!";
        msgCorretoEmail.style.color = "#90EE90";

        setTimeout(() => {
            window.location = "../dashboardGerente.html";
        }, 1000);
    })
    .catch(erro => {
        console.error("ERRO NO LOGIN:", erro);
        msgCorretoEmail.textContent = "Não foi possível conectar ao servidor.";
        msgCorretoEmail.style.color = "#ff4444";
    });
}