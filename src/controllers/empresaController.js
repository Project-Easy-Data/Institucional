var empresaModel = require("../models/empresaModel");

function cadastrar(req, res) {
    var razao = req.body.razaoServer;
    var email = req.body.emailServer;
    var cnpj = req.body.cnpjServer;
    var status = req.body.statusServer;

    if (!razao) { return res.status(400).send("Razão social indefinida!"); }
    if (!email) { return res.status(400).send("Email indefinido!"); }
    if (!cnpj) { return res.status(400).send("CNPJ indefinido!"); }
    if (!status) { return res.status(400).send("Status indefinido!"); }

    empresaModel.cadastrar(razao, email, cnpj, status)
        .then(function(resultado) { res.json(resultado); })
        .catch(function(erro) { res.status(500).json(erro.sqlMessage); });
}

function listar(req, res) {
    empresaModel.listar()
        .then(function(resultado) { res.json(resultado); })
        .catch(function(erro) { res.status(500).json(erro.sqlMessage); });
}

function excluir(req, res) {
    var id = req.params.id;
    empresaModel.excluir(id)
        .then(function(resultado) { res.json(resultado); })
        .catch(function(erro) { res.status(500).json(erro.sqlMessage); });
}

module.exports = { cadastrar, listar, excluir };