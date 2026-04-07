CREATE DATABASE EasyData;

USE EasyData;

CREATE TABLE empresa (
    id_empresa INT AUTO_INCREMENT,
    nome_empresa VARCHAR(255) NOT NULL,
    email_empresa VARCHAR(255) NOT NULL UNIQUE,
    cnpj_empresa CHAR(14) NOT NULL UNIQUE,
    status TINYINT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,-- O on update atualiza automaticamente com a data/hora atual sempre que o registro for alterado.
    CONSTRAINT pk_empresa PRIMARY KEY (id_empresa), -- serve para dar um nome a chave primaria para caso de erro saber onde o erro ocorreu
    CONSTRAINT chk_status_empresa CHECK (status IN (0,1)) -- 0 para inativo e 1 para ativo
);

CREATE TABLE funcionario (
    id_funcionario INT AUTO_INCREMENT,
    nome_funcionario VARCHAR(255) NOT NULL,
    email_funcionario VARCHAR(255) NOT NULL UNIQUE,
    senha_funcionario VARCHAR(255) NOT NULL,
    cargo_funcionario VARCHAR(255) NOT NULL,
    status TINYINT NOT NULL,
    permissao INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    empresa_id_empresa INT NOT NULL,
    CONSTRAINT pk_funcionario PRIMARY KEY (id_funcionario),
    CONSTRAINT fk_funcionario_empresa 
        FOREIGN KEY (empresa_id_empresa) 
        REFERENCES empresa(id_empresa)
        ON DELETE CASCADE -- O ON DELETE CASCADE apaga automaticamente os registros relacionados quando o registro pai for deletado.
        ON UPDATE CASCADE,-- O ON UPDATE CASCADE atualiza automaticamente as chaves estrangeiras quando a chave primária for alterada.
    CONSTRAINT chk_permissao CHECK (permissao IN (1,2,3)), -- Nivel de permissão que o funcionario tem dentro da empresa
    CONSTRAINT chk_status_funcionario CHECK (status IN (0,1)) -- 0 para inativo e 1 para ativo
);

CREATE TABLE estados (
    id_estados INT AUTO_INCREMENT,
    sigla_estado CHAR(2) NOT NULL,
    nome_estado VARCHAR(45) NOT NULL,
    CONSTRAINT pk_estados PRIMARY KEY (id_estados)
);

CREATE TABLE dados_saneamento (
    id_dado_saneamento INT AUTO_INCREMENT,
    populacao_atendida_esgoto INT NOT NULL,
    populacao_urbana_residente_esgoto INT NOT NULL,
    populacao_urbana_atendida_esgoto INT NOT NULL,
    populacao_urbana_residente_esgoto_ibge INT NOT NULL,
    extensao_rede_esgoto INT NOT NULL,
    estados_id_estados INT NOT NULL,
    CONSTRAINT pk_dados_saneamento PRIMARY KEY (id_dado_saneamento),
    CONSTRAINT fk_dados_estado 
        FOREIGN KEY (estados_id_estados) 
        REFERENCES estados(id_estados)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE log (
    id_log INT AUTO_INCREMENT,
    data_log DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo_log VARCHAR(255) NOT NULL,
    tipo_log VARCHAR(45) NOT NULL,
    funcionario_id_funcionario INT NOT NULL,
    CONSTRAINT pk_log PRIMARY KEY (id_log),
    CONSTRAINT fk_log_funcionario 
        FOREIGN KEY (funcionario_id_funcionario) 
        REFERENCES funcionario(id_funcionario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);