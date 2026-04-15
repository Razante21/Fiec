'use client'

import { useRouter } from 'next/navigation'
import { useCurrentUser, useProtectedRoute } from '@/lib/auth-hooks'

export default function CronogramaPage() {
  const router = useRouter()
  const { isReady } = useProtectedRoute(true, false)
  const usuario = useCurrentUser()

  const handleVoltar = () => {
    router.push('/hub')
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📅 Cronograma</h1>
            <p className="text-gray-600 mt-1">{usuario.usuario && `Bem-vindo, ${usuario.usuario}`}</p>
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
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cronograma de Aulas
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              O cronograma está disponível internamente no HUB.
              Use o acesso abaixo para abrir a rota local.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mt-8">
              <a
                href="/cronograma-alunos"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Ir para Cronograma Alunos
              </a>
              <button
                onClick={handleVoltar}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Voltar ao HUB
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>ℹ️ Informação:</strong> Navegação atualizada para rota local do projeto,
                sem redirecionamento para domínio externo.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
