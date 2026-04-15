const express = require('express');
const pool = require('../config/db');
const { authenticateToken, checkRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, checkRole(['professor']), async (req, res) => {
  try {
    const [turmas] = await pool.execute(
      'SELECT id, turma, descricao FROM turma WHERE fk_professor = ?',
      [req.user.id_nivel]
    );
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
});

router.get('/:id', authenticateToken, checkRole(['professor']), async (req, res) => {
  try {
    const [turmas] = await pool.execute(
      'SELECT id, turma, descricao FROM turma WHERE id = ? AND fk_professor = ?',
      [req.params.id, req.user.id_nivel]
    );
    
    if (turmas.length === 0) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    res.json(turmas[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar turma' });
  }
});

module.exports = router;