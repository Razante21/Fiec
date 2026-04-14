'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Polo {
  id: number
  nome: string
  slug: string
  descricao: string
}

interface Turma {
  id: number
  polo_id: number
  modulo: string
  dias: string
  horario: string
  script_url: string | null
  vagas_total: number
  vagas_usadas: number
  liberado: number
  data_liberacao: string | null
  ativo: number
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [polos, setPolos] = useState<Polo[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [selectedPolo, setSelectedPolo] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [loginForm, setLoginForm] = useState({ usuario: '', senha: '' })
  const [showTurmaModal, setShowTurmaModal] = useState(false)
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
  const [turmaForm, setTurmaForm] = useState({
    modulo: '',
    dias: '',
    horario: '',
    script_url: '',
    vagas_total: 40,
  })
  const [showPoloModal, setShowPoloModal] = useState(false)
  const [poloForm, setPoloForm] = useState({ nome: '', slug: '', descricao: '' })
  const [appsScriptUrl, setAppsScriptUrl] = useState('')
  const [savingScriptUrl, setSavingScriptUrl] = useState(false)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('fiec_token')
    if (!token) {
      return {} as Record<string, string>
    }

    return { Authorization: `Bearer ${token}` }
  }

  useEffect(() => {
    let mounted = true

    const initializeAdmin = async () => {
      const token = localStorage.getItem('fiec_token')
      const nivel = localStorage.getItem('fiec_nivel')

      if (!token || nivel !== 'admin') {
        if (mounted) {
          setLoading(false)
        }
        return
      }

      setLoggedIn(true)

      try {
        await Promise.all([loadPolos(), loadAppsScriptConfig()])
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAdmin()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (selectedPolo) {
      loadTurmas(selectedPolo)
    }
  }, [selectedPolo])

  const loadPolos = async () => {
    try {
      console.log('Carregando polos...')
      const res = await fetch('/api/polos', {
        headers: getAuthHeaders(),
      })
      console.log('Resposta:', res.status)
      const data = await res.json()
      console.log('Data:', data)
      if (data.success) {
        setPolos(data.data)
        if (data.data.length > 0 && !selectedPolo) {
          setSelectedPolo(data.data[0].id)
        }
      } else {
        console.error('Erro da API:', data.error)
      }
    } catch (e) {
      console.error('Erro ao carregar polos:', e)
    }
  }

  const loadTurmas = async (poloId: number) => {
    try {
      const polo = polos.find(p => p.id === poloId)
      if (!polo) return
      const res = await fetch(`/api/turmas?polo=${polo.slug}`, {
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.success) {
        setTurmas(data.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('fiec_token', data.data.token || data.data.id)
        localStorage.setItem('fiec_usuario', data.data.usuario)
        localStorage.setItem('fiec_nivel', data.data.nivel)
        setLoggedIn(true)
        await Promise.all([loadPolos(), loadAppsScriptConfig()])
      } else {
        alert(data.error)
      }
    } catch (e) {
      alert('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('fiec_token')
    localStorage.removeItem('fiec_usuario')
    localStorage.removeItem('fiec_nivel')
    setLoggedIn(false)
    setLoading(false)
    setPolos([])
    setTurmas([])
  }

  const toggleLiberacao = async (turma: Turma) => {
    try {
      const res = await fetch('/api/admin/turmas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          action: 'liberar',
          id: turma.id,
          liberado: !turma.liberado,
          data_liberacao: !turma.liberado ? new Date().toISOString() : null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        loadTurmas(selectedPolo!)
      }
    } catch (e) {
      alert('Erro ao atualizar')
    }
  }

  const saveTurma = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTurma) {
        await fetch('/api/admin/turmas', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            id: editingTurma.id,
            modulo: turmaForm.modulo,
            dias: turmaForm.dias,
            horario: turmaForm.horario,
            script_url: turmaForm.script_url,
            ativo: true,
          }),
        })
      } else {
        await fetch('/api/admin/turmas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            polo_id: selectedPolo,
            ...turmaForm,
          }),
        })
      }
      setShowTurmaModal(false)
      setEditingTurma(null)
      setTurmaForm({ modulo: '', dias: '', horario: '', script_url: '', vagas_total: 40 })
      loadTurmas(selectedPolo!)
    } catch (e) {
      alert('Erro ao salvar')
    }
  }

  const savePolo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/admin/polos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(poloForm),
      })
      setShowPoloModal(false)
      setPoloForm({ nome: '', slug: '', descricao: '' })
      loadPolos()
    } catch (e) {
      alert('Erro ao criar polo')
    }
  }

  const loadAppsScriptConfig = async () => {
    try {
      const res = await fetch('/api/admin/config', {
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.success) {
        setAppsScriptUrl(data.data.appsScriptUrl || '')
      }
    } catch (e) {
      console.error('Erro ao carregar URL do Apps Script:', e)
    }
  }

  const saveAppsScriptConfig = async () => {
    try {
      setSavingScriptUrl(true)
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ appsScriptUrl }),
      })
      const data = await res.json()
      if (!data.success) {
        alert(data.error || 'Erro ao salvar URL')
        return
      }
      alert('URL do Apps Script atualizada com sucesso!')
    } catch (e) {
      alert('Erro ao salvar URL do Apps Script')
    } finally {
      setSavingScriptUrl(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1a26', color: '#fff' }}>
        Carregando...
      </div>
    )
  }

  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1a26' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#1e3a52',
            padding: '40px',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
            Admin FIEC
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuário"
              value={loginForm.usuario}
              onChange={e => setLoginForm({ ...loginForm, usuario: e.target.value })}
              style={{ width: '100%', padding: '14px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '1rem' }}
            />
            <input
              type="password"
              placeholder="Senha"
              value={loginForm.senha}
              onChange={e => setLoginForm({ ...loginForm, senha: e.target.value })}
              style={{ width: '100%', padding: '14px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '1rem' }}
            />
            <button
              type="submit"
              style={{ width: '100%', padding: '14px', background: '#f5a623', border: 'none', borderRadius: '8px', color: '#0d1a26', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Entrar
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1a26', padding: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff' }}>
          Painel Admin
        </h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#8fb3cc', cursor: 'pointer' }}>
          Sair
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        <aside>
          <div style={{ background: '#1e3a52', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.7rem', color: '#f5a623', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Polos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {polos.map(polo => (
                <button
                  key={polo.id}
                  onClick={() => setSelectedPolo(polo.id)}
                  style={{
                    padding: '10px 12px',
                    background: selectedPolo === polo.id ? 'rgba(245,166,35,0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: selectedPolo === polo.id ? '#f5a623' : '#8fb3cc',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  {polo.nome}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPoloModal(true)}
              style={{ marginTop: '12px', padding: '8px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '6px', color: '#8fb3cc', width: '100%', cursor: 'pointer' }}
            >
              + Novo Polo
            </button>
          </div>

          <button
            onClick={() => { setEditingTurma(null); setTurmaForm({ modulo: '', dias: '', horario: '', script_url: '', vagas_total: 40 }); setShowTurmaModal(true) }}
            style={{ width: '100%', padding: '14px', background: '#f5a623', border: 'none', borderRadius: '8px', color: '#0d1a26', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
          >
            + Nova Turma
          </button>

          <div style={{ marginTop: '16px', background: '#1e3a52', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.7rem', color: '#f5a623', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              URL Apps Script
            </h3>
            <input
              type="url"
              value={appsScriptUrl}
              onChange={e => setAppsScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              style={{ width: '100%', padding: '10px 12px', marginBottom: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem' }}
            />
            <button
              onClick={saveAppsScriptConfig}
              disabled={savingScriptUrl || !appsScriptUrl}
              style={{ width: '100%', padding: '10px 12px', background: '#4a9eca', border: 'none', borderRadius: '8px', color: '#0d1a26', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', cursor: savingScriptUrl ? 'wait' : 'pointer', opacity: savingScriptUrl || !appsScriptUrl ? 0.7 : 1 }}
            >
              {savingScriptUrl ? 'Salvando...' : 'Salvar URL'}
            </button>
          </div>
        </aside>

        <main>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            {polos.find(p => p.id === selectedPolo)?.nome || 'Selecione um polo'}
          </h2>

          {turmas.length === 0 ? (
            <p style={{ color: '#8fb3cc' }}>Nenhuma turma cadastrada</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {turmas.map(turma => (
                <motion.div
                  key={turma.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#1e3a52',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 100px 80px',
                    gap: '16px',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#f5a623', fontWeight: 700, textTransform: 'uppercase' }}>{turma.modulo}</span>
                    <p style={{ color: '#fff', fontSize: '0.9rem' }}>{turma.dias} - {turma.horario}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#8fb3cc' }}>Vagas</span>
                    <p style={{ color: '#fff' }}>{turma.vagas_usadas}/{turma.vagas_total}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#8fb3cc' }}>Liberação</span>
                    <p style={{ color: turma.liberado ? '#3dba7e' : '#e05c5c', fontWeight: 700 }}>
                      {turma.liberado ? 'Liberado' : 'Bloqueado'}
                    </p>
                    {turma.data_liberacao && (
                      <p style={{ fontSize: '0.7rem', color: '#8fb3cc' }}>
                        {new Date(turma.data_liberacao).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleLiberacao(turma)}
                    style={{
                      padding: '8px 12px',
                      background: turma.liberado ? '#e05c5c' : '#3dba7e',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {turma.liberado ? 'Bloquear' : 'Liberar'}
                  </button>
                  <button
                    onClick={() => { setEditingTurma(turma); setTurmaForm({ modulo: turma.modulo, dias: turma.dias, horario: turma.horario, script_url: turma.script_url || '', vagas_total: turma.vagas_total }); setShowTurmaModal(true) }}
                    style={{ padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#8fb3cc', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showTurmaModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: '#1e3a52', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}
          >
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>{editingTurma ? 'Editar' : 'Nova'} Turma</h3>
            <form onSubmit={saveTurma}>
              <input
                type="text"
                placeholder="Módulo"
                value={turmaForm.modulo}
                onChange={e => setTurmaForm({ ...turmaForm, modulo: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
              <input
                type="text"
                placeholder="Dias (ex: 2ª e 4ª-feira)"
                value={turmaForm.dias}
                onChange={e => setTurmaForm({ ...turmaForm, dias: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
              <input
                type="text"
                placeholder="Horário (ex: 08h às 10h)"
                value={turmaForm.horario}
                onChange={e => setTurmaForm({ ...turmaForm, horario: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
              <input
                type="url"
                placeholder="URL do Apps Script da turma"
                value={turmaForm.script_url}
                onChange={e => setTurmaForm({ ...turmaForm, script_url: e.target.value })}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
              <input
                type="number"
                placeholder="Vagas totais"
                value={turmaForm.vagas_total}
                onChange={e => setTurmaForm({ ...turmaForm, vagas_total: parseInt(e.target.value) })}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowTurmaModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#8fb3cc', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#f5a623', border: 'none', borderRadius: '8px', color: '#0d1a26', fontWeight: 700, cursor: 'pointer' }}>
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showPoloModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: '#1e3a52', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}
          >
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Novo Polo</h3>
            <form onSubmit={savePolo}>
              <input
                type="text"
                placeholder="Nome"
                value={poloForm.nome}
                onChange={e => setPoloForm({ ...poloForm, nome: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
              <input
                type="text"
                placeholder="Slug (URL)"
                value={poloForm.slug}
                onChange={e => setPoloForm({ ...poloForm, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
              <input
                type="text"
                placeholder="Descrição"
                value={poloForm.descricao}
                onChange={e => setPoloForm({ ...poloForm, descricao: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowPoloModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#8fb3cc', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#f5a623', border: 'none', borderRadius: '8px', color: '#0d1a26', fontWeight: 700, cursor: 'pointer' }}>
                  Criar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}