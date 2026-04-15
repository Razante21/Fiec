-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS cronograma;
USE cronograma;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel ENUM('administrador', 'professor', 'aluno') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de professores
CREATE TABLE IF NOT EXISTS professor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(100),
    descricao TEXT,
    fk_usuario_id INT NOT NULL,
    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabela de turmas
CREATE TABLE IF NOT EXISTS turma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma VARCHAR(100) NOT NULL,
    descricao TEXT,
    fk_usuario_id INT NOT NULL,
    fk_professor INT,
    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_professor) REFERENCES professor(id) ON DELETE SET NULL
);

-- Tabela de aulas
CREATE TABLE IF NOT EXISTS aulas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data DATE,
    tipo VARCHAR(100),
    ordem VARCHAR(20),
    status ENUM('ativa', 'inativa') DEFAULT 'ativa',
    exercicio VARCHAR(500),
    slide VARCHAR(500),
    correcao VARCHAR(500),
    liberarExe VARCHAR(10) DEFAULT '',
    liberarSli VARCHAR(10) DEFAULT '',
    liberarCorr VARCHAR(10) DEFAULT '',
    fk_turma_id INT NOT NULL,
    fk_professor_id INT NOT NULL,
    FOREIGN KEY (fk_turma_id) REFERENCES turma(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_professor_id) REFERENCES professor(id) ON DELETE CASCADE
);

-- Inserir usuário administrador padrão
-- Senha: Admin123 (hash bcrypt)
INSERT INTO usuario (nome, senha, nivel) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.lQbLx2YnqFKW0W4aRS', 'administrador')
ON DUPLICATE KEY UPDATE nome = nome;