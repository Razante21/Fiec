import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inscrições – Programa de Educação Digital',
  description: 'FIEC - Programa de Educação Digital - II Semestre 2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}