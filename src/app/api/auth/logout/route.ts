import { NextResponse } from 'next/server'

export async function POST() {
  // Logout é feito apenas no cliente (remover localStorage)
  // Esta rota pode ser usada para invalidar sessão no futuro
  return NextResponse.json(
    { sucesso: true, mensagem: 'Logout realizado com sucesso' },
    { status: 200 }
  )
}
