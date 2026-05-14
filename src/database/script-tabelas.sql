CREATE DATABASE EasyData;
USE EasyData;

CREATE TABLE Empresa (
    id_Empresa INT AUTO_INCREMENT,
    razao_social VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('ATIVO', 'INATIVO', 'PENDENTE') NOT NULL,
    CONSTRAINT pk_empresa PRIMARY KEY (id_Empresa)
);

CREATE TABLE Usuario (
    id_funcionario INT AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    permissao INT NOT NULL,
    status ENUM('ATIVO', 'INATIVO', 'PENDENTE') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Empresa_id_Empresa INT NOT NULL,

    CONSTRAINT pk_usuario PRIMARY KEY (id_funcionario),

    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (Empresa_id_Empresa)
        REFERENCES Empresa(id_Empresa)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_permissao_usuario CHECK (permissao IN (1, 2, 3))
);

CREATE TABLE Unidade_Federativa (
    idUnidade_Federativa INT AUTO_INCREMENT,
    sigla CHAR(2) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    CONSTRAINT pk_unidade_federativa PRIMARY KEY (idUnidade_Federativa)
);

CREATE TABLE Municipio (
    idMunicipios INT AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    Unidade_Federativa_idUnidade_Federativa INT NOT NULL,

    CONSTRAINT pk_municipio PRIMARY KEY (idMunicipios),

    CONSTRAINT fk_municipio_unidade_federativa
        FOREIGN KEY (Unidade_Federativa_idUnidade_Federativa)
        REFERENCES Unidade_Federativa(idUnidade_Federativa)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Dados_Saneamento (
    idDados_Saneamento INT AUTO_INCREMENT,
    ano_referencia DATE NOT NULL,
    agua_potavel INT NOT NULL,
    esgoto INT NOT NULL,
    residuos INT NOT NULL,
    drenagem INT NOT NULL,
    Dados_Saneamentocol VARCHAR(45),
    Empresa_id_Empresa INT NOT NULL,
    Municipio_idMunicipios INT NOT NULL,

    CONSTRAINT pk_dados_saneamento PRIMARY KEY (idDados_Saneamento),

    CONSTRAINT fk_dados_empresa
        FOREIGN KEY (Empresa_id_Empresa)
        REFERENCES Empresa(id_Empresa)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_dados_municipio
        FOREIGN KEY (Municipio_idMunicipios)
        REFERENCES Municipio(idMunicipios)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Log (
    id_log INT AUTO_INCREMENT,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255) NOT NULL,
    tipo VARCHAR(45) NOT NULL,
    CONSTRAINT pk_log PRIMARY KEY (id_log)
);