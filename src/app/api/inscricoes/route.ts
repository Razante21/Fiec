import { NextResponse } from 'next/server';
import { createInscricao, createListaEspera } from '@/models/inscricao';
import { incrementVagasUsadas, getTurmaById } from '@/models/turma';
import { isValidCpf, sanitizeCpf } from '@/lib/cpf';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.tipo === 'listaEspera') {
      await createListaEspera({
        turma_id: parseInt(body.turma_id),
        nome: body.nome,
        telefone: body.telefone,
        email: body.email,
      });
      return NextResponse.json({ success: true });
    }
    
    const turma = await getTurmaById(body.turma_id);
    if (!turma) {
      return NextResponse.json({ success: false, error: 'Turma não encontrada' }, { status: 404 });
    }
    
    if (!turma.liberado) {
      return NextResponse.json({ 
        success: false, 
        error: 'Formulário não liberado ainda',
        data_liberacao: turma.data_liberacao 
      }, { status: 403 });
    }

    const cpf = sanitizeCpf(body.cpf || '');
    if (!isValidCpf(cpf)) {
      return NextResponse.json({ success: false, error: 'CPF inválido' }, { status: 400 });
    }
    
    const vagasRestantes = turma.vagas_total - turma.vagas_usadas;
    if (vagasRestantes <= 0) {
      return NextResponse.json({ success: false, error: 'Vagas esgotadas' }, { status: 400 });
    }
    
    await createInscricao({
      turma_id: body.turma_id,
      nome: body.nome,
      data_nascimento: body.dataNascimento,
      cpf,
      telefone: body.telefone,
      endereco: body.endereco,
      cep: body.cep,
      email: body.email,
      termo1: body.termo1,
      termo2: body.termo2,
      termo3: body.termo3,
      termo4: body.termo4,
    });
    
    await incrementVagasUsadas(body.turma_id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Erro ao processar inscrição' }, { status: 500 });
  }
}