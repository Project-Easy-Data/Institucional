var express = require("express");
var router = express.Router();

var kpisController = require("../controllers/kpisController");

router.get("/municipios", function (req, res) {
    kpisController.listarMunicipios(req, res);
});

router.get("/resumo", function (req, res) {
    kpisController.buscarResumoGeral(req, res);
});

router.get("/:idMunicipio", function (req, res) {
    kpisController.buscarPorMunicipio(req, res);
});

module.exports = router;