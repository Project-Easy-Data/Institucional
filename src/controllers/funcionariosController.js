var funcionariosModel = require("../models/funcionariosModel");

function cadastrar(req, res) {
    var nome = req.body.nomeServer
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var permissao = req.body.permissaoServer;
    var cargo = req.body.cargoServer;
    var empresaId = 1;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else if (nome == undefined) {
        res.status(400).send("Seu nome está indefinido!");
    } else if (permissao == undefined) {
        res.status(400).send("Sua permissao está indefinida!");
    } else if (cargo == undefined) {
        res.status(400).send("Seu cargo está indefinido!");
    } else {
        funcionariosModel.cadastrar(nome, email, senha, cargo, permissao, empresaId)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function excluir(req, res) {
    var id = req.params.id;
    funcionariosModel.excluir(id)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log("\nHouve um erro ao excluir! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    cadastrar,
    excluir
}