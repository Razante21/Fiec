export interface ModuloData {
  id: string
  tag: string
  dias: string
  horario: string
  formUrl: string
  scriptUrl: string
  vagas: number
  esgotado: boolean
}

const SCRIPT_URL_TURMAS = "https://script.google.com/macros/s/AKfycbwAAK9EH6FuyGiMFVhjEeRqJEkFkDbSpIupwOz6mE6hqxOX4xpOa3phiYyEavP9yg6DXg/exec"
const SCRIPT_URL_LISTA_ESPERA = "" // Pendente

export async function fetchTurmas(polo: string): Promise<ModuloData[]> {
  try {
    const res = await fetch(`${SCRIPT_URL_TURMAS}?action=turmasPorPolo&polo=${encodeURIComponent(polo)}`)
    const data = await res.json()
    
    if (!data.turmas || data.turmas.length === 0) {
      return []
    }
    
    return data.turmas.map((t: any, index: number) => ({
      id: `${polo}-${index}`,
      tag: t.modulo,
      dias: t.dias,
      horario: t.horario,
      formUrl: '',
      scriptUrl: t.scriptUrl || '',
      vagas: -1,
      esgotado: false,
    }))
  } catch (error) {
    console.error('Erro ao carregar turmas:', error)
    return []
  }
}

export async function fetchVagas(scriptUrl: string): Promise<number> {
  if (!scriptUrl || scriptUrl === '') return -1
  try {
    const res = await fetch(scriptUrl)
    if (!res.ok) throw new Error('erro')
    const data = await res.json()
    return data.restantes ?? -1
  } catch {
    return -1
  }
}

export function getListaEsperaUrl(): string {
  return SCRIPT_URL_LISTA_ESPERA
}