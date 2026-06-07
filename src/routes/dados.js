var express = require("express");
var router = express.Router();

var dadosController = require("../controllers/dadosController");

router.get("/estados", function (req, res) {
    dadosController.buscarEstados(req, res);
});

router.get("/municipios", function (req, res) {
    dadosController.buscarMunicipios(req, res);
});

router.get("/municipio/:id", function (req, res) {
    dadosController.buscarMunicipioPorId(req, res);
});

router.get("/saneamento/:idMunicipio", function (req, res) {
    dadosController.buscarDadosSaneamento(req, res);
});

module.exports = router;