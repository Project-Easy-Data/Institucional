const sobrepor = document.getElementById("sobrepor");

const cargoMap = {
    "Gerente": { cargoId: 1, permissao: 1 },
    "Funcionário": { cargoId: 2, permissao: 2 },
    "Suporte": { cargoId: 3, permissao: 3 }
};

const cargoPorPermissao = {
    1: "Gerente",
    2: "Funcionário",
    3: "Suporte"
};

function obterEmpresaId() {
    return sessionStorage.getItem("EMPRESA_ID_SELECIONADA") || sessionStorage.getItem("EMPRESA_ID") || 1;
}

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

function normalizarCargo(usuario) {
    if (usuario.cargo) {
        return usuario.cargo;
    }

    if (usuario.fk_Cargo) {
        return cargoPorPermissao[Number(usuario.fk_Cargo)] || "Funcionário";
    }

    if (usuario.permissao) {
        return cargoPorPermissao[Number(usuario.permissao)] || "Funcionário";
    }

    return "Funcionário";
}

function criarSelectCargo(cargoAtual, idFuncionario) {
    const cargoTexto = {
        1: "Gerente",
        2: "Funcionário",
        3: "Suporte"
    };

    const cargoIdAtual = Number(cargoAtual);

    const opcoes = [1, 2, 3].map(id => {
        return `<option value="${id}" ${id === cargoIdAtual ? "selected" : ""}>${cargoTexto[id]}</option>`;
    }).join("");

    return `<select class="selectCargoLinha" onchange="alterarCargo(this, ${idFuncionario})">${opcoes}</select>`;
}

function alterarCargo(select, idFuncionario) {
    const cargoId = Number(select.value);
    const permissao = cargoId;

    fetch(`/funcionarios/atualizarCargo/${idFuncionario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
    const nome = document.getElementById("inputNome").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const cargoId = Number(document.getElementById("selectCargo").value);
    const empresaId = obterEmpresaId();

    if (!nome) {
        document.getElementById("erroNome").style.display = "block";
        return;
    }

    if (!email) {
        document.getElementById("erroEmail").style.display = "block";
        return;
    }

    if (!cargoId) {
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
            cargoServer: cargoId,
            permissaoServer: cargoId,
            senhaServer: senhaTemporaria,
            empresaIdServer: empresaId
        })
    })
        .then(function(resposta) {
            if (!resposta.ok) {
                return resposta.text().then(function(textoErro) {
                    throw new Error(textoErro || "Erro ao cadastrar funcionário.");
                });
            }

            return resposta.json();
        })
        .then(function() {
            fecharModal();
            exibirPopupSenha(senhaTemporaria);
            carregarUsuarios();
        })
        .catch(function(erro) {
            console.error("Erro:", erro);
            alert("Erro ao cadastrar funcionário: " + erro.message);
        });
}

function excluir(botao, id) {
    fetch("/funcionarios/excluir/" + id, {
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

    document.getElementById("inputNome").value = "";
    document.getElementById("inputEmail").value = "";
    document.getElementById("selectCargo").value = "";

    document.getElementById("erroNome").style.display = "none";
    document.getElementById("erroEmail").style.display = "none";
    document.getElementById("erroCargo").style.display = "none";
}

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

function limparListaUsuarios() {
    document.querySelectorAll(".listaUsuarios .linha").forEach(function(linha) {
        linha.remove();
    });
}

function carregarUsuarios() {
    const empresaId = obterEmpresaId();

    fetch(`/funcionarios/listar/${empresaId}`)
        .then(res => res.json())
        .then(function(lista) {
            const listaUsuarios = document.querySelector(".listaUsuarios");

            limparListaUsuarios();

            lista.forEach(function(u) {
                const cargoUsuario = normalizarCargo(u);

                const novaLinha = document.createElement("div");
                novaLinha.classList.add("linha");

                novaLinha.innerHTML = `
                    <p>${u.nome}</p>
                    <p>${u.email}</p>
                    ${criarSelectCargo(cargoUsuario, u.id_funcionario)}
                    <button class="excluir" onclick="excluir(this, ${u.id_funcionario})">Excluir</button>
                `;

                listaUsuarios.appendChild(novaLinha);
            });
        })
        .catch(function(erro) {
            console.error("Erro ao carregar usuários:", erro);
        });
}

const links = document.querySelectorAll("aside .btns a");

links.forEach(link => {
    if (link.href === window.location.href) link.classList.add("ativo");
});

document.addEventListener("DOMContentLoaded", function() {
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