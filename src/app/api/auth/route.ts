import { NextResponse } from 'next/server';
import { verifyLogin } from '@/models/usuario';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.usuario || !body.senha) {
      return NextResponse.json({ success: false, error: 'Usuário e senha obrigatórios' }, { status: 400 });
    }
    
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
  } catch (error: any) {
    console.error('Auth error:', error.message);
    return NextResponse.json({ success: false, error: 'Erro ao fazer login' }, { status: 500 });
  }
}