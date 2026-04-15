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

  if (req.method === 'GET') {
    const [turmas] = await pool.execute(
      'SELECT id, turma, descricao FROM turma WHERE fk_professor = ?',
      [user.id_nivel]
    );
    return res.json(turmas);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}