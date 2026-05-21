var express = require("express");
var router = express.Router();

var RAG_URL = process.env.RAG_URL || "http://container-rag:8000";

async function repassarResposta(res, resposta) {
    var contentType = resposta.headers.get("content-type") || "application/json";
    var corpo = await resposta.text();
    res.status(resposta.status).type(contentType).send(corpo);
}

router.get("/", async function (req, res) {
    try {
        var resposta = await fetch(`${RAG_URL}/`);
        await repassarResposta(res, resposta);
    } catch (erro) {
        res.status(503).json({
            erro: "Servidor RAG offline.",
            detalhe: erro.message
        });
    }
});

router.get("/ask", async function (req, res) {
    var pergunta = req.query.question;

    if (!pergunta) {
        return res.status(400).json({ erro: "Pergunta não informada." });
    }

    try {
        var url = `${RAG_URL}/ask?question=${encodeURIComponent(pergunta)}`;
        var resposta = await fetch(url);
        await repassarResposta(res, resposta);
    } catch (erro) {
        res.status(503).json({
            erro: "Servidor RAG offline.",
            detalhe: erro.message
        });
    }
});

module.exports = router;