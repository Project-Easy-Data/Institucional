const sobrepor = document.getElementById("sobrepor");

const empresaId = sessionStorage.getItem("EMPRESA_ID_SELECIONADA");
const empresaNome = sessionStorage.getItem("EMPRESA_NOME_SELECIONADA");

const cargoMap = {
    "Gerente": { cargoId: 1, permissao: 1 },
    "Funcionário": { cargoId: 2, permissao: 2 },
    "Suporte": { cargoId: 3, permissao: 3 }
};

if (!empresaId) {
    alert("Nenhuma empresa selecionada.");
    window.location = "empresaConfig.html";
}

document.getElementById("tituloEmpresa").textContent = `Usuários - ${empresaNome || "Empresa"}`;

function criarSelectCargo(cargoAtual, idFuncionario) {
    const opcoes = ["Gerente", "Funcionário", "Suporte"].map(c =>
        `<option value="${c}" ${c === cargoAtual ? "selected" : ""}>${c}</option>`
    ).join("");

    return `<select class="selectCargoLinha" onchange="alterarCargo(this, ${idFuncionario})">${opcoes}</select>`;
}

function alterarCargo(select, idFuncionario) {
    const cargoSelecionado = select.value;
    const { cargoId, permissao } = cargoMap[cargoSelecionado];

    fetch(`/funcionarios/atualizarCargo/${idFuncionario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cargoId, permissao })
    });
}

function confirmar() {
    const nome = document.getElementById("inputNome").value;
    const email = document.getElementById("inputEmail").value;
    const cargoSelect = document.getElementById("selectCargo").value;

    if (!nome) { document.getElementById("erroNome").style.display = "block"; return; }
    if (!email) { document.getElementById("erroEmail").style.display = "block"; return; }
    if (!cargoSelect) { document.getElementById("erroCargo").style.display = "block"; return; }

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
            senhaServer: senhaTemporaria,
            empresaIdServer: empresaId
        })
    })
    .then(resposta => {
        if (resposta.ok) {
            resposta.json().then(function(dados) {
                adicionarLinha(dados.insertId, nome, email, cargoSelect);
                fecharModal();
            });
        } else {
            alert("Erro ao cadastrar usuário.");
        }
    });
}

function adicionarLinha(id, nome, email, cargo) {
    const listaUsuarios = document.querySelector(".listaUsuarios");
    const novaLinha = document.createElement("div");

    novaLinha.classList.add("linha");
    novaLinha.innerHTML = `
        <p>${nome}</p>
        <p>${email}</p>
        ${criarSelectCargo(cargo, id)}
        <button class="excluir" onclick="excluir(this, ${id})">Excluir</button>
    `;

    listaUsuarios.appendChild(novaLinha);
}

function excluir(botao, id) {
    fetch("/deletar/" + id, { method: "DELETE" })
        .then(function(resposta) {
            if (resposta.ok) {
                botao.closest(".linha").remove();
            } else {
                alert("Erro ao excluir usuário.");
            }
        });
}

function carregarUsuarios() {
    fetch(`/funcionarios/listar/${empresaId}`)
        .then(res => res.json())
        .then(function(lista) {
            lista.forEach(function(u) {
                adicionarLinha(u.id_funcionario, u.nome, u.email, u.cargo);
            });
        });
}

function gerarSenhaTemporaria(tamanho) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let senha = "";

    for (let i = 0; i < tamanho; i++) {
        senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return senha;
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

document.addEventListener("DOMContentLoaded", carregarUsuarios);