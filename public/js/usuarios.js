const sobrepor = document.getElementById("sobrepor");

const cargoMap = {
    "Gerente": { cargoId: 1, permissao: 1 },
    "Funcionário": { cargoId: 2, permissao: 2 },
    "Suporte": { cargoId: 3, permissao: 3 }
};

const cargoPorId = {
    1: "Gerente",
    2: "Funcionário",
    3: "Suporte"
};

function normalizarCargo(usuario) {
    if (usuario.cargo === "Gerente" || usuario.cargo === "Funcionário" || usuario.cargo === "Suporte") {
        return usuario.cargo;
    }

    if (usuario.fk_Cargo) {
        return cargoPorId[Number(usuario.fk_Cargo)];
    }

    if (usuario.idCargo) {
        return cargoPorId[Number(usuario.idCargo)];
    }

    if (usuario.permissao) {
        return cargoPorId[Number(usuario.permissao)];
    }

    return "Funcionário";
}

function criarSelectCargo(cargoAtual, idFuncionario) {
    const cargoTratado = cargoAtual || "Funcionário";

    const opcoes = ["Gerente", "Funcionário", "Suporte"].map(function (cargo) {
        const selecionado = cargo === cargoTratado ? "selected" : "";
        return `<option value="${cargo}" ${selecionado}>${cargo}</option>`;
    }).join("");

    return `
        <select class="selectCargoLinha" onchange="alterarCargo(this, ${idFuncionario})">
            ${opcoes}
        </select>
    `;
}

function alterarCargo(select, idFuncionario) {
    const cargoSelecionado = select.value;
    const { cargoId, permissao } = cargoMap[cargoSelecionado];

    fetch(`/funcionarios/atualizarCargo/${idFuncionario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cargoId, permissao })
    })
        .then(function (res) {
            if (!res.ok) {
                alert("Erro ao atualizar cargo.");
            }
        })
        .catch(function (erro) {
            console.error("Erro:", erro);
        });
}

function confirmar() {
    const nome = document.getElementById("inputNome").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const cargoSelect = document.getElementById("selectCargo").value;

    limparErros();

    if (!nome) {
        document.getElementById("erroNome").style.display = "block";
        return;
    }

    if (!email) {
        document.getElementById("erroEmail").style.display = "block";
        return;
    }

    if (!cargoSelect) {
        document.getElementById("erroCargo").style.display = "block";
        return;
    }

    const { cargoId, permissao } = cargoMap[cargoSelect];
    const senhaTemporaria = gerarSenhaTemporaria(10);

    fetch("/funcionarios/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer: nome,
            emailServer: email,
            cargoServer: cargoId,
            permissaoServer: permissao,
            senhaServer: senhaTemporaria
        })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }

            throw new Error("Erro ao cadastrar funcionário.");
        })
        .then(function () {
            fecharModal();
            exibirPopupSenha(senhaTemporaria);
            carregarUsuarios();
        })
        .catch(function (erro) {
            console.error("Erro:", erro);
            alert("Erro ao cadastrar funcionário.");
        });
}

function excluir(botao, id) {
    fetch("/deletar/" + id, { method: "DELETE" })
        .then(function (resposta) {
            if (resposta.ok) {
                botao.closest(".linha").remove();
            } else {
                alert("Erro ao excluir funcionário.");
            }
        })
        .catch(function (erro) {
            console.error("Erro:", erro);
        });
}

function addFunc() {
    limparErros();
    sobrepor.style.display = "flex";
}

function fecharModal() {
    sobrepor.style.display = "none";
    limparCampos();
    limparErros();
}

function limparCampos() {
    document.getElementById("inputNome").value = "";
    document.getElementById("inputEmail").value = "";
    document.getElementById("selectCargo").value = "";
}

function limparErros() {
    document.getElementById("erroNome").style.display = "none";
    document.getElementById("erroEmail").style.display = "none";
    document.getElementById("erroCargo").style.display = "none";
}

sobrepor.addEventListener("click", function (e) {
    if (e.target === sobrepor) {
        fecharModal();
    }
});

function gerarSenhaTemporaria(tamanho) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let senha = "";

    for (let 