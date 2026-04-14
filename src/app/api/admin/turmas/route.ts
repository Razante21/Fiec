import { NextResponse } from 'next/server';
import { createTurma, updateTurma, setLiberacao } from '@/models/turma';
import { getTurmasByPolo, getTurmaById } from '@/models/turma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const poloSlug = searchParams.get('polo');
  const turmaId = searchParams.get('id');
  
  try {
    if (turmaId) {
      const turma = await getTurmaById(parseInt(turmaId));
      return NextResponse.json({ success: true, data: turma });
    }
    
    if (poloSlug) {
      const turmas = await getTurmasByPolo(poloSlug);
      return NextResponse.json({ success: true, data: turmas });
    }
    
    return NextResponse.json({ success: false, error: 'Parâmetro obrigatório' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar turmas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    await createTurma(
      body.polo_id,
      body.modulo,
      body.dias,
      body.horario,
      body.vagas_total,
      body.script_url
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao criar turma' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  
  try {
    if (body.action === 'liberar') {
      await setLiberacao(body.id, body.liberado, body.data_liberacao);
      return NextResponse.json({ success: true });
    }
    
    await updateTurma(body.id, body.modulo, body.dias, body.horario, body.ativo, body.script_url);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar turma' }, { status: 500 });
  }
}