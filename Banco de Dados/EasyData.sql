CREATE DATABASE IF NOT EXISTS EasyData;
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

CREATE TABLE Cargo (
    idCargo INT AUTO_INCREMENT,
    cargo VARCHAR(45) NOT NULL,
    CONSTRAINT pk_cargo PRIMARY KEY (idCargo),
    CONSTRAINT uk_cargo UNIQUE (cargo)
);

CREATE TABLE Usuario (
    id_funcionario INT AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    permissao INT NOT NULL,
    status ENUM('ATIVO', 'INATIVO', 'PENDENTE') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fk_Empresa INT NOT NULL,
    fk_Cargo INT NOT NULL,

    CONSTRAINT pk_usuario PRIMARY KEY (id_funcionario),

    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (fk_Empresa)
        REFERENCES Empresa(id_Empresa)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_usuario_cargo
        FOREIGN KEY (fk_Cargo)
        REFERENCES Cargo(idCargo)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_permissao_usuario CHECK (permissao IN (1, 2, 3))
);

CREATE TABLE Unidade_Federativa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo INT,
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(2) NOT NULL UNIQUE
);


CREATE TABLE Municipio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_ibge INT NOT NULL UNIQUE,
    nome VARCHAR(150) NOT NULL,
    sigla_uf VARCHAR(2) NOT NULL,
    populacao_total  INT,
    populacao_urbana INT,
    populacao_rural  INT,
    regiao VARCHAR(50),
    FOREIGN KEY (sigla_uf) REFERENCES Unidade_Federativa(sigla)
);

CREATE TABLE Dados_Saneamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_municipio INT NOT NULL UNIQUE,
    agua_urbana INT,
    agua_rural INT,
    esgoto_urbano INT,
    esgoto_rural INT,
    residuos_urbano INT,
    residuos_rural INT,
    cobertura_redes_pluviais DOUBLE,
    cobertura_pavimentacao DOUBLE,
    parcela_domicilios_risco DOUBLE,
    eventos_inundacao INT,
    sistema_alerta BOOLEAN,
    indice_drenagem DOUBLE,
    FOREIGN KEY (id_municipio) REFERENCES Municipio(id)
);

CREATE TABLE Log (
    id INT AUTO_INCREMENT,
    data DATETIME DEFAULT NOW(),
    tipo VARCHAR(45),
    motivo VARCHAR(255),
    CONSTRAINT pk_log PRIMARY KEY (id)
);

CREATE TABLE Notificacao_Slack (
    idNotificacao INT AUTO_INCREMENT,
    mensagem VARCHAR(255) NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_Log INT NOT NULL,

    CONSTRAINT pk_notificacao_slack PRIMARY KEY (idNotificacao),
    CONSTRAINT fk_notificacao_slack_log
        FOREIGN KEY (fk_Log)
        REFERENCES Log(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE USER IF NOT EXISTS 'Easy'@'%' IDENTIFIED BY 'Easydata@2026';

GRANT ALL PRIVILEGES ON EasyData.* TO 'Easy'@'%';

FLUSH PRIVILEGES;
