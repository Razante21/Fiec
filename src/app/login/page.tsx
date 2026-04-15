'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    try {
      if (!usuario || !senha) {
        setErro('Preencha todos os campos')
        setCarregando(false)
        return
      }

      // Chamada à API de autenticação
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, senha }),
      })

      const dados = await response.json()

      if (!response.ok) {
        setErro(dados.erro || 'Erro ao fazer login')
        setCarregando(false)
        return
      }

      // Salvar dados no localStorage
      localStorage.setItem('usuario', dados.usuario)
      localStorage.setItem('nivel', dados.nivel)
      localStorage.setItem('token', dados.token)
      
      // Redirecionar para hub
      router.push('/hub')
    } catch (err) {
      setErro('Erro ao fazer login. Tente novamente.')
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Inclusão Digital
            </h1>
            <p className="text-gray-600">
              Portal de Educação FIEC
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo Usuário */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Erro */}
            {erro && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
              >
                {erro}
              </motion.div>
            )}

            {/* Botão Login */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Botão Inscrições (sem login) */}
          <button
            onClick={() => router.push('/inscricao')}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition"
          >
            Ver Inscrições (Sem Login)
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Problemas para entrar? Contate o administrador.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
