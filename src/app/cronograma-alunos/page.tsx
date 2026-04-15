'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CronogramaAlunosPage() {
  const router = useRouter()
  const src = useMemo(() => '/cronograma-alunos-app/index.html#/', [])
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (!loaded) {
        setFailed(true)
      }
    }, 6000)

    return () => window.clearTimeout(timeoutId)
  }, [loaded])

  return (
    <main className="min-h-screen w-full bg-slate-100">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="text-sm font-semibold text-slate-800">Cronograma Alunos</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Voltar
          </button>
          <button
            onClick={() => router.push('/hub')}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Ir para Hub
          </button>
        </div>
      </header>

      {failed && (
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <p className="text-sm font-medium">Nao foi possivel carregar o cronograma dentro da pagina.</p>
          <div className="mt-3">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-md bg-amber-600 px-3 py-1.5 text-sm text-white hover:bg-amber-700"
            >
              Abrir cronograma em nova aba
            </a>
          </div>
        </div>
      )}

      <div className="h-[calc(100vh-57px)] w-full overflow-hidden">
        <iframe
          title="Cronograma Alunos"
          src={src}
          className="h-full w-full border-0"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </main>
  )
}
