const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { authenticateToken, checkRole } = require('../middleware/auth');

const router = express.Router();

router.get('/professores', authenticateToken, checkRole(['administrador']), async (req, res) => {
  try {
    const [professores] = await pool.execute(`
      SELECT p.id, p.tipo, p.descricao, u.nome, u.nivel 
      FROM professor p 
      LEFT JOIN usuario u ON p.fk_usuario_id = u.id 
      ORDER BY u.nome
    `);
    res.json(professores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar professores' });
  }
});

router.get('/turmas', authenticateToken, checkRole(['administrador']), async (req, res) => {
  try {
    const [turmas] = await pool.execute(`
      SELECT t.id, t.turma, t.descricao, u.nome, u.nivel, p.id as professor_id, p.tipo as professor_tipo
      FROM turma t 
      LEFT JOIN usuario u ON t.fk_usuario_id = u.id 
      LEFT JOIN professor p ON t.fk_professor = p.id
      ORDER BY u.nome
    `);
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
});

router.post('/professor', authenticateToken, checkRole(['administrador']), async (req, res) => {
  try {
    const { nome, senha, tipo, descricao } = req.body;

    if (!nome || !senha || !tipo) {
      return res.status(400).json({ error: 'Nome, senha e tipo são obrigatórios' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        'INSERT INTO usuario (nome, senha, nivel) VALUES (?, ?, ?)',
        [nome, hashedSenha, 'professor']
      );

      await connection.execute(
        'INSERT INTO professor (tipo, descricao, fk_usuario_id) VALUES (?, ?, ?)',
        [tipo, descricao || '', result.insertId]
      );

      await connection.commit();
      res.json({ success: true, message: 'Professor criado com sucesso' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao criar professor:', error);
    res.status(500).json({ error: 'Erro ao criar professor' });
  }
});

router.post('/turma', authenticateToken, checkRole(['administrador']), async (req, res) => {
  try {
    const { nome, senha, turma, descricao, professor } = req.body;

    if (!nome || !senha || !turma || !professor) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        'INSERT INTO usuario (nome, senha, nivel) VALUES (?, ?, ?)',
        [nome, hashedSenha, 'aluno']
      );

      await connection.execute(
        'INSERT INTO turma (turma, descricao, fk_usuario_id, fk_professor) VALUES (?, ?, ?, ?)',
        [turma, descricao || '', result.insertId, professor]
      );

      await connection.commit();
      res.json({ success: true, message: 'Turma criada com sucesso' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao criar turma:', error);
    res.status(500).json({ error: 'Erro ao criar turma' });
  }
});

router.delete('/professor/:id', authenticateToken, checkRole(['administrador']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [usuarioResult] = await connection.execute(
        'SELECT fk_usuario_id FROM professor WHERE id = ?',
        [id]
      );

      if (usuarioResult.length === 0) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      const usuarioId = usuarioResult[0].fk_usuario_id;

      const [turmasResult] = await connection.execute(
        'SELECT id, fk_usuario_id FROM turma WHERE fk_professor = ?',
        [id]
      );

      const turmasIds = turmasResult.map(t => t.fk_usuario_id);
      
      if (turmasIds.length > 0) {
        await connection.execute(
          `DELETE FROM aulas WHERE fk_professor_id = ?`,
          [id]
        );
        
        await connection.execute(
          `DELETE FROM turma WHERE fk_professor = ?`,
          [id]
        );
        
        await connection.execute(
          `DELETE FROM usuario WHERE id IN (${turmasIds.map(() => '?').join(',')})`,
          turmasIds
        );
      }

      await connection.execute('DELETE FROM professor WHERE id = ?', [id]);
      await connection.execute('DELETE FROM usuario WHERE id = ?', [usuarioId]);

      await connection.commit();
      res.json({ success: true, message: 'Professor excluído com sucesso' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao excluir professor:', error);
    res.status(500).json({ error: 'Erro ao excluir professor' });
  }
});

router.delete('/turma/:id', authenticateToken, checkRole(['administrador']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [turmaResult] = await connection.execute(
        'SELECT fk_usuario_id FROM turma WHERE id = ?',
        [id]
      );

      if (turmaResult.length === 0) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      const usuarioId = turmaResult[0].fk_usuario_id;

      await connection.execute('DELETE FROM aulas WHERE fk_turma_id = ?', [id]);
      await connection.execute('DELETE FROM turma WHERE id = ?', [id]);
      await connection.execute('DELETE FROM usuario WHERE id = ?', [usuarioId]);

      await connection.commit();
      res.json({ success: true, message: 'Turma excluída com sucesso' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao excluir turma:', error);
    res.status(500).json({ error: 'Erro ao excluir turma' });
  }
});

module.exports = router;