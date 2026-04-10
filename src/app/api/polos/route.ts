import { NextResponse } from 'next/server';
import { getPolos } from '@/models/polo';

export async function GET() {
  try {
    const polos = await getPolos();
    return NextResponse.json({ success: true, data: polos });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar polos' }, { status: 500 });
  }
}