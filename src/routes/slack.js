var express = require("express");
var fs = require("fs");
var router = express.Router();

var ARQUIVO_STATUS = "/app/slack-enabled.txt";

function lerStatus() {
    if (!fs.existsSync(ARQUIVO_STATUS)) {
        fs.writeFileSync(ARQUIVO_STATUS, "true");
    }

    return fs.readFileSync(ARQUIVO_STATUS, "utf8").trim() !== "false";
}

router.get("/status", function (req, res) {
    res.json({ ativo: lerStatus() });
});

router.put("/status", function (req, res) {
    var ativo = req.body.ativo ? "true" : "false";
    fs.writeFileSync(ARQUIVO_STATUS, ativo);
    res.json({ ativo: ativo === "true" });
});

module.exports = router;