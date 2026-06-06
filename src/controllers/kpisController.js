var kpisModel = require("../models/kpisModel");

function listarMunicipios(req, res) {
    kpisModel.listarMunicipios()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao listar municípios:", erro);
            res.status(500).json(erro.sqlMessage || "Erro interno no servidor");
        });
}

function buscarPorMunicipio(req, res) {
    var idMunicipio = req.params.idMunicipio;

    if (!idMunicipio) {
        return res.status(400).send("O id do município é obrigatório!");
    }

    kpisModel.buscarPorMunicipio(idMunicipio)
        .then(function (resultado) {
            if (resultado.length === 0) {
                return res.status(404).send("Nenhum dado encontrado para este município.");
            }
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar KPIs:", erro);
            res.status(500).json(erro.sqlMessage || "Erro interno no servidor");
        });
}

function buscarResumoGeral(req, res) {
    kpisModel.buscarResumoGeral()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar resumo:", erro);
            res.status(500).json(erro.sqlMessage || "Erro interno no servidor");
        });
}

module.exports = {
    listarMunicipios,
    buscarPorMunicipio,
    buscarResumoGeral
};