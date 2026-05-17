const SERVER = "http://3.80.69.4:8000";
let online = false;
let loading = false;

async function verificar() {
  try {
    const res = await fetch(SERVER + "/", { signal: AbortSignal.timeout(4000) });
    online = res.ok;
  } catch {
    online = false;
  }
  document.getElementById("rag-dot").style.background = online ? "#4caf7d" : "#e74c3c";
}

async function enviar() {
  const input = document.getElementById("rag-input");
  const q = input.value.trim();
  if (!q || loading) return;

  addMsg(q, "usuario");
  input.value = "";

  if (!online) { addMsg("Servidor offline.", "erro"); return; }

  loading = true;
  const typing = addMsg("...", "bot");

  try {
    const res = await fetch(`${SERVER}/ask?question=${encodeURIComponent(q)}`, {
      signal: AbortSignal.timeout(60000)
    });
    const data = await res.json();
    typing.textContent = data.resposta || data.erro || "Sem resposta.";
  } catch (e) {
    typing.textContent = e.name === "TimeoutError" ? "Tempo esgotado." : "Erro: " + e.message;
    typing.className = "rag-bubble erro";
  } finally {
    loading = false;
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

document.getElementById("rag-input").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }
});

verificar();