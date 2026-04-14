'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface UsuarioAuth {
  usuario: string | null
  nivel: 'admin' | 'professor' | 'aluno' | null
  token: string | null
}

interface AuthContextType {
  usuario: UsuarioAuth
  login: (usuario: string, nivel: string, token?: string) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  carregando: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAuth>({
    usuario: null,
    nivel: null,
    token: null
  })
  const [carregando, setCarregando] = useState(true)

  // Carregar dados salvos no localStorage ao montar
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario')
    const nivelSalvo = localStorage.getItem('nivel')
    const tokenSalvo = localStorage.getItem('token')

    if (usuarioSalvo) {
      setUsuario({
        usuario: usuarioSalvo,
        nivel: (nivelSalvo as any) || null,
        token: tokenSalvo || null
      })
    }

    setCarregando(false)
  }, [])

  const login = (usuario: string, nivel: string, token?: string) => {
    const novoUsuario = {
      usuario,
      nivel: (nivel as any) || 'aluno',
      token: token || null
    }

    setUsuario(novoUsuario)
    localStorage.setItem('usuario', usuario)
    localStorage.setItem('nivel', nivel)
    if (token) {
      localStorage.setItem('token', token)
    }
  }

  const logout = () => {
    setUsuario({
      usuario: null,
      nivel: null,
      token: null
    })
    localStorage.removeItem('usuario')
    localStorage.removeItem('nivel')
    localStorage.removeItem('token')
  }

  const isAuthenticated = !!usuario.usuario
  const isAdmin = usuario.nivel === 'admin'

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        carregando
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
