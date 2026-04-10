import { NextResponse } from 'next/server';
import { getPolos } from '@/models/polo';

export async function GET() {
  try {
    console.log('API: Buscando polos...')
    const polos = await getPolos();
    console.log('API: Polos encontrados:', polos.length)
    return NextResponse.json({ success: true, data: polos });
  } catch (error: any) {
    console.error('API Error:', error.message)
    return NextResponse.json({ success: false, error: error.message || 'Erro ao buscar polos' }, { status: 500 });
  }
}