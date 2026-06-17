var database = require("../database/config");

function cadastrar(nome, email, senha, cargo, permissao, empresaId) {
    var instrucaoSql = `
        INSERT INTO Usuario (
            nome,
            email,
            senha,
            permissao,
            status,
            fk_Empresa,
            fk_Cargo
        ) VALUES (
            '${nome}',
            '${email}',
            '${senha}',
            ${permissao},
            'ATIVO',
            ${empresaId},
            ${cargo}
        );
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listar(empresaId) {
    var instrucaoSql = `
        SELECT
            u.id_funcionario,
            u.nome,
            u.email,
            u.permissao,
            u.fk_Empresa,
            u.fk_Cargo,
            c.cargo
        FROM Usuario u
        LEFT JOIN Cargo c ON c.idCargo = u.fk_Cargo
        WHERE u.fk_Empresa = ${empresaId}
          AND u.email NOT LIKE '%@easydata.com'
        ORDER BY u.id_funcionario DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarCargo(id, cargo, permissao) {
    var instrucaoSql = `
        UPDATE Usuario
        SET fk_Cargo = ${cargo},
            permissao = ${permissao}
        WHERE id_funcionario = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listar,
    atualizarCargo
};