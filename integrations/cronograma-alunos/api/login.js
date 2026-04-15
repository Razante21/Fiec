const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  try {
    const { username, password } = req.body;
    
    const [users] = await pool.execute(
      'SELECT * FROM usuario WHERE nome = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos!' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.senha);

    if (!validPassword) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos!' });
    }

    let id_nivel = null;
    if (user.nivel === 'professor') {
      const [professores] = await pool.execute(
        'SELECT id FROM professor WHERE fk_usuario_id = ?',
        [user.id]
      );
      if (professores.length > 0) {
        id_nivel = professores[0].id;
      }
    } else if (user.nivel === 'aluno') {
      const [turmas] = await pool.execute(
        'SELECT id FROM turma WHERE fk_usuario_id = ?',
        [user.id]
      );
      if (turmas.length > 0) {
        id_nivel = turmas[0].id;
      }
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, nivel: user.nivel, id_nivel },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        nivel: user.nivel,
        id_nivel
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}