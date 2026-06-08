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
            ds.indice_drenagem,
            ds.parcela_domicilios_risco
        FROM Municipio m
        INNER JOIN Dados_Saneamento ds ON m.id = ds.id_municipio
        WHERE m.id = ${idMunicipio};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosSaneamentoPorUf(siglaUf) {
    var instrucaoSql = `
        SELECT 
            SUM(m.populacao_total) AS populacao_total,
            SUM(m.populacao_urbana) AS populacao_urbana,
            SUM(m.populacao_rural) AS populacao_rural,
            SUM(ds.agua_urbana) AS agua_urbana,
            SUM(ds.agua_rural) AS agua_rural,
            SUM(ds.esgoto_urbano) AS esgoto_urbano,
            SUM(ds.esgoto_rural) AS esgoto_rural,
            SUM(ds.residuos_urbano) AS residuos_urbano,
            SUM(ds.residuos_rural) AS residuos_rural,
            ROUND(AVG(ds.indice_drenagem), 2) AS indice_drenagem
        FROM Municipio m
        INNER JOIN Dados_Saneamento ds ON m.id = ds.id_municipio
        WHERE m.sigla_uf = '${siglaUf}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarEstados,
    buscarMunicipiosPorUf,
    buscarMunicipioPorId,
    buscarDadosSaneamentoPorMunicipio,
    buscarDadosSaneamentoPorUf
};