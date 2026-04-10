import { query } from '@/lib/db';

export interface Polo {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  endereco: string;
  ativo: boolean;
}

export async function getPolos(): Promise<Polo[]> {
  return query('SELECT * FROM polos WHERE ativo = TRUE ORDER BY nome') as Promise<Polo[]>;
}

export async function getPoloBySlug(slug: string): Promise<Polo | null> {
  const rows = await query('SELECT * FROM polos WHERE slug = ?', [slug]) as Polo[];
  return rows[0] || null;
}

export async function getPoloById(id: number): Promise<Polo | null> {
  const rows = await query('SELECT * FROM polos WHERE id = ?', [id]) as Polo[];
  return rows[0] || null;
}

export async function createPolo(nome: string, slug: string, descricao: string, endereco?: string) {
  return query(
    'INSERT INTO polos (nome, slug, descricao, endereco) VALUES (?, ?, ?, ?)',
    [nome, slug, descricao, endereco || null]
  );
}

export async function updatePolo(id: number, nome: string, descricao: string, ativo: boolean) {
  return query(
    'UPDATE polos SET nome = ?, descricao = ?, ativo = ? WHERE id = ?',
    [nome, descricao, ativo, id]
  );
}