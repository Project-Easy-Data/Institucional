var express = require("express");
var router = express.Router();
var empresaController = require("../controllers/empresaController");

router.post("/cadastrar", function(req, res) { 
    empresaController.cadastrar(req, res); 
});
router.get("/listar", function(req, res) { 
    empresaController.listar(req, res); 
});
router.delete("/excluir/:id", function(req, res) { 
    empresaController.excluir(req, res); 
});

module.exports = router;