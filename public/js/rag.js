const SERVER = "/rag";
let online = false;
let loading = false;

async function verificar() {
  try {
    const res = await fetch(SERVER + "/", {
      signal: AbortSignal.timeout(10000)
    });

    online = res.ok;
  } catch (erro) {
    online = false;
  }

  const dot = document.getElementById("rag-dot");
  if (dot) {
    dot.style.background = online ? "#4caf7d" : "#e74c3c";
  }

  return online;
}

async function enviar() {
  const input = document.getElementById("rag-input");
  const q = input.value.trim();

  if (!q || loading) return;

  addMsg(q, "usuario");
  input.value = "";

  loading = true;
  const typing = addMsg("...", "bot");

  try {
    const res = await fetch(`${SERVER}/ask?question=${encodeURIComponent(q)}`, {
      signal: AbortSignal.timeout(300000)
    });

    const data = await res.json();

    if (!res.ok) {
      typing.textContent = data.erro || "Erro ao consultar o servidor.";
      typing.className = "rag-bubble erro";
      return;
    }

    typing.textContent = data.resposta || data.erro || "Sem resposta.";
  } catch (erro) {
    typing.textContent =
      erro.name === "TimeoutError"
        ? "Tempo esgotado."
        : "Servidor offline.";

    typing.className = "rag-bubble erro";
  } finally {
    loading = false;
    verificar();
  }
}

function addMsg(texto, tipo) {
  const msgs = document.getElementById("rag-msgs");
  const div = document.createElement("div");

  div.className = "rag-bubble " + tipo;
  div.textContent = texto;

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;

  return div;
}

function toggle() {
  const p = document.getElementById("rag-painel");
  p.style.display = p.style.display === "flex" ? "none" : "flex";
}

const input = document.getElementById("rag-input");

if (input) {
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  });
}

window.toggle = toggle;
window.enviar = enviar;

verificar();