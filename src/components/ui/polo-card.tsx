'use client'

import { motion } from "framer-motion"

interface PoloCardProps {
  name: string
  description: string
  image: string
  tag?: string
  href: string
}

export function PoloCard({ name, description, image, tag, href }: PoloCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)', borderColor: '#f5a623' }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        background: '#1e3a52',
        borderRadius: '10px',
        textDecoration: 'none',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '35px 20px', textAlign: 'center', flex: 1 }}>
        {tag && (
          <span style={{
            display: 'inline-block',
            background: '#f5a623',
            color: '#0d1a26',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '10px'
          }}>
            {tag}
          </span>
        )}
        
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '1.4rem',
          textTransform: 'uppercase',
          marginBottom: '8px',
          lineHeight: 1.1,
        }}>
          {name}
        </h2>

        <p style={{
          fontSize: '0.85rem',
          color: '#a0b2c1',
          lineHeight: 1.5,
        }}>
          {description}
        </p>
      </div>

      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '15px',
        textAlign: 'center',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '0.85rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Acessar Polo
      </div>
    </motion.a>
  )
}
