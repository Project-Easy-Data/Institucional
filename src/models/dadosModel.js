var database = require("../database/config");

function buscarEstados() {
    var instrucaoSql = `
        SELECT id, nome, sigla FROM Unidade_Federativa ORDER BY nome;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMunicipiosPorUf(siglaUf) {
    var instrucaoSql = `
        SELECT id, nome FROM Municipio WHERE sigla_uf = '${siglaUf}' ORDER BY nome;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMunicipioPorId(id) {
    var instrucaoSql = `
        SELECT id, nome, populacao_total, populacao_urbana, populacao_rural
        FROM Municipio WHERE id = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosSaneamentoPorMunicipio(idMunicipio) {
    var instrucaoSql = `
        SELECT 
            m.populacao_total,
            m.populacao_urbana,
            m.populacao_rural,
            ds.agua_urbana,
            ds.agua_rural,
            ds.esgoto_urbano,
            ds.esgoto_rural,
            ds.residuos_urbano,
            ds.residuos_rural,
            ds.indice_drenagem
        FROM Municipio m
        INNER JOIN Dados_Saneamento ds ON m.id = ds.id_municipio
        WHERE m.id = ${idMunicipio};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarEstados,
    buscarMunicipiosPorUf,
    buscarMunicipioPorId,
    buscarDadosSaneamentoPorMunicipio
};