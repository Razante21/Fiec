'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  polo: string
  modulo: string
  dias: string
  horario: string
  scriptUrl?: string
  listaEsperaOnly?: boolean
  listaEsperaTurmas?: string[]
}

export function FormModal({ isOpen, onClose, polo, modulo, dias, horario, scriptUrl, listaEsperaOnly, listaEsperaTurmas }: FormModalProps) {
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [showNormas, setShowNormas] = useState(false)
  const [vagasRestantes, setVagasRestantes] = useState<number>(-1)
  const [isListaEspera, setIsListaEspera] = useState(listaEsperaOnly || false)
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    telefone: '',
    endereco: '',
    cep: '',
    email: '',
    termo1: false,
    termo2: false,
    termo3: false,
    termo4: false,
  })
  const defaultTurmas = [
    { value: 'FIEC: Básico - 3ª e 5ª - 08h às 10h', label: 'POLO FIEC: Básico - 3ª e 5ª - 08h às 10h' },
    { value: 'FIEC: Básico - 2ª e 4ª - 16h às 18h', label: 'POLO FIEC: Básico - 2ª e 4ª - 16h às 18h' },
    { value: 'FIEC: Básico - 2ª e 4ª - 19h às 21h', label: 'POLO FIEC: Básico - 2ª e 4ª - 19h às 21h' },
    { value: 'FIEC: Intermediário - 2ª e 4ª - 10h às 12h', label: 'POLO FIEC: Intermediário - 2ª e 4ª - 10h às 12h' },
    { value: 'FIEC: Intermediário - 2ª e 4ª - 14h às 16h', label: 'POLO FIEC: Intermediário - 2ª e 4ª - 14h às 16h' },
    { value: 'FIEC: Avançado - 2ª e 4ª - 08h às 10h', label: 'POLO FIEC: Avançado - 2ª e 4ª - 08h às 10h' },
    { value: 'FIEC: Avançado - 3ª e 5ª - 14h às 16h', label: 'POLO FIEC: Avançado - 3ª e 5ª - 14h às 16h' },
    { value: 'CEU: Básico - 3ª e 5ª - 14h às 16h', label: 'POLO CEU: Básico - 3ª e 5ª - 14h às 16h' },
    { value: 'CASA DA PROVIDÊNCIA: Intermediário - 2ª e 4ª - 09h30 às 11h30', label: 'POLO CASA DA PROVIDÊNCIA: Intermediário - 2ª e 4ª - 09h30 às 11h30' },
    { value: 'SOL-SOL: Avançado - 3ª e 5ª - 09h30 às 11h30', label: 'POLO SOL-SOL: Avançado - 3ª e 5ª - 09h30 às 11h30' },
    { value: 'JD BRASIL: Intermediário - 2ª e 4ª - 15h30 às 17h30', label: 'POLO JD BRASIL: Intermediário - 2ª e 4ª - 15h30 às 17h30' },
    { value: 'COMUNIDADE INDEPENDENTE: Intermediário - 3ª e 5ª - 14h às 16h', label: 'POLO COMUNIDADE INDEPENDENTE: Intermediário - 3ª e 5ª - 14h às 16h' },
  ]

  const turmas = listaEsperaTurmas || defaultTurmas.map(t => t.value)

  const [formLista, setFormLista] = useState({
    turma: '',
    nome: '',
    telefone: '',
    email: '',
  })

  useEffect(() => {
    setIsListaEspera(listaEsperaOnly || false)
    setEnviado(false)
    setFormLista({ turma: '', nome: '', telefone: '', email: '' })
  }, [isOpen, listaEsperaOnly])

  useEffect(() => {
    if (scriptUrl && isOpen && !listaEsperaOnly) {
      fetch(scriptUrl)
        .then(res => res.json())
        .then(data => {
          setVagasRestantes(data.vagas ?? -1)
          setIsListaEspera(data.vagas === 0)
        })
        .catch(() => setVagasRestantes(-1))
    }
  }, [scriptUrl, isOpen, listaEsperaOnly])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isListaEspera) {
      // Enviar para lista de espera
      setEnviando(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEnviando(false)
      setEnviado(true)
      return
    }
    
    setEnviando(true)

    if (scriptUrl) {
      try {
        const res = await fetch(scriptUrl, {
          method: 'POST',
          body: JSON.stringify({
            ...formData,
            poloid: polo,
            modulo,
            dias,
            horario,
          }),
        })
        const data = await res.json()
        if (!data.success) {
          alert(data.error || 'Erro ao enviar')
          setEnviando(false)
          return
        }
      } catch (err) {
        console.error(err)
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    setEnviando(false)
    setEnviado(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(13, 26, 38, 0.9)',
              backdropFilter: 'blur(8px)',
              zIndex: 9998,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              marginTop: '-45vh',
              marginLeft: '-240px',
              width: '480px',
              maxWidth: '92vw',
              maxHeight: '85vh',
              height: 'auto',
              background: 'linear-gradient(180deg, #162a3d 0%, #0d1a26 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(245, 166, 35, 0.3)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(245, 166, 35, 0.1)',
              overflow: 'hidden',
              zIndex: 9999,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                padding: '24px 24px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#fff',
                    marginBottom: '4px',
                  }}
                >
                  {listaEsperaOnly ? 'Lista de Espera' : polo}
                </motion.h2>
                {!listaEsperaOnly && (
                  <>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      style={{ fontSize: '0.8rem', color: '#f5a623', fontWeight: 600 }}
                    >
                      {modulo}
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{ fontSize: '0.75rem', color: '#8fb3cc', marginTop: '2px' }}
                    >
                      {dias} · {horario}
                    </motion.p>
                  </>
                )}
                {vagasRestantes >= 0 && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    style={{ 
                      fontSize: '0.7rem', 
                      color: vagasRestantes <= 5 ? '#e05c5c' : '#3dba7e', 
                      fontWeight: 700,
                      marginTop: '4px'
                    }}
                  >
                    {vagasRestantes === 0 ? '❌ VAGAS ESGOTADAS' : `✓ ${vagasRestantes} vagas restantes`}
                  </motion.p>
                  )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#8fb3cc',
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </motion.button>
            </motion.div>

            <div style={{
              padding: '20px 24px 24px',
              overflowY: 'auto',
              maxHeight: 'calc(85vh - 100px)',
            }}>
              {enviado ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  style={{ textAlign: 'center', padding: '40px 20px' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3dba7e 0%, #2ea36b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      boxShadow: '0 10px 30px rgba(61, 186, 126, 0.4)',
                    }}
                  >
                    <Check size={40} color="#fff" strokeWidth={3} />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: '#fff',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {isListaEspera ? 'Inscrição na Lista de Espera Enviada!' : 'Inscrição Enviada!'}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ color: '#8fb3cc', fontSize: '0.9rem' }}
                  >
                    {isListaEspera 
                      ? 'Você receberá um e-mail quando houver vagas disponíveis.' 
                      : 'Você receberá um e-mail de confirmação em breve.'}
                  </motion.p>
                </motion.div>
              ) : isListaEspera ? (
                <form onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{ marginBottom: '14px' }}
                  >
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                      Qual turma da Inclusão e Educação Digital em lista de espera você tem interesse? *
                    </label>
                    <select
                      required
                      value={formLista.turma}
                      onChange={e => setFormLista({...formLista, turma: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    >
                      <option value="" style={{ color: '#888' }}>Selecione uma turma</option>
                      {turmas.map(turma => (
                        <option key={turma} value={turma}>{turma}</option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ marginBottom: '14px' }}
                  >
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                      Nome Completo *
                    </label>
                    <motion.input
                      whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                      type="text"
                      required
                      value={formLista.nome}
                      onChange={e => setFormLista({...formLista, nome: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                      placeholder="Seu nome completo"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{ marginBottom: '14px' }}
                  >
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                      Telefone (somente números) *
                    </label>
                    <motion.input
                      whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                      type="tel"
                      required
                      maxLength={11}
                      value={formLista.telefone}
                      onChange={e => setFormLista({...formLista, telefone: e.target.value.replace(/\D/g, '')})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder="11999999999"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ marginBottom: '20px' }}
                  >
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                      E-mail *
                    </label>
                    <motion.input
                      whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                      type="email"
                      required
                      value={formLista.email}
                      onChange={e => setFormLista({...formLista, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder="seu@email.com"
                    />
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(245, 166, 35, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={enviando}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #f5a623 0%, #e09510 100%)',
                      color: '#0d1a26',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: enviando ? 'not-allowed' : 'pointer',
                      opacity: enviando ? 0.7 : 1,
                      boxShadow: '0 4px 15px rgba(245, 166, 35, 0.3)',
                    }}
                  >
                    {enviando ? 'Enviando...' : 'Entrar na Lista de Espera'}
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{ marginBottom: '14px' }}
                  >
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                      Nome Completo *
                    </label>
                    <motion.input
                      whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                      type="text"
                      required
                      value={formData.nome}
                      onChange={e => setFormData({...formData, nome: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      placeholder="Seu nome completo"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                        Data de Nascimento *
                      </label>
                      <motion.input
                        whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                        type="date"
                        required
                        value={formData.dataNascimento}
                        onChange={e => setFormData({...formData, dataNascimento: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                        CPF *
                      </label>
                      <motion.input
                        whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                        type="text"
                        required
                        maxLength={11}
                        value={formData.cpf}
                        onChange={e => setFormData({...formData, cpf: e.target.value.replace(/\D/g, '')})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                        placeholder="00000000000"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                        Telefone *
                      </label>
                      <motion.input
                        whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                        type="tel"
                        required
                        maxLength={11}
                        value={formData.telefone}
                        onChange={e => setFormData({...formData, telefone: e.target.value.replace(/\D/g, '')})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                        placeholder="11999999999"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                        CEP *
                      </label>
                      <motion.input
                        whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                        type="text"
                        required
                        maxLength={8}
                        value={formData.cep}
                        onChange={e => setFormData({...formData, cep: e.target.value.replace(/\D/g, '')})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                        placeholder="00000000"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ marginBottom: '14px' }}
                  >
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                      Endereço *
                    </label>
                    <motion.input
                      whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                      type="text"
                      required
                      value={formData.endereco}
                      onChange={e => setFormData({...formData, endereco: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder="Rua, número, bairro"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    style={{ marginBottom: '18px' }}
                  >
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b2c1', marginBottom: '6px', fontWeight: 600 }}>
                      E-mail *
                    </label>
                    <motion.input
                      whileFocus={{ borderColor: '#f5a623', boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)' }}
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder="seu@email.com"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38 }}
                    style={{ marginBottom: '14px' }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowNormas(!showNormas)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#f5a623',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0,
                      }}
                    >
                      {showNormas ? '▼' : '▶'} Ler as Normas Regimentais
                    </button>
                    
                    {showNormas && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          marginTop: '10px',
                          padding: '14px',
                          background: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }}
                      >
                        <p style={{ fontSize: '0.7rem', color: '#a0b2c1', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
{`PROGRAMA DE EDUCAÇÃO DIGITAL - NORMAS INTERNAS – CORPO DISCENTE

II SEMESTRE 2026

Início das aulas:
Dia 03/08/26 - Turmas de 2ª e 4ª feiras
Dia 04/08/26 - Turmas de 3ª e 5ª Feiras

Horário dos cursos: o aluno deverá seguir o cronograma de aulas, conforme o polo em que está matriculado.

1. O aluno deverá manter suas informações atualizadas para necessidade de contato (e-mail, telefone e endereço).

2. O aluno que não frequentar a primeira semana de aula, sem justificativa por escrito, será considerado aluno evadido e sua vaga será oferecida aos candidatos em lista de espera, seguindo a ordem de inscrição.

3. O aluno deverá respeitar o horário de início e término das aulas.

4. Os alunos, maiores de 18 anos, poderão, quando apresentarem um motivo justo, solicitar saída antes do término do período das aulas; os alunos, menores de 18 anos, só poderão se retirar do estabelecimento durante o período entre as aulas, com autorização expressa dos pais ou responsáveis.

5. Poderá haver junção de turmas de mesmo módulo considerando o número de alunos evadidos e desistentes.

6. O aluno que não concluir o módulo básico não pode ingressar no intermediário, e o que não concluir o módulo intermediário, não poderá ingressar no avançado, salvo se possuir conhecimento e atender os pré-requisitos exigidos.

7. O aluno matriculado que desistir do curso não terá assegurada sua vaga para a próxima oferta.

8. O aluno, se precisar, poderá pedir remanejamento de polo e/ou horário (transferência), junto à coordenação do Programa na FIEC, desde que haja vaga.

9. Qualquer aluno matriculado, ou seu representante legal, que se considerar prejudicado no transcorrer do curso, deverá procurar protocolar requerimento junto à coordenação do programa.

10. Ao término de cada módulo o aluno deverá manifestar seu interesse em continuar no curso, bem como fazer a rematrícula para o próximo módulo, de forma a garantir sua vaga, caso contrário, sua vaga poderá ser disponibilizada ao próximo inscrito da lista.

11. A FIEC não se responsabiliza por objetos deixados em suas dependências (celulares, carteiras, bicicletas, etc.).

IMPORTANTE:
- É condição obrigatória a frequência ao curso para o cumprimento da carga horária curricular (mínimo de 75% do total das horas letivas);
- Não é permitido o uso de qualquer aparelho eletrônico em sala de aula, exceto os autorizados para a aprendizagem do aluno;
- É vedado ao aluno fumar no recinto da escola, nos termos da legislação pertinente;
- É vedado ao aluno ocupar-se, durante as atividades escolares, de qualquer ação alheia ao desenvolvimento de sua aprendizagem;
- É proibido ao aluno comer e beber em sala de aula;
- É dever do aluno colaborar na conservação e higiene do prédio, do mobiliário e de todo material de uso coletivo;
- Serão observadas as medidas relativas à proteção de dados pessoais, conforme Lei 13.709/2018 (LGPD).`}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', marginBottom: '20px' }}
                  >
                    {[
                      { key: 'termo1', text: 'Eu entendo que participação no curso é pessoal e intransferível.' },
                      { key: 'termo2', text: 'Eu concordo que a FIEC poderá indeferir a inscrição em novos cursos para quem não comparecer.' },
                      { key: 'termo3', text: 'Autorizo o compartilhamento dos meus dados pessoais com a FIEC.' },
                      { key: 'termo4', text: 'Estou ciente das Normas Regimentais do CEPIN/FIEC.' },
                    ].map((termo, i) => (
                      <motion.label
                        key={termo.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 + i * 0.05 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}
                      >
                        <motion.input
                          whileTap={{ scale: 0.9 }}
                          type="checkbox"
                          required
                          checked={formData[termo.key as keyof typeof formData] as boolean}
                          onChange={e => setFormData({...formData, [termo.key]: e.target.checked})}
                          style={{ marginTop: '3px', accentColor: '#f5a623', width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '0.72rem', color: '#8fb3cc', lineHeight: 1.4 }}>
                          {termo.text}
                        </span>
                      </motion.label>
                    ))}
                  </motion.div>

                  <motion.button
                    whileHover={vagasRestantes === 0 ? {} : { scale: 1.02, boxShadow: '0 8px 25px rgba(245, 166, 35, 0.4)' }}
                    whileTap={vagasRestantes === 0 ? {} : { scale: 0.98 }}
                    type="submit"
                    disabled={enviando || vagasRestantes === 0}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: vagasRestantes === 0 
                        ? 'linear-gradient(135deg, #666 0%, #444 100%)' 
                        : 'linear-gradient(135deg, #f5a623 0%, #e09510 100%)',
                      color: '#0d1a26',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: enviando || vagasRestantes === 0 ? 'not-allowed' : 'pointer',
                      opacity: enviando || vagasRestantes === 0 ? 0.7 : 1,
                      boxShadow: '0 4px 15px rgba(245, 166, 35, 0.3)',
                    }}
                  >
                    {enviando ? (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        Enviando...
                      </motion.span>
                    ) : vagasRestantes === 0 ? 'Vagas Esgotadas' : 'Enviar Inscrição'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}