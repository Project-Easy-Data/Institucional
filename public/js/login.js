const olhoAberto = document.querySelector("#olhoAberto");
const olhoFechado = document.querySelector("#olhoFechado");
const senha = document.querySelector("#senha");
const email = document.querySelector("#email");
const loading = document.querySelector(".loading");
const botaoTexto = document.querySelector("#botaoTexto");
const erroMsg = document.querySelector("#msgErro");

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

    erroMsg.textContent = "";

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

            const cargoMap = {
                1: "Gerente",
                2: "Funcionário",
                3: "Suporte"
            };

            const permissaoUsuario = Number(resultado.permissao);
            const cargoUsuario = resultado.cargo || cargoMap[permissaoUsuario] || "Cargo";

            sessionStorage.setItem("nome", resultado.nome || "Usuário");
            sessionStorage.setItem("cargo", cargoUsuario);
            sessionStorage.setItem("ID_USUARIO", resultado.id_funcionario);
            sessionStorage.setItem("permissao", permissaoUsuario);
            sessionStorage.setItem("email", emailValor);

            if (emailValor.toLowerCase().endsWith("@easydata.com")) {
                sessionStorage.setItem("ADMIN_EASYDATA", "true");

                setTimeout(() => {
                    window.location = "../empresaConfig.html";
                }, 1000);

                return;
            }

            if (permissaoUsuario === 2) {
                setTimeout(() => {
                    window.location = "../dashboardFunc.html";
                }, 1000);
            }

            if (permissaoUsuario === 1 || permissaoUsuario === 3) {
                setTimeout(() => {
                    window.location = "../dashboardGerente.html";
                }, 1000);
            }
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