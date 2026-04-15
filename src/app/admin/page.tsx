'use client'

import { useRouter } from 'next/navigation'
import { useCurrentUser, useProtectedRoute } from '@/lib/auth-hooks'

export default function AdminInscricoesPage() {
  const router = useRouter()
  const { isReady } = useProtectedRoute(true, true)
  const usuario = useCurrentUser()

  const handleVoltar = () => {
    router.push('/hub')
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Admin Inscrições</h1>
            <p className="text-gray-600 mt-1">{usuario.usuario && `Logado como: ${usuario.usuario}`}</p>
          </div>
          <button
            onClick={handleVoltar}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            ← Voltar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card: Polos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📍 Polos</h3>
            <p className="text-gray-600 mb-4">Gerenciar polos cadastrados</p>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Gerenciar
            </button>
          </div>

          {/* Card: Turmas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎓 Turmas</h3>
            <p className="text-gray-600 mb-4">Criar, editar ou deletar turmas</p>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Gerenciar
            </button>
          </div>

          {/* Card: Inscrições */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Inscrições</h3>
            <p className="text-gray-600 mb-4">Visualizar inscrições e vagas</p>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Visualizar
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Painel de Administração - Inscrições
          </h2>
          <p className="text-gray-600 mb-4">
            Bem-vindo ao painel administrativo de inscrições. Aqui você pode:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Gerenciar polos e suas informações</li>
            <li>Criar e editar turmas por polo</li>
            <li>Acompanhar inscrições em tempo real</li>
            <li>Definir vagas disponíveis e datas de liberação</li>
            <li>Visualizar lista de espera</li>
          </ul>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Atenção:</strong> As funcionalidades completas de administração 
              serão implementadas nas próximas fases de desenvolvimento.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
