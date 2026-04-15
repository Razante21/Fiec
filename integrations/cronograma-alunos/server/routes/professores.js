const express = require('express');
const pool = require('../config/db');
const { authenticateToken, checkRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, checkRole(['administrador']), async (req, res) => {
  try {
    const [professores] = await pool.execute(`
      SELECT p.id, p.tipo, p.descricao, u.nome 
      FROM professor p 
      LEFT JOIN usuario u ON p.fk_usuario_id = u.id 
      ORDER BY u.nome
    `);
    res.json(professores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar professores' });
  }
});

module.exports = router;