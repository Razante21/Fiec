'use client'

import { useMemo } from 'react'

export default function CronogramaAlunosPage() {
  const src = useMemo(() => '/cronograma-alunos-app/index.html#/', [])

  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <iframe
        title="Cronograma Alunos"
        src={src}
        className="h-full w-full border-0"
      />
    </main>
  )
}
