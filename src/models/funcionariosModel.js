var database = require("../database/config")

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha, permissao, cargo, empresaId) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, cargo, permissao, empresaId);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
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

module.exports = { cadastrar, excluir, listar };

function excluir(id) {
    var instrucaoSql = `DELETE FROM Usuario WHERE id_funcionario = ${id};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    excluir
};