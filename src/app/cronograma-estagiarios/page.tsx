'use client'

import { useMemo } from 'react'

export default function CronogramaEstagiariosPage() {
  const src = useMemo(() => '/cronograma-alunos-app/index.html#/turmas', [])

  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <iframe
        title="Cronograma Estagiarios"
        src={src}
        className="h-full w-full border-0"
      />
    </main>
  )
}
