var empresasModel = require("../models/empresaModel");

function cadastrar(req, res) {
    var razao = req.body.razaoServer;
    var email = req.body.emailServer;
    var cnpj = req.body.cnpjServer;
    var status = req.body.statusServer;

    if (razao == undefined) {
        res.status(400).send("Razão social indefinida.");
    } else if (email == undefined) {
        res.status(400).send("Email indefinido.");
    } else if (cnpj == undefined) {
        res.status(400).send("CNPJ indefinido.");
    } else if (status == undefined) {
        res.status(400).send("Status indefinido.");
    } else {
        empresasModel.cadastrar(razao, email, cnpj, status)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function listar(req, res) {
    empresasModel.listar()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function excluir(req, res) {
    var id = req.params.id;

    empresasModel.excluir(id)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    cadastrar,
    listar,
    excluir
};