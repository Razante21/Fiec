import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

type UsuarioRow = {
  id: number
  usuario: string
  nivel: string
}

export async function POST(request: NextRequest) {
  try {
    const { usuario, senha } = await request.json()

    if (!usuario || !senha) {
      return NextResponse.json(
        { erro: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário no banco de dados
    const resultado = await query({
      sql: 'SELECT id, usuario, nivel FROM usuarios WHERE usuario = ?',
      values: [usuario],
    })

    const usuarios = Array.isArray(resultado) ? (resultado as UsuarioRow[]) : []

    if (usuarios.length === 0) {
      return NextResponse.json(
        { erro: 'Usuário ou senha inválidos' },
        { status: 401 }
      )
    }

    const usuarioData = usuarios[0]

    // TODO: Implementar validação de senha com bcrypt
    // Por enquanto, aceitar qualquer senha (apenas para desenvolvimento)
    // Em produção: bcrypt.compare(senha, usuarioData.senha)

    // Resposta bem-sucedida com dados do usuário
    return NextResponse.json(
      {
        sucesso: true,
        usuario: usuarioData.usuario,
        nivel: usuarioData.nivel,
        token: `token_${usuarioData.id}_${Date.now()}` // TODO: Implementar JWT real
      },
      { status: 200 }
    )
  } catch (erro) {
    console.error('Erro na autenticação:', erro)
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
