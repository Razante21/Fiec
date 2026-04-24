'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FormModal } from '@/components/ui/form-modal'
import { fetchTurmas, fetchVagas, getMasterUrl } from '@/lib/turmas'

const VAGAS_TOTAL = 40

interface ModuloData {
  id: string
  tag: string
  dias: string
  horario: string
  formUrl: string
  scriptUrl: string
  vagas: number
  esgotado: boolean
  liberado?: boolean
  dataLiberacao?: string | null
}

export default function PoloBemViver() {
  const [modulos, setModulos] = useState<ModuloData[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedModulo, setSelectedModulo] = useState<ModuloData | null>(null)
  const [listaEsperaModalOpen, setListaEsperaModalOpen] = useState(false)

  useEffect(() => {
    const loadTurmas = async () => {
      setLoading(true)
      const turmas = await fetchTurmas('Bem Viver')
      const turmasIniciais = turmas.map((t, index) => ({ ...t, vagas: -1, esgotado: false }))
      setModulos(turmasIniciais)
      setLoading(false)
      
      turmas.forEach(async (t, index) => {
        if (t.scriptUrl) {
          try {
            const vagas = await fetchVagas(t.scriptUrl)
            if (vagas >= 0) {
              setModulos(prev => prev.map((mod, i) => 
                i === index ? { ...mod, vagas, esgotado: vagas === 0 } : mod
              ))
            }
          } catch (e) {}
        }
      })
    }
    loadTurmas()
  }, [])

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }

  return (
    <main className="min-h-screen">
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ background: 'radial-gradient(ellipse 60% 60% at 8% 20%, rgba(245,166,35,.10) 0%, transparent 60%), linear-gradient(175deg, #091520 0%, #0d1a26 100%)', padding: '32px 24px 44px', textAlign: 'center', position: 'relative', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8fb3cc', textDecoration: 'none', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '22px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6" /></svg>Todos os polos
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} style={{ display: 'inline-block', background: '#f5a623', color: '#0d1a26', fontSize: '0.62rem', fontWeight: 800, padding: '3px 12px', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
          Acima de 60 anos
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2.2rem, 7vw, 3.8rem)', textTransform: 'uppercase', margin: 0 }}>
          Polo Bem Viver
        </motion.h1>

        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'block', fontSize: '0.82rem', color: '#8fb3cc', marginTop: '8px' }}>
          Espaço Bem Viver Mário Jacinto da Silva
        </motion.span>
      </motion.header>

      <div className="polo-grid" style={{ maxWidth: '1040px', margin: '44px auto', padding: '0 24px' }}>
        <aside className="polo-aside" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ background: '#1e3a52', borderRadius: '12px', border: '1px solid rgba(255,255,255,.07)', overflow: 'hidden' }}>
            <div style={{ background: '#162a3d', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.07)' }}><span style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#f5a623', fontWeight: 700 }}>Endereço</span></div>
            <div style={{ padding: '18px' }}><h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Bem Viver</h2><p style={{ color: '#8fb3cc', fontSize: '0.85rem' }}>Av. Eng. Fábio Roberto Barnabé, 585<br />Vila Teller</p></div>
          </motion.div>
          <motion.button onClick={() => setListaEsperaModalOpen(true)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} whileHover={{ background: '#4a9eca', color: '#0d1a26' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: '1.5px solid #4a9eca', color: '#4a9eca', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', padding: '11px 16px', borderRadius: '10px', cursor: 'pointer' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>Lista de Espera</motion.button>
        </aside>

        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {/* Datas importantes */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ 
              background: 'linear-gradient(135deg, rgba(245,166,35,0.15) 0%, rgba(245,166,35,0.05) 100%)',
              border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#f5a623', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Inscrição</p>
                <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Presencial 30/06</p>
                <p style={{ fontSize: '0.75rem', color: '#8fb3cc' }}>Das 09h às 12h</p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#3dba7e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Início das aulas</p>
                <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>2ª e 4ª: 03/08</p>
                <p style={{ fontSize: '0.75rem', color: '#8fb3cc' }}>3ª e 5ª: 04/08</p>
              </div>
            </div>
          </motion.div>

          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem,5vw,2.6rem)', textTransform: 'uppercase', marginBottom: '24px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>Inscrições <span style={{ color: '#f5a623' }}>2026</span></h2>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', background: 'rgba(245,166,35,.08)', border: '1.5px solid rgba(245,166,35,.35)', borderLeft: '4px solid #f5a623', borderRadius: '10px', padding: '18px 20px', marginBottom: '28px' }}>
            <div style={{ flexShrink: 0, width: '36px', height: '36px', background: 'rgba(245,166,35,.12)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5a623' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f5a623' }}>Inscrições somente presenciais</span>
              <span style={{ fontSize: '0.85rem', color: '#8fb3cc', lineHeight: 1.5 }}>Compareça ao polo no dia <strong style={{ color: 'white', fontWeight: 600 }}>30/06/2026</strong>, das <strong style={{ color: 'white', fontWeight: 600 }}>09h às 12h</strong></span>
            </div>
          </motion.div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#8fb3cc' }}>Carregando turmas...</div>
          ) : modulos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#8fb3cc' }}>Nenhuma turma disponível no momento.</div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {modulos.map((moduloName, idx) => (
                <div key={moduloName.tag} style={{ marginBottom: '28px' }}>
                  <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8fb3cc', whiteSpace: 'nowrap' }}>{moduloName.tag}</h4><div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.07)' }} /></motion.div>
                  {moduloName.tag.toLowerCase().includes('intermediário') && (
                    <motion.div variants={itemVariants} style={{ background: 'rgba(61,186,126,.06)', border: '1px solid rgba(61,186,126,.18)', borderLeft: '3px solid #3dba7e', padding: '14px 16px', borderRadius: '8px', fontSize: '0.82rem', lineHeight: 1.6, color: '#8fb3cc', marginBottom: '18px' }}><strong style={{ color: '#3dba7e' }}>Pré-requisito para esta turma:</strong><br />É necessário ter concluído o módulo básico do curso de inclusão digital da FIEC ou ter conhecimentos básicos de informática e computação.</motion.div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}><ModuloCard key={moduloName.id} modulo={moduloName} index={idx} onClick={() => { setSelectedModulo(moduloName); setModalOpen(true) }} /></div>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ marginTop: '36px', padding: '24px 22px', background: '#162a3d', borderRadius: '12px', border: '1px solid rgba(255,255,255,.07)', textAlign: 'center' }}><p style={{ fontSize: '0.82rem', color: '#8fb3cc', marginBottom: '14px' }}>Não encontrou vaga na turma desejada? Entre na lista de espera e entraremos em contato assim que uma vaga for liberada.</p><button onClick={() => setListaEsperaModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'transparent', border: '1.5px solid #4a9eca', color: '#4a9eca', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', padding: '9px 22px', borderRadius: '6px', cursor: 'pointer' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>Entrar na Lista de Espera</button></motion.div>
        </motion.main>
      </div>

      <footer style={{ padding: '32px 24px', textAlign: 'center', color: '#8fb3cc', fontSize: '0.74rem', letterSpacing: '0.06em', borderTop: '1px solid rgba(255,255,255,.07)', marginTop: '56px' }}>Programa de Educação Digital · FIEC · II Semestre 2026</footer>

      <FormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedModulo(null) }}
        polo="Polo Bem Viver"
        modulo={selectedModulo?.tag || ''}
        dias={selectedModulo?.dias || ''}
        horario={selectedModulo?.horario || ''}
        scriptUrl={selectedModulo?.scriptUrl}
        masterUrl={getMasterUrl()}
        liberado={selectedModulo?.liberado}
        dataLiberacao={selectedModulo?.dataLiberacao || undefined}
      />

      <FormModal
        isOpen={listaEsperaModalOpen}
        onClose={() => setListaEsperaModalOpen(false)}
        polo="Polo Bem Viver"
        modulo=""
        dias=""
        horario=""
        scriptUrl=""
        masterUrl={getMasterUrl()}
        listaEsperaOnly
        listaEsperaTurmas={modulos.map(m => `Bem Viver: ${m.tag} - ${m.dias} - ${m.horario}`)}
      />
    </main>
  )
}

function ModuloCard({ modulo, index, onClick }: { modulo: ModuloData; index: number; onClick: () => void }) {
  return (
    <motion.div
      onClick={modulo.esgotado ? undefined : onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={modulo.esgotado ? {} : { y: -3, borderColor: '#f5a623', boxShadow: '0 8px 24px rgba(0,0,0,.3)' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 16px 14px',
        background: '#1e3a52',
        border: '1px solid rgba(255,255,255,.07)',
        borderRadius: '10px',
        textDecoration: 'none',
        color: 'white',
        cursor: modulo.esgotado ? 'not-allowed' : 'pointer',
        opacity: modulo.esgotado ? 0.55 : 1,
      }}
    >
      <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#f5a623', marginBottom: '4px' }}>{modulo.tag}</span>
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '3px' }}>{modulo.dias}</span>
      <span style={{ fontSize: '0.78rem', color: '#8fb3cc', marginBottom: '10px' }}>{modulo.horario}</span>
      {modulo.vagas >= 0 ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', color: modulo.vagas <= 5 ? '#e05c5c' : '#4a9eca', marginTop: 'auto' }}>
          {modulo.vagas === 0 ? 'Esgotado' : `${modulo.vagas} vagas`}
        </span>
      ) : (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4a9eca', marginTop: 'auto' }}>Inscrever-se <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg></span>
      )}
    </motion.div>
  )
}