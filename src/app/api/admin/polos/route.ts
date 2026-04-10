import { NextResponse } from 'next/server';
import { createPolo, updatePolo, getPolos, getPoloById } from '@/models/polo';
import { verifyLogin, getUsuarioByUsuario } from '@/models/usuario';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const auth = request.headers.get('authorization');
  
  if (!auth) {
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