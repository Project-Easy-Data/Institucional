const sobrepor = document.getElementById("sobrepor");

function confirmar() {
    const nome = document.getElementById("inputNome").value;
    const email = document.getElementById("inputEmail").value;
    const cargo = document.getElementById("selectCargo").value;

    let permissao = cargo;

    if (permissao === 'Gerente') {
        permissao = 3;
    } else if (permissao === 'Funcionário') {
        permissao = 1;
    } else {
        permissao = 2;
    }

    if (!nome) {
        document.getElementById("erroNome").style.display = "block";
        return;
    }

    if (!email) {
        document.getElementById("erroEmail").style.display = "block";
        return;
    }

    if (!cargo) {
        document.getElementById("erroCargo").style.display = "block";
        return;
    }

    const senhaTemporaria = gerarSenhaTemporaria(10);

    fetch("/funcionarios/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer: nome,
            emailServer: email,
            cargoServer: cargo,
            permissaoServer: permissao,
            senhaServer: senhaTemporaria
        })
    })
    .then(resposta => {
    if (resposta.ok) {
        resposta.json().then(function(dados) {
            const listaUsuarios = document.querySelector(".listaUsuarios");
            const novaLinha = document.createElement("div");
            novaLinha.classList.add("linha");
            novaLinha.innerHTML = `
                <p>${nome}</p>
                <p>${email}</p>
                <p>${cargo}</p>
                <button class="excluir" onclick="excluir(this, ${dados.id})">Excluir</button>
            `;
            listaUsuarios.appendChild(novaLinha);
            fecharModal();
        });
    } else {
        alert("Erro ao cadastrar funcionário.");
      }
    })
    .catch(erro => {
        console.error("Erro:", erro);
    });
}

function excluir(botao, id) {
    console.log("excluir chamado, id:", id);
    fetch("/deletar/" + id, {
        method: "DELETE"
    })
    .then(function(resposta) {
        if (resposta.ok) {
            botao.closest(".linha").remove();
        } else {
            alert("Erro ao excluir funcionário.");
        }
    })
    .catch(function(erro) {
        console.error("Erro:", erro);
    });
}

function addFunc() {
    sobrepor.style.display = "flex";
}

function fecharModal() {
    sobrepor.style.display = "none";
}

sobrepor.addEventListener("click", function(e) {
    if (e.target === sobrepor) fecharModal();
});

function gerarSenhaTemporaria(tamanho) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let senha = "";
    for (let i = 0; i < 10; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        senha += caracteres.charAt(indice);
    }
    return senha;
}
