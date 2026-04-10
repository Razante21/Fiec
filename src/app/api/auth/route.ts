import { NextResponse } from 'next/server';
import { verifyLogin } from '@/models/usuario';

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const usuario = await verifyLogin(body.usuario, body.senha);
    
    if (!usuario) {
      return NextResponse.json({ success: false, error: 'Credenciais inválidas' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        id: usuario.id, 
        usuario: usuario.usuario, 
        nivel: usuario.nivel 
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao fazer login' }, { status: 500 });
  }
}