const sobrepor = document.getElementById("sobrepor");

const cargoMap = {
    'Gerente':     { cargoId: 1, permissao: 1 },
    'Funcionário': { cargoId: 2, permissao: 2 },
    'Suporte':     { cargoId: 3, permissao: 3 }
};

const cargoPorPermissao = {
    1: "Gerente",
    2: "Funcionário",
    3: "Suporte"
};

function carregarPerfil() {
    const nome = sessionStorage.getItem("nome");
    let cargo = sessionStorage.getItem("cargo");
    const permissao = sessionStorage.getItem("permissao");

    if (!cargo || cargo === "undefined" || cargo === "null") {
        cargo = cargoPorPermissao[Number(permissao)] || "Cargo";
    }

    if (document.getElementById("nomeUsuario")) {
        document.getElementById("nomeUsuario").textContent = nome || "Usuário";
    }

    if (document.getElementById("cargoUsuario")) {
        document.getElementById("cargoUsuario").textContent = cargo;
    }
}

function criarSelectCargo(cargoAtual, idFuncionario) {
    const opcoes = ['Gerente', 'Funcionário', 'Suporte'].map(c =>
        `<option value="${c}" ${c === cargoAtual ? 'selected' : ''}>${c}</option>`
    ).join('');
    return `<select class="selectCargoLinha" onchange="alterarCargo(this, ${idFuncionario})">${opcoes}</select>`;
}

function alterarCargo(select, idFuncionario) {
    const cargoSelecionado = select.value;
    const { cargoId, permissao } = cargoMap[cargoSelecionado];

    fetch(`/funcionarios/atualizarCargo/${idFuncionario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cargoId, permissao })
    })
    .then(function(res) {
        if (!res.ok) alert("Erro ao atualizar cargo.");
    })
    .catch(function(erro) {
        console.error("Erro:", erro);
    });
}

function confirmar() {
    const nome = document.getElementById("inputNome").value;
    const email = document.getElementById("inputEmail").value;
    const cargoSelect = document.getElementById("selectCargo").value;

    let permissao;
    let cargoId;

    if (cargoSelect === 'Gerente') {
        permissao = 1; cargoId = 1;
    } else if (cargoSelect === 'Funcionário') {
        permissao = 2; cargoId = 2;
    } else {
        permissao = 3; cargoId = 3;
    }

    if (!nome) 
        { document.getElementById("erroNome").style.display = "block"; return; 

        }
    if (!email) 
        { document.getElementById("erroEmail").style.display = "block"; return; 

        }
    if (!cargoSelect) 
        { document.getElementById("erroCargo").style.display = "block"; return; 
            
        }

    const senhaTemporaria = gerarSenhaTemporaria(10);
    sessionStorage.setItem('permissao', permissao);

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
    .then(resposta => {
        if (resposta.ok) {
            resposta.json().then(function(dados) {
                const listaUsuarios = document.querySelector(".listaUsuarios");
                const novaLinha = document.createElement("div");
                novaLinha.classList.add("linha");
                novaLinha.innerHTML = `
                    <p>${nome}</p>
                    <p>${email}</p>
                    ${criarSelectCargo(cargoSelect, dados.insertId)}
                    <button class="excluir" onclick="excluir(this, ${dados.insertId})">Excluir</button>
                `;
                listaUsuarios.appendChild(novaLinha);
                fecharModal();
                exibirPopupSenha(senhaTemporaria);
            });
        } else {
            alert("Erro ao cadastrar funcionário.");
        }
    })
    .catch(erro => console.error("Erro:", erro));
}

function excluir(botao, id) {
    fetch("/deletar/" + id, { method: "DELETE" })
    .then(function(resposta) {
        if (resposta.ok) {
            botao.closest(".linha").remove();
        } else {
            alert("Erro ao excluir funcionário.");
        }
    })
    .catch(function(erro) { console.error("Erro:", erro); });
}

function addFunc() { sobrepor.style.display = "flex"; }
function fecharModal() { sobrepor.style.display = "none"; }

sobrepor.addEventListener("click", function(e) {
    if (e.target === sobrepor) fecharModal();
});

function gerarSenhaTemporaria(tamanho) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let senha = "";
    for (let i = 0; i < tamanho; i++) {
        senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return senha;
}

function carregarUsuarios() {
    fetch("/funcionarios/listar")
        .then(res => res.json())
        .then(function(lista) {
            const listaUsuarios = document.querySelector(".listaUsuarios");
            lista.forEach(function(u) {
                const novaLinha = document.createElement("div");
                novaLinha.classList.add("linha");
                novaLinha.innerHTML = `
                    <p>${u.nome}</p>
                    <p>${u.email}</p>
                    ${criarSelectCargo(u.cargo, u.id_funcionario)}
                    <button class="excluir" onclick="excluir(this, ${u.id_funcionario})">Excluir</button>
                `;
                listaUsuarios.appendChild(novaLinha);
            });
        });
}

const links = document.querySelectorAll('aside .btns a');
links.forEach(link => {
    if (link.href === window.location.href) link.classList.add('ativo');
});

document.addEventListener("DOMContentLoaded", function () {
    carregarPerfil();
    carregarUsuarios();
});

function exibirPopupSenha(senha) {
    document.getElementById("exibirSenha").value = senha;
    document.getElementById("sobreporSenha").style.display = "flex";
}

function fecharSenha() {
    document.getElementById("sobreporSenha").style.display = "none";
}

function copiarSenha() {
    const input = document.getElementById("exibirSenha");
    navigator.clipboard.writeText(input.value);
}