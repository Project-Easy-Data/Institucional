const sobrepor = document.getElementById("sobrepor");

function confirmar() {
    const nome = document.getElementById("inputNome").value;
    const email = document.getElementById("inputEmail").value;
    const cargoSelect = document.getElementById("selectCargo").value;

    let permissao;
    let cargoId;

    if (cargoSelect === 'Gerente') {
        permissao = 1;
        cargoId = 1;
    } else if (cargoSelect === 'Funcionário') {
        permissao = 2;
        cargoId = 2;
    } else {
        permissao = 3;
        cargoId = 3;
    }

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
                <p>${cargoSelect}</p>
                <button class="excluir" onclick="excluir(this, ${dados.insertId})">Excluir</button>
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
    fetch("/deletar/" + id, { method: "DELETE" })
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

    function trocarTab(tab) {
        const d = tabData[tab];
        if (!d) return;
    

        document.querySelectorAll(".tabBtn").forEach(btn => btn.classList.remove("ativo"));
        document.querySelector(`.tabBtn[data-tab="${tab}"]`).classList.add("ativo");
      }

      document.querySelectorAll(".tabBtn").forEach(btn => {
        btn.addEventListener("click", () => trocarTab(btn.dataset.tab));
      });

      const links = document.querySelectorAll('aside .btns a');

      links.forEach(link => {
          if (link.href === window.location.href) {
              link.classList.add('ativo');
          }
      });

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
                    <p>${u.cargo}</p>
                    <button class="excluir" onclick="excluir(this, ${u.id_funcionario})">Excluir</button>
                `;
                listaUsuarios.appendChild(novaLinha);
            });
        });
}

document.addEventListener("DOMContentLoaded", carregarUsuarios);
