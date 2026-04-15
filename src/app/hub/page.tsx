'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthActions, useCurrentUser, useProtectedRoute } from '@/lib/auth-hooks'

interface PageCard {
  id: string
  titulo: string
  descricao: string
  icon: string
  href: string
  requiresLogin: boolean
  adminOnly: boolean
  cor: string
}

const pages: PageCard[] = [
  {
    id: 'inscricoes',
    titulo: '📝 Inscrições',
    descricao: 'Escolha um polo e uma turma para se inscrever',
    icon: '📝',
    href: '/inscricao',
    requiresLogin: false,
    adminOnly: false,
    cor: 'from-blue-500 to-blue-600'
  },
  {
    id: 'cronograma',
    titulo: '📅 Cronograma',
    descricao: 'Acompanhe as aulas e entregue seus exercícios',
    icon: '📅',
    href: '/cronograma-alunos',
    requiresLogin: true,
    adminOnly: false,
    cor: 'from-green-500 to-green-600'
  },
  {
    id: 'cronograma-estagiarios',
    titulo: '🧑‍🏫 Cronograma Estagiários',
    descricao: 'Área de professores/estagiários para montar e liberar aulas',
    icon: '🧑‍🏫',
    href: '/cronograma-estagiarios',
    requiresLogin: true,
    adminOnly: false,
    cor: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'admin-inscricoes',
    titulo: '⚙️ Admin Inscrições',
    descricao: 'Gerenciar polos, turmas e vagas',
    icon: '⚙️',
    href: '/inscricoes/admin',
    requiresLogin: true,
    adminOnly: true,
    cor: 'from-purple-500 to-purple-600'
  },
  {
    id: 'admin-cronograma',
    titulo: '⚙️ Admin Cronograma',
    descricao: 'Gerenciar aulas, exercícios e slides',
    icon: '⚙️',
    href: '/cronograma-alunos/admin',
    requiresLogin: true,
    adminOnly: true,
    cor: 'from-orange-500 to-orange-600'
  },
  {
    id: 'admin-cronograma-estagiarios',
    titulo: '⚙️ Admin Cronograma Estagiários',
    descricao: 'Painel administrativo compartilhado de turmas e professores',
    icon: '🛠️',
    href: '/cronograma-estagiarios/admin',
    requiresLogin: true,
    adminOnly: true,
    cor: 'from-amber-500 to-amber-600'
  },
]

export default function HubPage() {
  const router = useRouter()
  const { isReady, isAuthenticated, isAdmin } = useProtectedRoute(false, false)
  const usuario = useCurrentUser()
  const { handleLogout } = useAuthActions()

  const handlePageClick = (page: PageCard) => {
    if (page.requiresLogin && !isAuthenticated) {
      router.push('/login')
      return
    }
    router.push(page.href)
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    )
  }

  // Filtrar páginas que o usuário pode ver
  const paginasVisiveis = pages.filter(page => {
    if (page.adminOnly && !isAdmin) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Inclusão Digital Hub
              </h1>
              <p className="text-gray-600 mt-1">
                {usuario.usuario
                  ? `Bem-vindo, ${usuario.usuario}${isAdmin ? ' (Administrador)' : ''}`
                  : 'Acesso público ao hub. Faça login para áreas restritas.'}
              </p>
            </div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Sair
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginasVisiveis.map((page, index) => (
            <motion.button
              key={page.id}
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handlePageClick(page)}
              className="block text-left"
            >
              <div className={`h-full bg-gradient-to-br ${page.cor} rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition p-8 cursor-pointer text-white`}>
                <div className="text-4xl mb-4">{page.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{page.titulo}</h2>
                <p className="text-white/90 mb-4">{page.descricao}</p>
                {page.requiresLogin && !isAuthenticated && (
                  <div className="text-sm text-white/70 italic">
                    Requer login
                  </div>
                )}
                <div className="mt-6 font-semibold flex items-center gap-2">
                  Acessar
                  <span>→</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info Message */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ℹ️ Informações
          </h3>
          <p className="text-gray-600">
            Este Hub conecta dois projetos completos: Inscrições e Cronograma. 
            Inscrições ficam abertas ao público e os cronogramas (alunos/estagiários) compartilham autenticação e dados.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
