import { NextResponse } from 'next/server';
import { verifyLogin } from '@/models/usuario';
import { createSessionToken } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const usuario = body?.usuario || body?.username;
    const senha = body?.senha || body?.password;
    
    if (!usuario || !senha) {
      return NextResponse.json({ success: false, error: 'Usuário e senha obrigatórios' }, { status: 400 });
    }
    
    const usuarioData = await verifyLogin(usuario, senha);
    
    if (!usuarioData) {
      return NextResponse.json({ success: false, error: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = createSessionToken({
      sub: usuarioData.id,
      usuario: usuarioData.usuario,
      nivel: usuarioData.nivel as 'admin' | 'coordenador' | 'aluno',
    });
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        id: usuarioData.id, 
        usuario: usuarioData.usuario, 
        nivel: usuarioData.nivel,
        token,
        user: {
          id: usuarioData.id,
          usuario: usuarioData.usuario,
          nivel: usuarioData.nivel,
        }
      }
    });
  } catch (error: any) {
    console.error('Auth error:', error.message);
    return NextResponse.json({ success: false, error: 'Erro ao fazer login' }, { status: 500 });
  }
}