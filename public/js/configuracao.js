document.addEventListener("DOMContentLoaded", function() {
    var id = sessionStorage.getItem("ID_USUARIO");
    var nome = sessionStorage.getItem("nome");
    var email = sessionStorage.getItem("email");
    var cargo = sessionStorage.getItem("cargo");

    if (!id) {
        window.location = "login.html";
        return;
    }

    if (document.getElementById("nomeUsuario")) {
        document.getElementById("nomeUsuario").textContent = nome || "";
    }
    if (document.getElementById("cargoUsuario")) {
        document.getElementById("cargoUsuario").textContent = cargo || "";
    }

    document.getElementById("inputNome").value = nome || "";
    document.getElementById("inputEmail").value = email || "";
});

document.querySelector(".botaoSalvar").addEventListener("click", function() {
    var id = sessionStorage.getItem("ID_USUARIO");
    var nome = document.getElementById("inputNome").value;
    var email = document.getElementById("inputEmail").value;
    var senha = document.getElementById("senha").value;
    var confirmar = document.getElementById("confirmarSenha").value;

    if (!nome) { alert("Informe o nome."); return; }
    if (!email) { alert("Informe o email."); return; }
    if (senha && senha !== confirmar) { alert("As senhas não coincidem."); return; }

    fetch("/usuarios/atualizar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idServer: id,
            nomeServer: nome,
            emailServer: email,
            senhaServer: senha || null
        })
    })
    .then(function(resposta) {
        if (resposta.ok) {
            sessionStorage.setItem("nome", nome);
            sessionStorage.setItem("email", email);
            alert("Alterações salvas com sucesso!");
        } else {
            alert("Erro ao salvar alterações.");
        }
    })
    .catch(function(erro) { console.error("Erro:", erro); });
});

const links = document.querySelectorAll("aside .btns a");

links.forEach(function (link) {
    if (link.href === window.location.href) {
        link.classList.add("ativo");
    }
});