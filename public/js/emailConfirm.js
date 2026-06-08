const email = document.querySelector("#redefinirSenha");
const btn = document.querySelector("#botaoEnviar");

email.addEventListener("input", () => {
    if (email.value.length >= 10 && email.value.includes("@") && (email.value.includes(".com") || email.value.includes(".br") || email.value.includes(".net") || email.value.includes(".org")) ) {
        btn.style.backgroundColor = "#4CAF50";
    }
})

let emailSalvo = sessionStorage.getItem("email");

function validarEmail () {
    if (email.value == emailSalvo) {
        msgCorreto.textContent = "Email enviado com sucesso!";

        setInterval(() => {
            location.href = "login.html";
        }, 2500);
    } else {
        msgCorreto.textContent = "Email não encontrado no nosso sistema";
        msgCorreto.style.color = "#ff4444";
    }
}

btn.addEventListener('click', validarEmail);