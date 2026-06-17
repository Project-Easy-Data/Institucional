var express = require("express");
var router = express.Router();

var empresasController = require("../controllers/empresasController");

router.post("/cadastrar", function (req, res) {
    empresasController.cadastrar(req, res);
});

router.get("/listar", function (req, res) {
    empresasController.listar(req, res);
});

router.delete("/excluir/:id", function (req, res) {
    empresasController.excluir(req, res);
});

module.exports = router;