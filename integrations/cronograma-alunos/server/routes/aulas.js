const express = require('express');
const pool = require('../config/db');
const { authenticateToken, checkRole } = require('../middleware/auth');

const router = express.Router();

router.get('/aluno', authenticateToken, checkRole(['aluno']), async (req, res) => {
  try {
    const [aulas] = await pool.execute(
      `SELECT * FROM aulas WHERE status = 'ativa' AND fk_turma_id = ? ORDER BY CAST(ordem AS UNSIGNED)`,
      [req.user.id_nivel]
    );
    res.json(aulas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aulas' });
  }
});

router.get('/turma/:turmaId', authenticateToken, checkRole(['professor']), async (req, res) => {
  try {
    const { turmaId } = req.params;
    const [aulas] = await pool.execute(
      `SELECT * FROM aulas WHERE fk_turma_id = ? AND fk_professor_id = ? ORDER BY CAST(ordem AS UNSIGNED)`,
      [turmaId, req.user.id_nivel]
    );
    res.json(aulas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aulas' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [aulas] = await pool.execute(
      'SELECT * FROM aulas WHERE id = ?',
      [req.params.id]
    );
    
    if (aulas.length === 0) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }
    
    res.json(aulas[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aula' });
  }
});

router.post('/', authenticateToken, checkRole(['professor']), async (req, res) => {
  try {
    const { 
      titulo, descricao, data, tipo, ordem, status,
      exercicio, slide, correcao,
      liberarExe, liberarSli, liberarCorr,
      turma 
    } = req.body;

    if (!titulo || !descricao || !data || !tipo || !ordem || !turma) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    await pool.execute(
      `INSERT INTO aulas (titulo, descricao, data, tipo, ordem, status, exercicio, slide, correcao, fk_turma_id, fk_professor_id, liberarExe, liberarSli, liberarCorr) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descricao, data, tipo, ordem, status || 'ativa', exercicio || '', slide || '', correcao || '', turma, req.user.id_nivel, liberarExe || '', liberarSli || '', liberarCorr || '']
    );

    res.json({ success: true, message: 'Aula criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    res.status(500).json({ error: 'Erro ao criar aula' });
  }
});

router.put('/:id', authenticateToken, checkRole(['professor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      titulo, descricao, data, tipo, ordem, status,
      exercicio, slide, correcao,
      liberarExe, liberarSli, liberateCorr
    } = req.body;

    const [aulas] = await pool.execute(
      'SELECT * FROM aulas WHERE id = ? AND fk_professor_id = ?',
      [id, req.user.id_nivel]
    );

    if (aulas.length === 0) {
      return res.status(404).json({ error: 'Aula não encontrada ou acesso negado' });
    }

    await pool.execute(
      `UPDATE aulas SET 
        titulo = ?, descricao = ?, data = ?, tipo = ?, ordem = ?, status = ?,
        exercicio = ?, slide = ?, correcao = ?,
        liberarSli = ?, liberarCorr = ?
       WHERE id = ? AND fk_professor_id = ?`,
      [titulo, descricao, data, tipo, ordem, status, exercicio, slide, correcao, liberarSli, liberateCorr, id, req.user.id_nivel]
    );

    res.json({ success: true, message: 'Aula atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    res.status(500).json({ error: 'Erro ao atualizar aula' });
  }
});

router.delete('/:id', authenticateToken, checkRole(['professor']), async (req, res) => {
  try {
    const { id } = req.params;

    const [aulas] = await pool.execute(
      'SELECT * FROM aulas WHERE id = ? AND fk_professor_id = ?',
      [id, req.user.id_nivel]
    );

    if (aulas.length === 0) {
      return res.status(404).json({ error: 'Aula não encontrada ou acesso negado' });
    }

    await pool.execute('DELETE FROM aulas WHERE id = ? AND fk_professor_id = ?', [id, req.user.id_nivel]);

    res.json({ success: true, message: 'Aula excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir aula:', error);
    res.status(500).json({ error: 'Erro ao excluir aula' });
  }
});

module.exports = router;