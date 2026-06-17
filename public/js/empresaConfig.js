const sobrepor = document.getElementById("sobrepor");

function carregarPerfilEmpresaAdmin() {
    const nome = sessionStorage.getItem("nome");
    const cargo = sessionStorage.getItem("cargo");

    document.getElementById("nomeUsuario").textContent = nome || "Usuário";
    document.getElementById("cargoUsuario").textContent = cargo || "Administrador";
}

function limparErros() {
    document.getElementById("erroRazao").style.display = "none";
    document.getElementById("erroEmail").style.display = "none";
    document.getElementById("erroCnpj").style.display = "none";
    document.getElementById("erroStatus").style.display = "none";
}

function limparCampos() {
    document.getElementById("inputRazao").value = "";
    document.getElementById("inputEmail").value = "";
    document.getElementById("inputCnpj").value = "";
    document.getElementById("selectStatus").value = "";
}

function confirmar() {
    const razao = document.getElementById("inputRazao").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const cnpj = document.getElementById("inputCnpj").value.trim();
    const status = document.getElementById("selectStatus").value;

    limparErros();

    if (!razao) {
        document.getElementById("erroRazao").style.display = "block";
        return;
    }

    if (!email) {
        document.getElementById("erroEmail").style.display = "block";
        return;
    }

    if (!cnpj) {
        document.getElementById("erroCnpj").style.display = "block";
        return;
    }

    if (!status) {
        document.getElementById("erroStatus").style.display = "block";
        return;
    }

    fetch("/empresas/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            razaoServer: razao,
            emailServer: email,
            cnpjServer: cnpj,
            statusServer: status
        })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }

            throw new Error("Erro ao cadastrar empresa.");
        })
        .then(function (dados) {
            adicionarLinha(dados.insertId, razao, email, cnpj, status);
            fecharModal();
        })
        .catch(function (erro) {
            console.error("Erro:", erro);
            alert("Erro ao cadastrar empresa.");
        });
}

function adicionarLinha(id, razao, email, cnpj, status) {
    const lista = document.querySelector(".listaUsuarios");
    const linha = document.createElement("div");

    linha.classList.add("linha");

    linha.innerHTML = `
        <p>${razao}</p>
        <p>${email}</p>
        <p>${cnpj}</p>
        <p>${status}</p>

        <div class="acoesLinha">
            <button class="usuarios" onclick="abrirUsuariosEmpresa(${id}, '${razao}')">Usuários</button>
            <button class="excluir" onclick="excluir(this, ${id})">Excluir</button>
        </div>
    `;

    lista.appendChild(linha);
}

function abrirUsuariosEmpresa(idEmpresa, nomeEmpresa) {
    sessionStorage.setItem("EMPRESA_ID_SELECIONADA", idEmpresa);
    sessionStorage.setItem("EMPRESA_NOME_SELECIONADA", nomeEmpresa);

    window.location = "usuarios.html";
}

function excluir(botao, id) {
    fetch("/empresas/excluir/" + id, {
        method: "DELETE"
    })
        .then(function (resposta) {
            if (resposta.ok) {
                botao.closest(".linha").remove();
            } else {
                alert("Erro ao excluir empresa.");
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
    limparCampos();
    limparErros();
    sobrepor.style.display = "none";
}

sobrepor.addEventListener("click", function (e) {
    if (e.target === sobrepor) {
        fecharModal();
    }
});

function carregarEmpresas() {
    fetch("/empresas/listar")
        .then(function (res) {
            return res.json();
        })
        .then(function (lista) {
            lista.forEach(function (empresa) {
                adicionarLinha(
                    empresa.id_Empresa,
                    empresa.razao_social,
                    empresa.email,
                    empresa.cnpj,
                    empresa.status
                );
            });
        })
        .catch(function (erro) {
            console.error("Erro ao carregar empresas:", erro);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    carregarPerfilEmpresaAdmin();
    carregarEmpresas();
});