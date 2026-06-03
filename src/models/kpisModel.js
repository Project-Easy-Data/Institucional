var database = require("../database/config");

function buscarPorEstado(idEstado) {
    var instrucaoSql = `
        SELECT 
            ds.populacao_atendida_esgoto,
            ds.populacao_urbana_residente_esgoto,
            ds.populacao_urbana_atendida_esgoto,
            ds.populacao_urbana_residente_esgoto_ibge,
            ds.extensao_rede_esgoto,
            e.sigla_estado,
            e.nome_estado
        FROM dados_saneamento ds
            INNER JOIN estados e ON ds.estados_id_estados = e.id_estados
        WHERE ds.estados_id_estados = ${idEstado};
    `;
    console.log("Executando instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarEstados() {
    var instrucaoSql = `
        SELECT id_estados, sigla_estado, nome_estado
        FROM estados
        ORDER BY nome_estado;
    `;
    console.log("Executando instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarResumoGeral() {
    var instrucaoSql = `
        SELECT 
            e.sigla_estado,
            e.nome_estado,
            SUM(ds.populacao_atendida_esgoto) AS total_atendida_esgoto,
            SUM(ds.populacao_urbana_residente_esgoto) AS total_urbana_residente,
            SUM(ds.populacao_urbana_atendida_esgoto) AS total_urbana_atendida,
            SUM(ds.extensao_rede_esgoto) AS total_extensao_rede
        FROM dados_saneamento ds
            INNER JOIN estados e ON ds.estados_id_estados = e.id_estados
        GROUP BY e.id_estados, e.sigla_estado, e.nome_estado
        ORDER BY e.nome_estado;
    `;
    console.log("Executando instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarPorEstado,
    listarEstados,
    buscarResumoGeral
};