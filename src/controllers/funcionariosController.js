var database = require("../database/config")

function cadastrar(nome, email, senha, permissao, cargo, empresaId) {
    var instrucaoSql = `
        INSERT INTO Usuario (nome, email, senha, fk_Cargo, permissao, status, fk_Empresa)
        VALUES ('${nome}', '${email}', '${senha}', ${cargo}, ${permissao}, 'ATIVO', ${empresaId});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listar(empresaId) {
    var instrucaoSql = `
        SELECT u.id_funcionario, u.nome, u.email, c.cargo
        FROM Usuario u
        INNER JOIN Cargo c ON u.fk_Cargo = c.idCargo
        WHERE u.fk_Empresa = ${empresaId};
    `;
    return database.executar(instrucaoSql);
}

function excluir(id) {
    var instrucaoSql = `DELETE FROM Usuario WHERE id_funcionario = ${id};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = { cadastrar, excluir, listar };

