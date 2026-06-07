const sobrepor = document.getElementById("sobrepor");

function confirmar() {
    const razao = document.getElementById("inputRazao").value;
    const cnpj = document.getElementById("inputCnpj").value;
    const status = document.getElementById("selectStatus").value;

    if (!razao) { document.getElementById("erroRazao").style.display = "block"; return; }
    if (!cnpj) { document.getElementById("erroCnpj").style.display = "block"; return; }
    if (!status) { document.getElementById("erroStatus").style.display = "block"; return; }

    fetch("/empresas/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razaoServer: razao, cnpjServer: cnpj, statusServer: status })
    })
    .then(function(resposta) {
        if (resposta.ok) {
            resposta.json().then(function(dados) {
                adicionarLinha(dados.insertId, razao, cnpj, status);
                fecharModal();
            });
        } else {
            alert("Erro ao cadastrar empresa.");
        }
    })
    .catch(function(erro) { console.error("Erro:", erro); });
}

function adicionarLinha(id, razao, cnpj, status) {
    const lista = document.querySelector(".listaUsuarios");
    const linha = document.createElement("div");
    linha.classList.add("linha");
    linha.innerHTML = `
        <p>${razao}</p>
        <p>${cnpj}</p>
        <p>${status}</p>
        <button class="excluir" onclick="excluir(this, ${id})">Excluir</button>
    `;
    lista.appendChild(linha);
}

function excluir(botao, id) {
    fetch("/empresas/excluir/" + id, { method: "DELETE" })
    .then(function(resposta) {
        if (resposta.ok) { botao.closest(".linha").remove(); }
        else { alert("Erro ao excluir empresa."); }
    })
    .catch(function(erro) { console.error("Erro:", erro); });
}

function addFunc() { sobrepor.style.display = "flex"; }
function fecharModal() { sobrepor.style.display = "none"; }

sobrepor.addEventListener("click", function(e) {
    if (e.target === sobrepor) fecharModal();
});

function carregarEmpresas() {
    fetch("/empresas/listar")
        .then(function(res) { return res.json(); })
        .then(function(lista) {
            lista.forEach(function(e) {
                adicionarLinha(e.id_Empresa, e.razao_social, e.cnpj, e.status);
            });
        });
}

document.addEventListener("DOMContentLoaded", carregarEmpresas);