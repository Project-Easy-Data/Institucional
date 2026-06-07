var dadosModel = require("../models/dadosModel");

function buscarEstados(req, res) {
    dadosModel.buscarEstados()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar estados! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarMunicipios(req, res) {
    var uf = req.query.uf;

    if (uf == undefined) {
        res.status(400).send("O parâmetro 'uf' é obrigatório!");
    } else {
        dadosModel.buscarMunicipiosPorUf(uf)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar municípios! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarMunicipioPorId(req, res) {
    var id = req.params.id;

    if (id == undefined) {
        res.status(400).send("O parâmetro 'id' é obrigatório!");
    } else {
        dadosModel.buscarMunicipioPorId(id)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.json(resultado[0]);
                } else {
                    res.status(404).send("Município não encontrado!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar município! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarDadosSaneamento(req, res) {
    var idMunicipio = req.params.idMunicipio;

    if (idMunicipio == undefined) {
        res.status(400).send("O parâmetro 'idMunicipio' é obrigatório!");
    } else {
        dadosModel.buscarDadosSaneamentoPorMunicipio(idMunicipio)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.json(resultado[0]);
                } else {
                    res.status(404).send("Dados de saneamento não encontrados!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar dados de saneamento! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    buscarEstados,
    buscarMunicipios,
    buscarMunicipioPorId,
    buscarDadosSaneamento
};