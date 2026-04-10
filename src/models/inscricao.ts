import { query } from '@/lib/db';

export interface Inscricao {
  id: number;
  turma_id: number;
  nome: string;
  data_nascimento: Date;
  cpf: string;
  telefone: string;
  endereco: string;
  cep: string;
  email: string;
  termo1: boolean;
  termo2: boolean;
  termo3: boolean;
  termo4: boolean;
  status: 'pendente' | 'confirmado' | 'cancelado';
}

export interface ListaEspera {
  id: number;
  turma_id: number;
  nome: string;
  telefone: string;
  email: string;
  status: 'pendente' | 'contatado' | 'matriculado' | 'expirado';
}

export async function createInscricao(data: {
  turma_id: number;
  nome: string;
  data_nascimento: string;
  cpf: string;
  telefone: string;
  endereco: string;
  cep: string;
  email: string;
  termo1: boolean;
  termo2: boolean;
  termo3: boolean;
  termo4: boolean;
}) {
  return query(`
    INSERT INTO inscricoes 
    (turma_id, nome, data_nascimento, cpf, telefone, endereco, cep, email, termo1, termo2, termo3, termo4)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.turma_id,
    data.nome,
    data.data_nascimento,
    data.cpf,
    data.telefone,
    data.endereco,
    data.cep,
    data.email,
    data.termo1,
    data.termo2,
    data.termo3,
    data.termo4,
  ]);
}

export async function createListaEspera(data: {
  turma_id: number;
  nome: string;
  telefone: string;
  email: string;
}) {
  return query(
    'INSERT INTO lista_espera (turma_id, nome, telefone, email) VALUES (?, ?, ?, ?)',
    [data.turma_id, data.nome, data.telefone, data.email]
  );
}

export async function getInscricoesByTurma(turmaId: number): Promise<Inscricao[]> {
  return query(
    'SELECT * FROM inscricoes WHERE turma_id = ? ORDER BY created_at DESC',
    [turmaId]
  ) as Promise<Inscricao[]>;
}

export async function getListaEsperaByTurma(turmaId: number): Promise<ListaEspera[]> {
  return query(
    'SELECT * FROM lista_espera WHERE turma_id = ? ORDER BY created_at ASC',
    [turmaId]
  ) as Promise<ListaEspera[]>;
}