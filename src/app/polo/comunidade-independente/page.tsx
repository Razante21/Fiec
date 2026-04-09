'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FormModal } from '@/components/ui/form-modal'

interface ModuloData { id: string; tag: string; dias: string; horario: string; formUrl: string }

export default function PoloComunidadeIndependente() {
  const [listaEsperaModalOpen, setListaEsperaModalOpen] = useState(false)
  const modulos: ModuloData[] = [{ id: 'm2-1', tag: 'Módulo II — Intermediário', dias: '3ª e 5ª-feira', horario: '14h00 às 16h00', formUrl: 'LINK_FORM_COMUNIDADE_M2_35' }]

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }

  return (
    <main className="min-h-screen">
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'radial-gradient(ellipse 60% 60% at 8% 20%, rgba(245,166,35,.10) 0%, transparent 60%), linear-gradient(175deg, #091520 0%, #0d1a26 100%)', padding: '32px 24px 44px', textAlign: 'center', position: 'relative', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}><a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8fb3cc', textDecoration: 'none', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '22px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6" /></svg>Todos os polos</a></motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2.2rem, 7vw, 3.8rem)', textTransform: 'uppercase', margin: 0 }}>Polo Comunidade Independente</motion.h1>
      </motion.header>

      <div style={{ maxWidth: '1040px', margin: '44px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '270px 1fr', gap: '32px', alignItems: 'start' }}>
        <aside style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ background: '#1e3a52', borderRadius: '12px', border: '1px solid rgba(255,255,255,.07)', overflow: 'hidden' }}><div style={{ background: '#162a3d', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.07)' }}><span style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#f5a623', fontWeight: 700 }}>Endereço</span></div><div style={{ padding: '18px' }}><h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Comunidade Independente</h2><p style={{ color: '#8fb3cc', fontSize: '0.85rem' }}>Rua Alzira Barnabé, 240<br />Jardim Tropical</p></div></motion.div>
          <motion.button onClick={() => setListaEsperaModalOpen(true)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} whileHover={{ background: '#4a9eca', color: '#0d1a26' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: '1.5px solid #4a9eca', color: '#4a9eca', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', padding: '11px 16px', borderRadius: '10px', cursor: 'pointer' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>Lista de Espera</motion.button>
        </aside>

        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem,5vw,2.6rem)', textTransform: 'uppercase', marginBottom: '24px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>Inscrições <span style={{ color: '#f5a623' }}>2026</span></h2>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div style={{ marginBottom: '28px' }}>
              <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8fb3cc', whiteSpace: 'nowrap' }}>Módulo II — Intermediário</h4><div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.07)' }} /></motion.div>
              <motion.div variants={itemVariants} style={{ background: 'rgba(61,186,126,.06)', border: '1px solid rgba(61,186,126,.18)', borderLeft: '3px solid #3dba7e', padding: '14px 16px', borderRadius: '8px', fontSize: '0.82rem', lineHeight: 1.6, color: '#8fb3cc', marginBottom: '18px' }}><strong style={{ color: '#3dba7e' }}>Pré-requisito:</strong> É necessário ter concluído o módulo básico do curso de inclusão digital da FIEC ou ter conhecimentos básicos de informática.</motion.div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>{modulos.map((m, i) => <ModuloCard key={m.id} modulo={m} index={i} />)}</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ marginTop: '36px', padding: '24px 22px', background: '#162a3d', borderRadius: '12px', border: '1px solid rgba(255,255,255,.07)', textAlign: 'center' }}><p style={{ fontSize: '0.82rem', color: '#8fb3cc', marginBottom: '14px' }}>Não encontrou vaga? Entre na lista de espera.</p><button onClick={() => setListaEsperaModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'transparent', border: '1.5px solid #4a9eca', color: '#4a9eca', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', padding: '9px 22px', borderRadius: '6px', cursor: 'pointer' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>Entrar na Lista de Espera</button></motion.div>
        </motion.main>
      </div>
      <footer style={{ padding: '32px 24px', textAlign: 'center', color: '#8fb3cc', fontSize: '0.74rem', borderTop: '1px solid rgba(255,255,255,.07)', marginTop: '56px' }}>Programa de Educação Digital · FIEC · II Semestre 2026</footer>
      <FormModal
        isOpen={listaEsperaModalOpen}
        onClose={() => setListaEsperaModalOpen(false)}
        polo="Polo Comunidade Independente"
        modulo=""
        dias=""
        horario=""
        scriptUrl=""
        listaEsperaOnly
      />
    </main>
  )
}

function ModuloCard({ modulo, index }: { modulo: ModuloData; index: number }) {
  return (<motion.a href={modulo.formUrl} target="_blank" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} whileHover={{ y: -3, borderColor: '#f5a623', boxShadow: '0 8px 24px rgba(0,0,0,.3)' }} style={{ display: 'flex', flexDirection: 'column', padding: '16px 16px 14px', background: '#1e3a52', border: '1px solid rgba(255,255,255,.07)', borderRadius: '10px', textDecoration: 'none', color: 'white' }}><span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#f5a623', marginBottom: '4px' }}>{modulo.tag}</span><span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '3px' }}>{modulo.dias}</span><span style={{ fontSize: '0.78rem', color: '#8fb3cc', marginBottom: '10px' }}>{modulo.horario}</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4a9eca', marginTop: 'auto' }}>Inscrever-se <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg></span></motion.a>)
}