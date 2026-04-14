import { useAuth } from './auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Hook para verificar autenticação e redirecionar se necessário
 * @param requireAuth - Se true, redireciona para /login se não autenticado
 * @param requireAdmin - Se true, redireciona para /hub se não for admin
 */
export function useProtectedRoute(requireAuth = true, requireAdmin = false) {
  const { isAuthenticated, isAdmin, carregando } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (carregando) return

    if (requireAuth && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (requireAdmin && !isAdmin) {
      router.push('/hub')
      return
    }
  }, [carregando, isAuthenticated, isAdmin, requireAuth, requireAdmin, router])

  return {
    isReady: !carregando,
    isAuthenticated,
    isAdmin
  }
}

/**
 * Hook para obter dados do usuário autenticado
 */
export function useCurrentUser() {
  const { usuario } = useAuth()
  return usuario
}

/**
 * Hook para gerenciar login/logout
 */
export function useAuthActions() {
  const { login, logout } = useAuth()
  const router = useRouter()
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  const handleLogin = async (usuario: string, senha: string) => {
    setCarregando(true)
    setErro(null)

    try {
      // TODO: Integrar com API real de autenticação
      // Por enquanto, validação básica
      if (!usuario || !senha) {
        setErro('Preencha todos os campos')
        return
      }

      // Simulação: checar se é admin
      const nivel = usuario === 'admin' ? 'admin' : 'aluno'
      
      // Fazer login
      login(usuario, nivel)

      // Redirecionar
      router.push('/hub')
    } catch (err) {
      setErro('Erro ao fazer login. Tente novamente.')
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return {
    handleLogin,
    handleLogout,
    erro,
    carregando
  }
}
