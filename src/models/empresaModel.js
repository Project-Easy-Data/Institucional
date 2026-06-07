var database = require("../database/config")

function cadastrar(razao, email, cnpj, status) {
    var instrucaoSql = `
        INSERT INTO Empresa (razao_social, cnpj, status)
        VALUES ('${razao}', '${cnpj}', '${status}');
    `;
    return database.executar(instrucaoSql);
}

function listar() {
    var instrucaoSql = `SELECT id_Empresa, razao_social, cnpj, status FROM Empresa;`;
    return database.executar(instrucaoSql);
}

function excluir(id) {
    var instrucaoSql = `DELETE FROM Empresa WHERE id_Empresa = ${id};`;
    return database.executar(instrucaoSql);
}

module.exports = { cadastrar, listar, excluir };