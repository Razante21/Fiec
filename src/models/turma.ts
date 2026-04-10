import { query } from '@/lib/db';

export interface Turma {
  id: number;
  polo_id: number;
  modulo: string;
  dias: string;
  horario: string;
  vagas_total: number;
  vagas_usadas: number;
  liberado: number;
  data_liberacao: string | null;
  ativo: number;
}

export async function getTurmasByPolo(poloSlug: string): Promise<Turma[]> {
  const rows = await query(`
    SELECT t.* 
    FROM turmas t
    JOIN polos p ON t.polo_id = p.id
    WHERE p.slug = ? AND t.ativo = 1
    ORDER BY t.modulo, t.horario
  `, [poloSlug]);
  return rows as Turma[];
}

export async function getTurmaById(id: number): Promise<Turma | null> {
  const rows = await query('SELECT * FROM turmas WHERE id = ?', [id]) as Turma[];
  return rows[0] || null;
}

export async function createTurma(
  poloId: number,
  modulo: string,
  dias: string,
  horario: string,
  vagasTotal: number = 40
) {
  return query(
    'INSERT INTO turmas (polo_id, modulo, dias, horario, vagas_total) VALUES (?, ?, ?, ?, ?)',
    [poloId, modulo, dias, horario, vagasTotal]
  );
}

export async function updateTurma(
  id: number,
  modulo: string,
  dias: string,
  horario: string,
  ativo: boolean
) {
  return query(
    'UPDATE turmas SET modulo = ?, dias = ?, horario = ?, ativo = ? WHERE id = ?',
    [modulo, dias, horario, ativo ? 1 : 0, id]
  );
}

export async function setLiberacao(id: number, liberado: boolean, dataLiberacao?: string) {
  return query(
    'UPDATE turmas SET liberado = ?, data_liberacao = ? WHERE id = ?',
    [liberado ? 1 : 0, dataLiberacao || null, id]
  );
}

export async function incrementVagasUsadas(id: number) {
  return query('UPDATE turmas SET vagas_usadas = vagas_usadas + 1 WHERE id = ?', [id]);
}

export async function getVagasRestantes(id: number): Promise<number> {
  const rows = await query(
    'SELECT vagas_total - vagas_usadas as vagas FROM turmas WHERE id = ?',
    [id]
  ) as { vagas: number }[];
  return rows[0]?.vagas || 0;
}