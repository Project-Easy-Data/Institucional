const olhoAberto = document.querySelector("#olhoAberto");
const olhoFechado = document.querySelector("#olhoFechado");
const senha = document.querySelector("#senha");
const email = document.querySelector("#email");
const loading = document.querySelector(".loading");
const botaoTexto = document.querySelector("#botaoTexto");
const erroMsg = document.querySelector("#msgErro");

// Toggle senha
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
function entrar() {
    const emailValor = email.value.trim();
    const senhaValor = senha.value.trim();

    erroMsg.textContent = ""; // limpa antes

    if (!emailValor) {
        erroMsg.textContent = "Preencha o campo de e-mail!";
        erroMsg.style.color = "#ff4444";
        return;
    }

    if (!senhaValor) {
        erroMsg.textContent = "Preencha o campo de senha!";
        erroMsg.style.color = "#ff4444";
        return;
    }

    carregando();

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
            throw new Error("Credenciais inválidas");
        }

        if (resposta.status === 500) {
            throw new Error("Erro interno no servidor");
        }

        if (!resposta.ok) {
            throw new Error("Erro desconhecido");
        }

        return resposta.json();
    })
    .then(resultado => {
        erroMsg.textContent = "Login realizado com sucesso!";
        erroMsg.style.color = "#90EE90";

        setTimeout(() => {
            window.location = "../dashboardGerente.html";
        }, 1000);
    })
    .catch(err => {
        if (err.message === "Credenciais inválidas") {
            erroMsg.textContent = "E-mail e/ou senha inválido(s)!";
        } else if (err.message === "Erro interno no servidor") {
            erroMsg.textContent = "Erro interno no servidor. Tente novamente.";
        } else {
            erroMsg.textContent = "Não foi possível conectar ao servidor.";
        }

        erroMsg.style.color = "#ff4444";
    })
    .finally(() => {
        carregado();
    });
}

function carregando() {
    loading.style.display = "flex";
    botaoTexto.style.display = "none";
}

function carregado() {
    loading.style.display = "none";
    botaoTexto.style.display = "flex";
}