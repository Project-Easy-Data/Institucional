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
            idUnidade_Federativa INT AUTO_INCREMENT,
            sigla CHAR(2) NOT NULL,
            nome VARCHAR(255) NOT NULL,
            CONSTRAINT pk_unidade_federativa PRIMARY KEY (idUnidade_Federativa),
            CONSTRAINT uk_uf_sigla UNIQUE (sigla)
      );

      CREATE TABLE Municipio (
            idMunicipios INT AUTO_INCREMENT,
            nome VARCHAR(255) NOT NULL,
            fk_Unidade_Federativa INT NOT NULL,

            CONSTRAINT pk_municipio PRIMARY KEY (idMunicipios),

            CONSTRAINT fk_municipio_unidade_federativa
                  FOREIGN KEY (fk_Unidade_Federativa)
                  REFERENCES Unidade_Federativa(idUnidade_Federativa)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE,

            CONSTRAINT uk_municipio_uf UNIQUE (
                  nome,
                  fk_Unidade_Federativa
            )
      );

      CREATE TABLE Dados_Saneamento (
            idDados_Saneamento INT AUTO_INCREMENT,
            ano_referencia YEAR NOT NULL,
            agua_potavel INT NOT NULL,
            esgoto INT NOT NULL,
            residuos INT NOT NULL,
            drenagem INT NOT NULL,
            observacao VARCHAR(255),
            fk_Empresa INT NOT NULL,
            fk_Municipio INT NOT NULL,

            CONSTRAINT pk_dados_saneamento PRIMARY KEY (idDados_Saneamento),

            CONSTRAINT fk_dados_saneamento_empresa
                  FOREIGN KEY (fk_Empresa)
                  REFERENCES Empresa(id_Empresa)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE,

            CONSTRAINT fk_dados_saneamento_municipio
                  FOREIGN KEY (fk_Municipio)
                  REFERENCES Municipio(idMunicipios)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE,

            CONSTRAINT uk_dados_saneamento UNIQUE (
                  ano_referencia,
                  fk_Empresa,
                  fk_Municipio
            )
      );

      CREATE TABLE Log (
            id_log INT AUTO_INCREMENT,
            data DATETIME DEFAULT CURRENT_TIMESTAMP,
            motivo VARCHAR(255) NOT NULL,
            tipo VARCHAR(45) NOT NULL,

            CONSTRAINT pk_log PRIMARY KEY (id_log),

            CONSTRAINT fk_log_usuario
                  FOREIGN KEY (fk_Usuario)
                  REFERENCES Usuario(id_funcionario)
                  ON DELETE SET NULL
                  ON UPDATE CASCADE
      );

      CREATE TABLE Notificacao_Slack (
            idNotificacao INT AUTO_INCREMENT,
            mensagem VARCHAR(255) NOT NULL,
            data DATETIME DEFAULT CURRENT_TIMESTAMP,
            status ENUM('PENDENTE', 'ENVIADO', 'ERRO') DEFAULT 'PENDENTE',
            fk_Log INT NOT NULL,

            CONSTRAINT pk_notificacao_slack PRIMARY KEY (idNotificacao),

            CONSTRAINT fk_notificacao_slack_log
                  FOREIGN KEY (fk_Log)
                  REFERENCES Log(id_log)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE
      );

      CREATE USER IF NOT EXISTS 'Easy'@'%' IDENTIFIED BY 'Easydata@2026';

      GRANT ALL PRIVILEGES ON EasyData.* TO 'Easy'@'%';

      FLUSH PRIVILEGES;