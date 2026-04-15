const mysql = require('mysql2/promise');

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

  if (user.nivel !== 'professor') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const { titulo, descricao, data, tipo, ordem, status, exercicio, slide, correcao, liberarExe, liberateSli, liberateCorr, turma } = req.body;

  if (!titulo || !descricao || !data || !tipo || !ordem || !turma) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  try {
    await pool.execute(
      `INSERT INTO aulas (titulo, descricao, data, tipo, ordem, status, exercicio, slide, correcao, fk_turma_id, fk_professor_id, liberarExe, liberateSli, liberateCorr) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descricao, data, tipo, ordem, status || 'ativa', exercicio || '', slide || '', correcao || '', turma, user.id_nivel, liberateExe || '', liberateSli || '', liberateCorr || '']
    );
    res.json({ success: true, message: 'Aula criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    res.status(500).json({ error: 'Erro ao criar aula' });
  }
}