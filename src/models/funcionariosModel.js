var database = require("../database/config")

function cadastrar(nome, email, senha, permissao, cargo, empresaId) {
    var instrucaoSql = `
        INSERT INTO Usuario (nome, email, senha, fk_Cargo, permissao, status, fk_Empresa)
        VALUES ('${nome}', '${email}', '${senha}', ${cargo}, ${permissao}, 'ATIVO', ${empresaId});
    `;
    return database.executar(instrucaoSql);
}

function listar() {
    var instrucaoSql = `
        SELECT
            u.id_funcionario,
            u.nome,
            u.email,
            c.cargo
        FROM Usuario u
        LEFT JOIN Cargo c ON c.idCargo = u.fk_Cargo
        WHERE u.email NOT LIKE '%@easydata.com'
        ORDER BY u.id_funcionario DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluir(id) {
    var instrucaoSql = `DELETE FROM Usuario WHERE id_funcionario = ${id};`;
    return database.executar(instrucaoSql);
}

function atualizarCargo(id, cargoId, permissao) {
    var instrucaoSql = `
        UPDATE Usuario
        SET fk_Cargo = ${cargoId}, permissao = ${permissao}
        WHERE id_funcionario = ${id};
    `;
    return database.executar(instrucaoSql);
}

module.exports = { cadastrar, excluir, listar, atualizarCargo };