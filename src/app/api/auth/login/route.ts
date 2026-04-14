import { NextRequest, NextResponse } from 'next/server'
import { verifyLogin } from '@/models/usuario'
import { createSessionToken } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const usuario = body?.usuario || body?.username
    const senha = body?.senha || body?.password

    if (!usuario || !senha) {
      return NextResponse.json(
        {
          erro: 'Usuário e senha são obrigatórios',
          error: 'Usuario e senha sao obrigatorios',
        },
        { status: 400 }
      )
    }

    const usuarioData = await verifyLogin(usuario, senha)

    if (!usuarioData) {
      return NextResponse.json(
        {
          erro: 'Usuário ou senha inválidos',
          error: 'Usuario ou senha invalidos',
        },
        { status: 401 }
      )
    }

    const token = createSessionToken({
      sub: usuarioData.id,
      usuario: usuarioData.usuario,
      nivel: usuarioData.nivel as 'admin' | 'coordenador' | 'aluno',
    })

    // Resposta bem-sucedida com dados do usuário
    return NextResponse.json(
      {
        sucesso: true,
        success: true,
        usuario: usuarioData.usuario,
        nivel: usuarioData.nivel,
        token,
        user: {
          id: usuarioData.id,
          usuario: usuarioData.usuario,
          nivel: usuarioData.nivel,
        },
      },
      { status: 200 }
    )
  } catch (erro) {
    console.error('Erro na autenticação:', erro)
    return NextResponse.json(
      {
        erro: 'Erro interno do servidor',
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    )
  }
}
