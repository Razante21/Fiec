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

  // GET /api/aula/[id]
  if (req.method === 'GET') {
    const match = req.url.match(/\/aula\/(\d+)/);
    if (!match) {
      return res.status(400).json({ error: 'ID da aula não fornecido' });
    }
    const aulaId = match[1];
    const [aulas] = await pool.execute(
      'SELECT * FROM aulas WHERE id = ?',
      [aulaId]
    );
    if (aulas.length === 0) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }
    return res.json(aulas[0]);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}