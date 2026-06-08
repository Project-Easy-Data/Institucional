const email = document.querySelector("#redefinirSenha");
const btn = document.querySelector("#botaoEnviar");
const msgCorreto = document.querySelector("#msgCorreto");

email.addEventListener("input", () => {
    const val = email.value;
    if (val.length >= 10 && val.includes("@") && (val.includes(".com") || val.includes(".br") || val.includes(".net") || val.includes(".org"))) {
        btn.style.backgroundColor = "#4CAF50";
    } else {
        btn.style.backgroundColor = "";
    }
});

btn.addEventListener("click", async function () {
    const emailDigitado = email.value.trim();

    if (!emailDigitado) {
        msgCorreto.textContent = "Por favor, digite um email.";
        msgCorreto.style.color = "#ff4444";
        return;
    }

    btn.disabled = true;
    btn.textContent = "Verificando...";

    try {
        const response = await fetch("/usuarios/verificarEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailServer: emailDigitado })
        });

        if (response.ok) {
            msgCorreto.textContent = "Email encontrado! Redirecionando...";
            msgCorreto.style.color = "#4CAF50";
            sessionStorage.setItem("emailRedefinir", emailDigitado);
            setTimeout(() => {
                location.href = "redefinir.html";
            }, 1500);
        } else if (response.status === 404) {
            msgCorreto.textContent = "Email não encontrado no nosso sistema.";
            msgCorreto.style.color = "#ff4444";
            btn.disabled = false;
            btn.textContent = "Enviar";
        } else {
            msgCorreto.textContent = "Erro ao verificar o email. Tente novamente.";
            msgCorreto.style.color = "#ff4444";
            btn.disabled = false;
            btn.textContent = "Enviar";
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        msgCorreto.textContent = "Erro de conexão. Tente novamente.";
        msgCorreto.style.color = "#ff4444";
        btn.disabled = false;
        btn.textContent = "Enviar";
    }
});
