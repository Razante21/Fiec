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
('admin', '$2a$10$xJwDxGkGkGkGkGkGkGkGeO.xJwDxGkGkGkGkGkGkGkGkGkG', 'admin');