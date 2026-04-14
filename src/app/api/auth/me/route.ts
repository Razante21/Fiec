import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

type UsuarioRow = {
  id: number
  usuario: string
  nivel: string
}

function extractUserIdFromToken(token: string): number | null {
  const match = token.match(/^token_(\d+)_\d+$/)
  if (!match) {
    return null
  }

  return parseInt(match[1], 10)
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token ausente' },
        { status: 401 }
      )
    }

    const userId = extractUserIdFromToken(token)

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      )
    }

    const resultado = await query({
      sql: 'SELECT id, usuario, nivel FROM usuarios WHERE id = ?',
      values: [userId],
    })

    const usuarios = Array.isArray(resultado) ? (resultado as UsuarioRow[]) : []

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
