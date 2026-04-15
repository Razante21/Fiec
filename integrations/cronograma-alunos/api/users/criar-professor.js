const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  const jwt = require('jsonwebtoken');
  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  if (user.nivel !== 'administrador') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const { nome, senha, tipo, descricao } = req.body;

  if (!nome || !senha || !tipo) {
    return res.status(400).json({ error: 'Nome, senha e tipo são obrigatórios' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const connection = await pool.getConnection();
    
    await connection.beginTransaction();
    const [result] = await connection.execute(
      'INSERT INTO usuario (nome, senha, nivel) VALUES (?, ?, ?)',
      [nome, hashedSenha, 'professor']
    );
    await connection.execute(
      'INSERT INTO professor (tipo, descricao, fk_usuario_id) VALUES (?, ?, ?)',
      [tipo, descricao || '', result.insertId]
    );
    await connection.commit();
    connection.release();
    
    res.json({ success: true, message: 'Professor criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar professor:', error);
    res.status(500).json({ error: 'Erro ao criar professor' });
  }
}