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

export const MASTER_URL = "https://script.google.com/macros/s/AKfycbweWUdM750BmfdjZkcmTYE6Bg7WxIO4Dp1kV7Z35CPKkiQ-C-QMpiYBa3i6FtEL8t-j/exec" // URL da planilha master para inscrições e lista de espera

let currentMasterUrl = MASTER_URL
let loadedFromDb = false

function poloToSlug(polo: string): string {
  return polo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function loadMasterUrl(): Promise<string> {
  if (loadedFromDb) return currentMasterUrl

  try {
    const res = await fetch('/api/config')
    const data = await res.json()

    if (data?.success && data?.data?.appsScriptUrl) {
      currentMasterUrl = data.data.appsScriptUrl
    }
  } catch (error) {
    console.error('Erro ao carregar URL do Apps Script:', error)
  }

  loadedFromDb = true
  return currentMasterUrl
}

export async function fetchTurmas(polo: string): Promise<ModuloData[]> {
  try {
    const res = await fetch(`/api/turmas?polo=${encodeURIComponent(poloToSlug(polo))}`)
    const data = await res.json()

    if (!data.success || !data.data || data.data.length === 0) {
      return []
    }

    return data.data.map((t: any) => ({
      id: String(t.id),
      tag: t.modulo,
      dias: t.dias,
      horario: t.horario,
      formUrl: '',
      scriptUrl: t.script_url || '',
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
    // Script individual retorna "restantes", não "vagas"
    return data.restantes ?? data.vagas ?? -1
  } catch {
    return -1
  }
}

export function getMasterUrl(): string {
  return currentMasterUrl
}