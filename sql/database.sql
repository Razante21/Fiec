-- Script de criação do banco de dados FIEC

-- Criar banco
CREATE DATABASE IF NOT EXISTS fiec_db;
USE fiec_db;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel ENUM('admin', 'coordenador', 'aluno') NOT NULL DEFAULT 'aluno',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de polos
CREATE TABLE IF NOT EXISTS polos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    endereco VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de turmas
CREATE TABLE IF NOT EXISTS turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    polo_id INT NOT NULL,
    modulo VARCHAR(50) NOT NULL,
    dias VARCHAR(50) NOT NULL,
    horario VARCHAR(50) NOT NULL,
    vagas_total INT DEFAULT 40,
    vagas_usadas INT DEFAULT 0,
    liberado BOOLEAN DEFAULT FALSE,
    data_liberacao DATETIME,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (polo_id) REFERENCES polos(id) ON DELETE CASCADE
);

-- Tabela de inscrições
CREATE TABLE IF NOT EXISTS inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    email VARCHAR(150) NOT NULL,
    termo1 BOOLEAN DEFAULT FALSE,
    termo2 BOOLEAN DEFAULT FALSE,
    termo3 BOOLEAN DEFAULT FALSE,
    termo4 BOOLEAN DEFAULT FALSE,
    status ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE
);

-- Tabela de lista de espera
CREATE TABLE IF NOT EXISTS lista_espera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    email VARCHAR(150) NOT NULL,
    status ENUM('pendente', 'contatado', 'matriculado', 'expirado') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE
);

-- Inserir polos iniciais
INSERT INTO polos (nome, slug, descricao) VALUES
('FIEC', 'fiec', 'Polo Principal FIEC'),
('CEU', 'ceu', 'Centro de Unidades Educacionais'),
('Bem Viver', 'bem-viver', 'Projeto Bem Viver'),
('Casa da Providência', 'casa-da-providencia', 'Casa da Providência'),
('JD Brasil', 'jd-brasil', 'Jardim Brasil'),
('Sol-Sol', 'sol-sol', 'Projeto Sol-Sol'),
('Veredas', 'veredas', 'Projeto Veredas'),
('Comunidade Independente', 'comunidade-independente', 'Comunidade Independente');

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO usuarios (usuario, senha, nivel) VALUES 
('admin', 'admin123', 'admin');

-- Inserir turmas do FIEC (polo_id = 1)
INSERT INTO turmas (polo_id, modulo, dias, horario, vagas_total, liberado) VALUES 
(1, 'Módulo I — Básico', '2ª e 4ª-feira', '08h30 às 10h00', 40, FALSE),
(1, 'Módulo I — Básico', '3ª e 5ª-feira', '14h00 às 15h30', 40, FALSE),
(1, 'Módulo I — Básico', '3ª e 5ª-feira', '19h00 às 20h30', 40, FALSE),
(1, 'Módulo II — Intermediário', '2ª e 4ª-feira', '10h15 às 11h45', 40, FALSE),
(1, 'Módulo II — Intermediário', '2ª e 4ª-feira', '14h00 às 15h30', 40, FALSE),
(1, 'Módulo II — Intermediário', '2ª e 4ª-feira', '16h00 às 17h30', 40, FALSE),
(1, 'Módulo II — Intermediário', '2ª e 4ª-feira', '19h00 às 20h30', 40, FALSE),
(1, 'Módulo II — Intermediário', '3ª e 5ª-feira', '08h30 às 10h00', 40, FALSE);

-- Inserir turmas do CEU (polo_id = 2)
INSERT INTO turmas (polo_id, modulo, dias, horario, vagas_total, liberado) VALUES 
(2, 'Módulo I — Básico', '3ª e 5ª-feira', '14h00 às 16h00', 40, FALSE);

-- Inserir turmas da Casa da Providência (polo_id = 4)
INSERT INTO turmas (polo_id, modulo, dias, horario, vagas_total, liberado) VALUES 
(4, 'Módulo II — Intermediário', '2ª e 4ª-feira', '09h30 às 11h30', 40, FALSE);

-- Inserir turmas do Sol-Sol (polo_id = 6)
INSERT INTO turmas (polo_id, modulo, dias, horario, vagas_total, liberado) VALUES 
(6, 'Módulo II — Intermediário', '3ª e 5ª-feira', '09h30 às 11h30', 40, FALSE);

-- Inserir turmas do JD Brasil (polo_id = 5)
INSERT INTO turmas (polo_id, modulo, dias, horario, vagas_total, liberado) VALUES 
(5, 'Módulo II — Intermediário', '2ª e 4ª-feira', '15h30 às 17h30', 40, FALSE);

-- Inserir turmas da Comunidade Independente (polo_id = 8)
INSERT INTO turmas (polo_id, modulo, dias, horario, vagas_total, liberado) VALUES 
(8, 'Módulo II — Intermediário', '3ª e 5ª-feira', '14h00 às 16h00', 40, FALSE);