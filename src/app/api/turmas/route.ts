import { NextResponse } from 'next/server';
import { getTurmasByPolo, getVagasRestantes } from '@/models/turma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const poloSlug = searchParams.get('polo');
  const turmaId = searchParams.get('turmaId');

  try {
    if (turmaId) {
      const vagas = await getVagasRestantes(parseInt(turmaId));
      return NextResponse.json({ success: true, vagas });
    }
    
    if (!poloSlug) {
      return NextResponse.json({ success: false, error: 'Parâmetro polo obrigatório' }, { status: 400 });
    }
    
    const turmas = await getTurmasByPolo(poloSlug);
    return NextResponse.json({ success: true, data: turmas });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar turmas' }, { status: 500 });
  }
}