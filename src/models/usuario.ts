import { query } from '@/lib/db';

export interface Usuario {
  id: number;
  usuario: string;
  senha: string;
  nivel: 'admin' | 'coordenador' | 'aluno';
}

export async function getUsuarioByUsuario(usuario: string): Promise<Usuario | null> {
  const rows = await query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]) as Usuario[];
  return rows[0] || null;
}

export async function getUsuarioById(id: number): Promise<Usuario | null> {
  const rows = await query('SELECT * FROM usuarios WHERE id = ?', [id]) as Usuario[];
  return rows[0] || null;
}

export async function createUsuario(usuario: string, senha: string, nivel: string) {
  return query(
    'INSERT INTO usuarios (usuario, senha, nivel) VALUES (?, ?, ?)',
    [usuario, senha, nivel]
  );
}

export async function verifyLogin(usuario: string, senha: string): Promise<Usuario | null> {
  const rows = await query(
    'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?',
    [usuario, senha]
  ) as Usuario[];
  return rows[0] || null;
}