var database = require("../database/config");

function listarMunicipios() {
    var instrucaoSql = `
        SELECT 
            m.idMunicipios,
            m.nome AS nome_municipio,
            uf.sigla,
            uf.nome AS nome_estado
        FROM Municipio m
            INNER JOIN Unidade_Federativa uf ON m.fk_Unidade_Federativa = uf.idUnidade_Federativa
        ORDER BY m.nome;
    `;
    console.log("Executando:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorMunicipio(idMunicipio) {
    var instrucaoSql = `
        SELECT 
            ds.idDados_Saneamento,
            ds.ano_referencia,
            ds.agua_potavel,
            ds.esgoto,
            ds.residuos,
            ds.drenagem,
            ds.observacao,
            m.nome AS nome_municipio,
            uf.sigla,
            uf.nome AS nome_estado
        FROM Dados_Saneamento ds
            INNER JOIN Municipio m ON ds.fk_Municipio = m.idMunicipios
            INNER JOIN Unidade_Federativa uf ON m.fk_Unidade_Federativa = uf.idUnidade_Federativa
        WHERE ds.fk_Municipio = ${idMunicipio}
        ORDER BY ds.ano_referencia DESC;
    `;
    console.log("Executando:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarResumoGeral() {
    var instrucaoSql = `
        SELECT 
            m.nome AS nome_municipio,
            uf.sigla,
            uf.nome AS nome_estado,
            SUM(ds.agua_potavel) AS total_agua,
            SUM(ds.esgoto)       AS total_esgoto,
            SUM(ds.residuos)     AS total_residuos,
            SUM(ds.drenagem)     AS total_drenagem
        FROM Dados_Saneamento ds
            INNER JOIN Municipio m ON ds.fk_Municipio = m.idMunicipios
            INNER JOIN Unidade_Federativa uf ON m.fk_Unidade_Federativa = uf.idUnidade_Federativa
        GROUP BY m.idMunicipios, m.nome, uf.sigla, uf.nome
        ORDER BY m.nome;
    `;
    console.log("Executando:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarMunicipios,
    buscarPorMunicipio,
    buscarResumoGeral
};