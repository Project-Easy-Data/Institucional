var express = require("express");
var router = express.Router();

var funcionariosController = require("../controllers/funcionariosController");

router.post("/cadastrar", function(req, res) {
    funcionariosController.cadastrar(req, res);
});

router.get("/listar/:empresaId", function(req, res) {
    funcionariosController.listar(req, res);
});

router.put("/atualizarCargo/:id", function(req, res) {
    funcionariosController.atualizarCargo(req, res);
});

router.delete("/excluir/:id", function(req, res) {
    funcionariosController.excluir(req, res);
});

module.exports = router;