'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  polo: string
  modulo: string
  dias: string
  horario: string
  scriptUrl?: string
}

export function FormModal({ isOpen, onClose, polo, modulo, dias, horario, scriptUrl }: FormModalProps) {
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
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    // Simular envio (aqui você vai conectar com seu Apps Script)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setEnviando(false)
    setEnviado(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 50,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              background: '#162a3d',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              zIndex: 51,
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: '4px',
                }}>
                  {polo}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#a0b2c1' }}>
                  {modulo} · {dias} · {horario}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a0b2c1',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              maxHeight: 'calc(90vh - 80px)',
            }}>
              {enviado ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#3dba7e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <span style={{ fontSize: '30px', color: '#fff' }}>✓</span>
                  </div>
                  <h3 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '10px',
                  }}>
                    Inscrição Enviada!
                  </h3>
                  <p style={{ color: '#a0b2c1', fontSize: '0.9rem' }}>
                    Você receberá um e-mail de confirmação.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0b2c1', marginBottom: '6px' }}>
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={e => setFormData({...formData, nome: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#0d1a26',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.95rem',
                      }}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0b2c1', marginBottom: '6px' }}>
                        Data de Nascimento *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dataNascimento}
                        onChange={e => setFormData({...formData, dataNascimento: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: '#0d1a26',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.95rem',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0b2c1', marginBottom: '6px' }}>
                        CPF (somente números) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={11}
                        value={formData.cpf}
                        onChange={e => setFormData({...formData, cpf: e.target.value.replace(/\D/g, '')})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: '#0d1a26',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.95rem',
                        }}
                        placeholder="00000000000"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0b2c1', marginBottom: '6px' }}>
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={11}
                        value={formData.telefone}
                        onChange={e => setFormData({...formData, telefone: e.target.value.replace(/\D/g, '')})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: '#0d1a26',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.95rem',
                        }}
                        placeholder="11999999999"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0b2c1', marginBottom: '6px' }}>
                        CEP *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={8}
                        value={formData.cep}
                        onChange={e => setFormData({...formData, cep: e.target.value.replace(/\D/g, '')})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: '#0d1a26',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.95rem',
                        }}
                        placeholder="00000000"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0b2c1', marginBottom: '6px' }}>
                      Endereço *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.endereco}
                      onChange={e => setFormData({...formData, endereco: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#0d1a26',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.95rem',
                      }}
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0b2c1', marginBottom: '6px' }}>
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#0d1a26',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.95rem',
                      }}
                      placeholder="seu@email.com"
                    />
                  </div>

                  {/* Termos */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        required
                        checked={formData.termo1}
                        onChange={e => setFormData({...formData, termo1: e.target.checked})}
                        style={{ marginTop: '4px', accentColor: '#f5a623' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#a0b2c1', lineHeight: 1.4 }}>
                        Eu entendo que participação no curso é pessoal e intransferível. O inscrito é responsável, civil e criminalmente, pelo uso indevido do link, login e senha que lhe foram fornecidos.
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        required
                        checked={formData.termo2}
                        onChange={e => setFormData({...formData, termo2: e.target.checked})}
                        style={{ marginTop: '4px', accentColor: '#f5a623' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#a0b2c1', lineHeight: 1.4 }}>
                        Eu entendo e concordo que a FIEC poderá indeferir a inscrição em novos cursos e eventos daquele que deixar de comparecer, sem justificativa, pelo prazo de 1 ano.
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        required
                        checked={formData.termo3}
                        onChange={e => setFormData({...formData, termo3: e.target.checked})}
                        style={{ marginTop: '4px', accentColor: '#f5a623' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#a0b2c1', lineHeight: 1.4 }}>
                        Autorizo o compartilhamento dos meus dados pessoais com a FIEC para receber informações sobre eventos e conteúdos relacionados a educação e tecnologia.
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        required
                        checked={formData.termo4}
                        onChange={e => setFormData({...formData, termo4: e.target.checked})}
                        style={{ marginTop: '4px', accentColor: '#f5a623' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#a0b2c1', lineHeight: 1.4 }}>
                        Firmo a presente matrícula e declaro estar ciente das Normas Regimentais do Centro de Educação Profissional de Indaiatuba - CEPIN/FIEC.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#f5a623',
                      color: '#0d1a26',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      cursor: enviando ? 'not-allowed' : 'pointer',
                      opacity: enviando ? 0.7 : 1,
                    }}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Inscrição'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}