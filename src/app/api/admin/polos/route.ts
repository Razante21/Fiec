import { NextResponse } from 'next/server';
import { createPolo, updatePolo, getPolos, getPoloById } from '@/models/polo';
import { getBearerToken, verifySessionToken } from '@/lib/auth-server';

export async function GET(request: Request) {
  const token = getBearerToken(request);

  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const session = verifySessionToken(token);

  if (!session || session.nivel !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const polos = await getPolos();
    return NextResponse.json({ success: true, data: polos });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar polos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    await createPolo(body.nome, body.slug, body.descricao, body.endereco);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao criar polo' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  
  try {
    await updatePolo(body.id, body.nome, body.descricao, body.ativo);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar polo' }, { status: 500 });
  }
}