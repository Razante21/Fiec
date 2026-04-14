import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getBearerToken, verifySessionToken } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request)

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token ausente' },
        { status: 401 }
      )
    }

    const session = verifySessionToken(token)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      )
    }

    const resultado = await query({
      sql: 'SELECT id, usuario, nivel FROM usuarios WHERE id = ?',
      values: [session.sub],
    })

    const usuarios = Array.isArray(resultado) ? resultado as Array<{ id: number; usuario: string; nivel: string }> : []

    if (usuarios.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const usuario = usuarios[0]

    return NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        usuario: usuario.usuario,
        nivel: usuario.nivel,
      },
    })
  } catch (error) {
    console.error('Erro ao validar sessão:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
