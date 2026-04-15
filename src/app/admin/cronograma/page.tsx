'use client'

import { useRouter } from 'next/navigation'
import { useCurrentUser, useProtectedRoute } from '@/lib/auth-hooks'

export default function AdminCronogramaPage() {
  const router = useRouter()
  const { isReady } = useProtectedRoute(true, true)
  const usuario = useCurrentUser()

  const handleVoltar = () => {
    router.push('/hub')
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Admin Cronograma</h1>
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
          {/* Card: Aulas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Aulas</h3>
            <p className="text-gray-600 mb-4">Criar e gerenciar aulas</p>
            <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              Gerenciar
            </button>
          </div>

          {/* Card: Exercícios */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">✏️ Exercícios</h3>
            <p className="text-gray-600 mb-4">Upload e gerenciamento de exercícios</p>
            <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              Gerenciar
            </button>
          </div>

          {/* Card: Slides */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Slides</h3>
            <p className="text-gray-600 mb-4">Upload e liberação de apresentações</p>
            <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              Gerenciar
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Painel de Administração - Cronograma
          </h2>
          <p className="text-gray-600 mb-4">
            Administre o cronograma de aulas e materiais didáticos:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Criar e editar aulas</li>
            <li>Fazer upload de exercícios, slides e correções</li>
            <li>Controlar a liberação de materiais</li>
            <li>Acompanhar o progresso dos alunos</li>
            <li>Gerenciar prazos e entregas</li>
          </ul>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Atenção:</strong> O painel será totalmente integrado com a plataforma 
              de cronograma-alunos nos próximos passos.
            </p>
          </div>

          {/* Acesso Rápido */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Acesso Rápido
            </h3>
            <a
              href="/cronograma-alunos/admin"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
            >
              Ir para Painel Cronograma Alunos →
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
