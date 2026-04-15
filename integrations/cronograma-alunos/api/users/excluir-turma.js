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
  if (req.method !== 'DELETE') {
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

  const match = req.url.match(/\/turma\/(\d+)/);
  if (!match) {
    return res.status(400).json({ error: 'ID da turma não fornecido' });
  }
  const turmaId = match[1];

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const [turmaResult] = await connection.execute(
      'SELECT fk_usuario_id FROM turma WHERE id = ?',
      [turmaId]
    );

    if (turmaResult.length === 0) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }

    const usuarioId = turmaResult[0].fk_usuario_id;

    await connection.execute('DELETE FROM aulas WHERE fk_turma_id = ?', [turmaId]);
    await connection.execute('DELETE FROM turma WHERE id = ?', [turmaId]);
    await connection.execute('DELETE FROM usuario WHERE id = ?', [usuarioId]);

    await connection.commit();
    connection.release();
    
    res.json({ success: true, message: 'Turma excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir turma:', error);
    res.status(500).json({ error: 'Erro ao excluir turma' });
  }
}