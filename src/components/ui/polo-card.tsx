'use client'

import { motion, useReducedMotion } from "framer-motion"
import { useState } from "react"

interface PoloCardProps {
  name: string
  description: string
  image: string
  tag?: string
  href: string
}

const containerVariants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { type: "spring", stiffness: 400, damping: 28, mass: 0.6 } }
}

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 }
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 28, staggerChildren: 0.06, delayChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }
}

export function PoloCard({ name, description, image, tag, href }: PoloCardProps) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  
  const fallbackImage = "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800&h=600&fit=crop"
  
  return (
    <motion.a
      href={href}
      data-slot="polo-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className="relative w-full h-80 rounded-3xl border border-white/10 overflow-hidden shadow-xl shadow-black/20 cursor-pointer group backdrop-blur-sm"
      style={{ textDecoration: 'none' }}
    >
      <motion.img
        src={imgError ? fallbackImage : image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
        variants={imageVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onError={() => setImgError(true)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a26] via-[#0d1a26]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0d1a26]/90 via-[#0d1a26]/50 to-transparent" />

      <motion.div 
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 right-0 p-6 space-y-3"
      >
        {tag && (
          <motion.span variants={itemVariants} style={{
            display: 'inline-block', background: '#f5a623', color: '#0d1a26',
            fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: '4px',
            textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {tag}
          </motion.span>
        )}

        <motion.h2 variants={itemVariants} style={{
          fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', fontFamily: "'Barlow Condensed', sans-serif",
          textTransform: 'uppercase', lineHeight: 1.1, margin: 0
        }}>
          {name}
        </motion.h2>

        <motion.div variants={itemVariants} style={{ fontSize: '0.8rem', color: '#8fb3cc', lineHeight: 1.5, margin: 0 }}>
          {description.split('\n').map((line, i) => (
            <span key={i} style={{ display: 'block' }}>{line}</span>
          ))}
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', cursor: 'pointer', padding: '12px 16px', borderRadius: '12px',
            fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px',
            background: 'rgba(245, 166, 35, 0.9)', color: '#0d1a26', border: 'none',
            marginTop: '8px'
          }}
        >
          Acessar Polo →
        </motion.button>
      </motion.div>
    </motion.a>
  )
}
