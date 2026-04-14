import crypto from 'crypto'

export interface SessionPayload {
  sub: number
  usuario: string
  nivel: 'admin' | 'coordenador' | 'aluno'
  iat: number
  exp: number
}

const SESSION_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret-change-me'
const SESSION_TTL_SECONDS = 60 * 60 * 8

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString('base64url')
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(data: string) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url')
}

export function createSessionToken(payload: Pick<SessionPayload, 'sub' | 'usuario' | 'nivel'>) {
  const now = Math.floor(Date.now() / 1000)
  const sessionPayload: SessionPayload = {
    ...payload,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  }

  const encodedPayload = base64UrlEncode(JSON.stringify(sessionPayload))
  const signature = sign(encodedPayload)

  return `${encodedPayload}.${signature}`
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [encodedPayload, receivedSignature] = token.split('.')

  if (!encodedPayload || !receivedSignature) {
    return null
  }

  const expectedSignature = sign(encodedPayload)

  if (receivedSignature.length !== expectedSignature.length) {
    return null
  }

  if (!crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature))) {
    return null
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload

    if (!payload.sub || !payload.usuario || !payload.nivel || !payload.exp) {
      return null
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function getBearerToken(request: Request) {
  const authHeader = request.headers.get('authorization') || ''

  if (!authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.slice(7).trim() || null
}
