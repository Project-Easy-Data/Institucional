var express = require("express");
var router = express.Router();

var kpisController = require("../controllers/kpisController");

router.get("/estados", function (req, res) {
    kpisController.listarEstados(req, res);
});

router.get("/resumo", function (req, res) {
    kpisController.buscarResumoGeral(req, res);
});

router.get("/:idEstado", function (req, res) {
    kpisController.buscarPorEstado(req, res);
});

module.exports = router;