var database = require("../database/config");

function cadastrar(razao, email, cnpj, status) {
    var instrucaoSql = `
        INSERT INTO Empresa (
            razao_social,
            email,
            cnpj,
            status
        ) VALUES (
            '${razao}',
            '${email}',
            '${cnpj}',
            '${status}'
        );
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listar() {
    var instrucaoSql = `
        SELECT
            id_Empresa,
            razao_social,
            email,
            cnpj,
            status
        FROM Empresa
        ORDER BY id_Empresa DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluir(id) {
    var instrucaoSql = `
        DELETE FROM Empresa
        WHERE id_Empresa = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listar,
    excluir
};