'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { PoloCard } from '@/components/ui/polo-card'

const poloData = [
  { 
    name: 'Sol-Sol', 
    addr: 'Rua Athayde Puccinelli, 30\nJardim Flórida - Indaiatuba/SP', 
    url: '/polo/sol-sol', 
    tag: '',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop'
  },
  { 
    name: 'FIEC', 
    addr: 'Av. Eng. Fábio Roberto Barnabé, 3405\nJardim Regina - Indaiatuba/SP', 
    url: '/polo/fiec', 
    tag: '',
    image: 'https://images.unsplash.com/photo-1564981797816-52aabef2d9a9?w=800&h=600&fit=crop'
  },
  { 
    name: 'Comunidade Independente', 
    addr: 'Rua Alzira Barnabé, 240\nJardim Tropical - Indaiatuba/SP', 
    url: '/polo/comunidade-independente', 
    tag: '',
    image: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800&h=600&fit=crop'
  },
  { 
    name: 'CEU', 
    addr: 'Rua Juntalino Pieró Bom, 1500\nJardim São Conrado - Indaiatuba/SP', 
    url: '/polo/ceu', 
    tag: '',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
  },
  { 
    name: 'Jardim Brasil', 
    addr: 'Rua Lourenço Martins do Amaral, 271\nJardim Brasil - Indaiatuba/SP', 
    url: '/polo/jd-brasil', 
    tag: '',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&h=600&fit=crop'
  },
  { 
    name: 'Casa da Providência', 
    addr: 'Rua Aimore, 290\nJardim Dionéa - Indaiatuba/SP', 
    url: '/polo/casa-da-providencia', 
    tag: '',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
  },
  { 
    name: 'Bem Viver', 
    addr: 'Av. Eng. Fábio Roberto Barnabé, 505\nVila Teller - Indaiatuba/SP', 
    url: '/polo/bem-viver', 
    tag: 'Acima de 60 anos',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop'
  },
  { 
    name: 'Polo Veredas', 
    addr: 'Rua Clarindo Cassimiro Barbosa, s/n\nJardim Veredas - Indaiatuba/SP', 
    url: '/polo/veredas', 
    tag: '',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
  },
]

function Bounce({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20, 
        delay 
      }}
    >
      {children}
    </motion.div>
  )
}

function FadeContent({ children, blur = false, duration = 0.6, delay = 0 }: { 
  children: React.ReactNode; 
  blur?: boolean; 
  duration?: number; 
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: blur ? 'blur(10px)' : 'blur(0)' }}
      animate={{ opacity: 1, filter: blur ? 'blur(0)' : 'blur(0)' }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedContent({ 
  children, 
  direction = 'vertical', 
  distance = 50, 
  duration = 0.5, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  direction?: 'vertical' | 'horizontal'; 
  distance?: number; 
  duration?: number; 
  delay?: number;
}) {
  const getInitial = () => {
    if (direction === 'vertical') return { opacity: 0, y: distance }
    return { opacity: 0, x: distance }
  }
  
  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function Inicio() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <motion.section 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        style={{
          background: 'radial-gradient(circle at 15% 20%, rgba(245, 166, 35, .1) 0%, transparent 50%), linear-gradient(180deg, #0a141d 0%, #0d1a26 100%)',
          padding: '70px 24px 80px', 
          textAlign: 'center', 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
        }}
      >
        <Bounce delay={0}>
          <motion.div style={{
            display: 'inline-block', 
            background: '#f5a623', 
            color: '#0d1a26', 
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800, 
            fontSize: '1.4rem', 
            padding: '4px 20px', 
            borderRadius: '4px', 
            marginBottom: '30px',
          }}>FIEC</motion.div>
        </Bounce>

        <Bounce delay={0.1}>
          <motion.h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif", 
            fontWeight: 800, 
            fontSize: 'clamp(3rem, 10vw, 5rem)',
            textTransform: 'uppercase', 
            lineHeight: 0.9, 
            color: '#ffffff', 
            margin: 0,
          }}>Inscrições</motion.h1>
        </Bounce>

        <FadeContent blur duration={0.8} delay={0.2}>
          <motion.h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif", 
            fontWeight: 400, 
            fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
            color: '#a0b2c1', 
            textTransform: 'uppercase', 
            letterSpacing: '3px', 
            marginTop: '10px',
          }}>Programa de Educação Digital</motion.h2>
        </FadeContent>

        <Bounce delay={0.3}>
          <motion.div style={{
            display: 'inline-block', 
            border: '1px solid #f5a623', 
            padding: '6px 20px', 
            borderRadius: '5px',
            color: '#f5a623', 
            fontWeight: 700, 
            fontSize: '0.9rem', 
            marginTop: '25px',
          }}>II Semestre 2026</motion.div>
        </Bounce>

        <FadeContent blur duration={0.6} delay={0.4}>
          <motion.div style={{ marginTop: '40px' }}>
            <p style={{ color: '#a0b2c1', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Dia do evento</p>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(3.5rem, 10vw, 6rem)', fontWeight: 800, lineHeight: 1, color: '#ffffff' }}>30/06/2026</p>
            <p style={{ color: '#8fb3cc', fontSize: '0.9rem', marginTop: '20px' }}>Das 09h às 12h</p>
          </motion.div>
        </FadeContent>

        <FadeContent blur duration={0.6} delay={0.6}>
          <motion.div style={{ marginTop: '40px', padding: '20px', background: 'rgba(61,186,126,0.1)', borderRadius: '12px', border: '1px solid rgba(61,186,126,0.3)' }}>
            <p style={{ color: '#3dba7e', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Início das aulas</p>
            <p style={{ color: '#8fb3cc', fontSize: '0.95rem', marginTop: '8px' }}>Turmas de <strong style={{ color: '#fff' }}>2ª e 4ª</strong>: 03/08/26 (segunda-feira)</p>
            <p style={{ color: '#8fb3cc', fontSize: '0.95rem', marginTop: '4px' }}>Turmas de <strong style={{ color: '#fff' }}>3ª e 5ª</strong>: 04/08/26 (terça-feira)</p>
          </motion.div>
        </FadeContent>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          style={{ marginTop: '60px' }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ color: '#f5a623', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}
            onClick={() => {
              document.getElementById('polos')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Ver polos disponíveis
            <motion.div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Info Strip */}
      <AnimatedContent direction="vertical" distance={40} duration={0.6}>
        <motion.div style={{
          background: '#162a3d', 
          padding: '30px 24px', 
          textAlign: 'center', 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          borderBottom: '3px solid #1e3a52',
        }}>
          <p>Início das aulas: <br />
          Turmas de <strong style={{ color: '#f5a623' }}>Segunda e Quarta-feira</strong>: <strong style={{ color: '#f5a623' }}>03/08/2026</strong> <br />
          Turmas de <strong style={{ color: '#f5a623' }}>Terça e Quinta-feira</strong>: <strong style={{ color: '#f5a623' }}>04/08/2026</strong></p>
        </motion.div>
      </AnimatedContent>

      {/* Polos Section */}
      <div id="polos" style={{ background: '#0d1a26', padding: '80px 24px' }}>
        <AnimatedContent direction="vertical" distance={30} duration={0.5}>
          <motion.p style={{
            textAlign: 'center', 
            textTransform: 'uppercase', 
            letterSpacing: '3px', 
            fontSize: '0.8rem', 
            color: '#a0b2c1', 
            marginBottom: '50px',
          }}>Escolha uma unidade</motion.p>
        </AnimatedContent>

        {/* Container tablet */}
        <AnimatedContent direction="vertical" distance={50} duration={0.6} delay={0.1}>
          <motion.div className="polos-container" style={{
            maxWidth: '1200px', 
            margin: '0 auto', 
            background: '#162a3d', 
            borderRadius: '24px', 
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          }}>
            <div className="polos-grid" style={{ gap: '24px' }}>
              {poloData.map((polo, index) => (
                <AnimatedContent 
                  key={polo.name} 
                  direction="vertical" 
                  distance={60} 
                  duration={0.4} 
                  delay={0.1 + index * 0.05}
                >
                  <PoloCard
                    name={polo.name}
                    description={polo.addr}
                    image={polo.image}
                    tag={polo.tag}
                    href={polo.url}
                  />
                </AnimatedContent>
              ))}
            </div>
          </motion.div>
        </AnimatedContent>
      </div>

      <footer style={{ padding: '50px', textAlign: 'center', color: '#8fb3cc', fontSize: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#091520' }}>
        <FadeContent blur duration={0.5}>
          <div>Programa de Educação Digital · FIEC · II Semestre 2026</div>
        </FadeContent>
      </footer>
    </main>
  )
}