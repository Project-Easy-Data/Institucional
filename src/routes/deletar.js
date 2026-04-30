express = require("express");
var router = express.Router();

var funcionariosController = require("../controllers/funcionariosController");

router.delete("/:id", function(req, res) {
    funcionariosController.excluir(req, res);
});

module.exports = router;