'use client'

import { useMemo } from 'react'

export default function CronogramaEstagiariosAdminPage() {
  const src = useMemo(() => '/cronograma-alunos-app/index.html#/admin', [])

  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <iframe
        title="Cronograma Estagiarios Admin"
        src={src}
        className="h-full w-full border-0"
      />
    </main>
  )
}
