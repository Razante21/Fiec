import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inclusão Digital – Hub de Educação',
  description: 'Hub integrado de inscrições e cronograma - Inclusão Digital FIEC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}