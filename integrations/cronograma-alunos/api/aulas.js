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

  // aulas/aluno
  if (req.method === 'GET' && user.nivel === 'aluno') {
    const [aulas] = await pool.execute(
      `SELECT * FROM aulas WHERE status = 'ativa' AND fk_turma_id = ? ORDER BY CAST(ordem AS UNSIGNED)`,
      [user.id_nivel]
    );
    return res.json(aulas);
  }

  // aulas/turma/[id]
  if (req.method === 'GET' && user.nivel === 'professor') {
    const match = req.url.match(/\/aulas\/turma\/(\d+)/);
    if (!match) {
      return res.status(400).json({ error: 'ID da turma não fornecido' });
    }
    const turmaId = match[1];
    const [aulas] = await pool.execute(
      `SELECT * FROM aulas WHERE fk_turma_id = ? AND fk_professor_id = ? ORDER BY CAST(ordem AS UNSIGNED)`,
      [turmaId, user.id_nivel]
    );
    return res.json(aulas);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}