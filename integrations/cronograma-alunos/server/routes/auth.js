const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Configuração de autenticação ausente' });
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }

    const trimmedUser = String(username).trim();
    
    const [users] = await pool.execute(
      'SELECT * FROM usuario WHERE nome = ?',
      [trimmedUser]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos!' });
    }

    const user = users[0];
    const passwordHash = String(user.senha || '');
    const normalizedHash = passwordHash.startsWith('$2y$')
      ? `$2a$${passwordHash.slice(4)}`
      : passwordHash;

    const validPassword = await bcrypt.compare(password, normalizedHash);

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
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, nome, nivel FROM usuario WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;