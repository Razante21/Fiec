export interface ModuloData {
  id: string
  tag: string
  dias: string
  horario: string
  formUrl: string
  scriptUrl: string
  vagas: number
  esgotado: boolean
  liberado?: boolean
  dataLiberacao?: string | null
}

const SCRIPT_URL_TURMAS = "https://script.google.com/macros/s/AKfycbweWUdM750BmfdjZkcmTYE6Bg7WxIO4Dp1kV7Z35CPKkiQ-C-QMpiYBa3i6FtEL8t-j/exec"
export const MASTER_URL = "https://script.google.com/macros/s/AKfycbweWUdM750BmfdjZkcmTYE6Bg7WxIO4Dp1kV7Z35CPKkiQ-C-QMpiYBa3i6FtEL8t-j/exec" // URL da planilha master paraInscrições e Lista de Espera

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
      scriptUrl: t.script_url || t.scriptUrl || '',
      vagas: -1,
      esgotado: false,
      liberado: Boolean(t.liberado),
      dataLiberacao: t.data_liberacao ?? null,
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
    // Script individual retorna "restantes", não "vagas"
    return data.restantes ?? data.vagas ?? -1
  } catch {
    return -1
  }
}

export function getMasterUrl(): string {
  return MASTER_URL
}