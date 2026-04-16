import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import pool from '@/lib/db'
import { createSessionToken, getBearerToken, verifySessionToken } from '@/lib/auth-server'

type LegacyRole = 'administrador' | 'professor' | 'aluno'

type LegacySessionRole = 'admin' | 'coordenador' | 'aluno'

interface LegacyUser {
  id: number
  nome: string
  senha?: string
  nivel: string
}

interface AuthContext {
  id: number
  nome: string
  nivel: LegacyRole
  id_nivel: number | null
}

function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

function normalizeHash(passwordHash: string) {
  return passwordHash.startsWith('$2y$')
    ? `$2a$${passwordHash.slice(4)}`
    : passwordHash
}

function isLegacyRole(value: string): value is LegacyRole {
  return value === 'administrador' || value === 'professor' || value === 'aluno'
}

function mapRoleToSession(role: LegacyRole): LegacySessionRole {
  switch (role) {
    case 'administrador':
      return 'admin'
    case 'professor':
      return 'coordenador'
    default:
      return 'aluno'
  }
}

async function getLegacyUserById(id: number): Promise<LegacyUser | null> {
  const [rows] = await pool.execute('SELECT id, nome, nivel FROM usuario WHERE id = ?', [id])
  const users = rows as LegacyUser[]
  return users[0] ?? null
}

async function getLegacyContextByUser(user: LegacyUser): Promise<AuthContext> {
  if (!isLegacyRole(user.nivel)) {
    throw new Error('Nivel de usuario legado invalido')
  }

  let idNivel: number | null = null

  if (user.nivel === 'professor') {
    const [profRows] = await pool.execute('SELECT id FROM professor WHERE fk_usuario_id = ? LIMIT 1', [user.id])
    const professores = profRows as Array<{ id: number }>
    idNivel = professores[0]?.id ?? null
  }

  if (user.nivel === 'aluno') {
    const [turmaRows] = await pool.execute('SELECT id FROM turma WHERE fk_usuario_id = ? LIMIT 1', [user.id])
    const turmas = turmaRows as Array<{ id: number }>
    idNivel = turmas[0]?.id ?? null
  }

  return {
    id: user.id,
    nome: user.nome,
    nivel: user.nivel,
    id_nivel: idNivel,
  }
}

async function authenticate(request: NextRequest): Promise<AuthContext | null> {
  const token = getBearerToken(request)
  if (!token) {
    return null
  }

  const session = verifySessionToken(token)
  if (!session) {
    return null
  }

  const user = await getLegacyUserById(session.sub)
  if (!user) {
    return null
  }

  return getLegacyContextByUser(user)
}

function ensureRole(context: AuthContext | null, roles: LegacyRole[]): context is AuthContext {
  if (!context) {
    return false
  }

  if (!roles.includes(context.nivel)) {
    return false
  }

  return true
}

function checkRole(context: AuthContext | null, roles: LegacyRole[]) {
  if (!ensureRole(context, roles)) {
    if (!context) {
      return { ok: false as const, response: jsonError('Token ausente ou invalido', 401) }
    }
    return { ok: false as const, response: jsonError('Acesso negado', 403) }
  }

  return { ok: true as const, context }
}

function parseId(value: string | undefined) {
  if (!value) {
    return null
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

async function handleLogin(request: NextRequest) {
  const body = await request.json()
  const username = String(body?.username ?? body?.usuario ?? '').trim()
  const password = String(body?.password ?? body?.senha ?? '')

  if (!username || !password) {
    return jsonError('Usuario e senha sao obrigatorios', 400)
  }

  const [rows] = await pool.execute('SELECT id, nome, senha, nivel FROM usuario WHERE nome = ? LIMIT 1', [username])
  const users = rows as LegacyUser[]

  if (users.length === 0) {
    return jsonError('Usuario ou senha incorretos', 401)
  }

  const user = users[0]
  const storedPassword = String(user.senha ?? '')

  const validPassword = storedPassword.startsWith('$2')
    ? await bcrypt.compare(password, normalizeHash(storedPassword))
    : password === storedPassword

  if (!validPassword) {
    return jsonError('Usuario ou senha incorretos', 401)
  }

  if (!isLegacyRole(user.nivel)) {
    return jsonError('Nivel de usuario invalido', 500)
  }

  const authContext = await getLegacyContextByUser(user)
  const token = createSessionToken({
    sub: user.id,
    usuario: user.nome,
    nivel: mapRoleToSession(user.nivel),
  })

  return NextResponse.json({
    token,
    user: {
      id: authContext.id,
      nome: authContext.nome,
      nivel: authContext.nivel,
      id_nivel: authContext.id_nivel,
    },
  })
}

async function handleGet(path: string[], request: NextRequest) {
  const context = await authenticate(request)

  if (path[0] === 'auth' && path[1] === 'me' && path.length === 2) {
    const roleCheck = checkRole(context, ['administrador', 'professor', 'aluno'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    return NextResponse.json({
      user: {
        id: roleCheck.context.id,
        nome: roleCheck.context.nome,
        nivel: roleCheck.context.nivel,
        id_nivel: roleCheck.context.id_nivel,
      },
    })
  }

  if (path[0] === 'turmas' && path.length === 1) {
    const roleCheck = checkRole(context, ['professor'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const [rows] = await pool.execute(
      'SELECT id, turma, descricao FROM turma WHERE fk_professor = ? ORDER BY turma',
      [roleCheck.context.id_nivel]
    )

    return NextResponse.json(rows)
  }

  if (path[0] === 'turmas' && path.length === 2) {
    const roleCheck = checkRole(context, ['professor'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const turmaId = parseId(path[1])
    if (!turmaId) {
      return jsonError('Turma invalida', 400)
    }

    const [rows] = await pool.execute(
      'SELECT id, turma, descricao FROM turma WHERE id = ? AND fk_professor = ? LIMIT 1',
      [turmaId, roleCheck.context.id_nivel]
    )
    const turmas = rows as Array<{ id: number; turma: string; descricao: string }>

    if (turmas.length === 0) {
      return jsonError('Turma nao encontrada', 404)
    }

    return NextResponse.json(turmas[0])
  }

  if (
    (path[0] === 'professores' && path.length === 1) ||
    (path[0] === 'users' && path[1] === 'professores' && path.length === 2)
  ) {
    const roleCheck = checkRole(context, ['administrador'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const [rows] = await pool.execute(`
      SELECT p.id, p.tipo, p.descricao, u.nome, u.nivel
      FROM professor p
      LEFT JOIN usuario u ON p.fk_usuario_id = u.id
      ORDER BY u.nome
    `)

    return NextResponse.json(rows)
  }

  if (path[0] === 'users' && path[1] === 'turmas' && path.length === 2) {
    const roleCheck = checkRole(context, ['administrador'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const [rows] = await pool.execute(`
      SELECT t.id, t.turma, t.descricao, u.nome, u.nivel, p.id AS professor_id, p.tipo AS professor_tipo
      FROM turma t
      LEFT JOIN usuario u ON t.fk_usuario_id = u.id
      LEFT JOIN professor p ON t.fk_professor = p.id
      ORDER BY u.nome
    `)

    return NextResponse.json(rows)
  }

  if (path[0] === 'integration' && path[1] === 'inscricoes' && path[2] === 'turmas' && path.length === 3) {
    const roleCheck = checkRole(context, ['administrador'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const [rows] = await pool.execute(`
      SELECT
        a.id,
        a.modulo,
        a.dias,
        a.horario,
        a.ativo,
        a.liberado,
        p.nome AS polo_nome,
        p.slug AS polo_slug
      FROM alunos a
      LEFT JOIN polos p ON p.id = a.polo_id
      WHERE a.ativo = TRUE
      ORDER BY p.nome, a.modulo, a.dias, a.horario
    `)

    return NextResponse.json(rows)
  }

  if (path[0] === 'aulas' && path[1] === 'aluno' && path.length === 2) {
    const roleCheck = checkRole(context, ['aluno'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const [rows] = await pool.execute(
      "SELECT * FROM aulas WHERE status = 'ativa' AND fk_turma_id = ? ORDER BY CAST(ordem AS UNSIGNED)",
      [roleCheck.context.id_nivel]
    )

    return NextResponse.json(rows)
  }

  if (path[0] === 'aulas' && path[1] === 'turma' && path.length === 3) {
    const roleCheck = checkRole(context, ['professor'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const turmaId = parseId(path[2])
    if (!turmaId) {
      return jsonError('Turma invalida', 400)
    }

    const [rows] = await pool.execute(
      'SELECT * FROM aulas WHERE fk_turma_id = ? AND fk_professor_id = ? ORDER BY CAST(ordem AS UNSIGNED)',
      [turmaId, roleCheck.context.id_nivel]
    )

    return NextResponse.json(rows)
  }

  if (path[0] === 'aulas' && path.length === 2) {
    const roleCheck = checkRole(context, ['administrador', 'professor', 'aluno'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const aulaId = parseId(path[1])
    if (!aulaId) {
      return jsonError('Aula invalida', 400)
    }

    const [rows] = await pool.execute('SELECT * FROM aulas WHERE id = ? LIMIT 1', [aulaId])
    const aulas = rows as Array<Record<string, unknown>>

    if (aulas.length === 0) {
      return jsonError('Aula nao encontrada', 404)
    }

    return NextResponse.json(aulas[0])
  }

  return jsonError('Rota nao encontrada', 404)
}

async function handlePost(path: string[], request: NextRequest) {
  if (path[0] === 'auth' && path[1] === 'login' && path.length === 2) {
    return handleLogin(request)
  }

  const context = await authenticate(request)

  if (path[0] === 'users' && path[1] === 'professor' && path.length === 2) {
    const roleCheck = checkRole(context, ['administrador'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const body = await request.json()
    const nome = String(body?.nome ?? '').trim()
    const senha = String(body?.senha ?? '')
    const tipo = String(body?.tipo ?? '').trim()
    const descricao = String(body?.descricao ?? '').trim()

    if (!nome || !senha || !tipo) {
      return jsonError('Nome, senha e tipo sao obrigatorios', 400)
    }

    const hashedSenha = await bcrypt.hash(senha, 10)
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [userResult] = await connection.execute(
        'INSERT INTO usuario (nome, senha, nivel) VALUES (?, ?, ?)',
        [nome, hashedSenha, 'professor']
      )

      const usuarioId = (userResult as { insertId: number }).insertId

      await connection.execute(
        'INSERT INTO professor (tipo, descricao, fk_usuario_id) VALUES (?, ?, ?)',
        [tipo, descricao, usuarioId]
      )

      await connection.commit()
      return NextResponse.json({ success: true, message: 'Professor criado com sucesso' })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  if (path[0] === 'users' && path[1] === 'turma' && path.length === 2) {
    const roleCheck = checkRole(context, ['administrador'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const body = await request.json()
    const nome = String(body?.nome ?? '').trim()
    const senha = String(body?.senha ?? '')
    const turma = String(body?.turma ?? '').trim()
    const descricao = String(body?.descricao ?? '').trim()
    const professorId = parseId(String(body?.professor ?? ''))

    if (!nome || !senha || !turma || !professorId) {
      return jsonError('Todos os campos sao obrigatorios', 400)
    }

    const hashedSenha = await bcrypt.hash(senha, 10)
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [userResult] = await connection.execute(
        'INSERT INTO usuario (nome, senha, nivel) VALUES (?, ?, ?)',
        [nome, hashedSenha, 'aluno']
      )

      const usuarioId = (userResult as { insertId: number }).insertId

      await connection.execute(
        'INSERT INTO turma (turma, descricao, fk_usuario_id, fk_professor) VALUES (?, ?, ?, ?)',
        [turma, descricao, usuarioId, professorId]
      )

      await connection.commit()
      return NextResponse.json({ success: true, message: 'Turma criada com sucesso' })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  if (path[0] === 'aulas' && path.length === 1) {
    const roleCheck = checkRole(context, ['professor'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const body = await request.json()

    const titulo = String(body?.titulo ?? '').trim()
    const descricao = String(body?.descricao ?? '').trim()
    const data = String(body?.data ?? '').trim()
    const tipo = String(body?.tipo ?? '').trim()
    const ordem = String(body?.ordem ?? '').trim()
    const status = String(body?.status ?? 'ativa').trim() || 'ativa'
    const exercicio = String(body?.exercicio ?? '').trim()
    const slide = String(body?.slide ?? '').trim()
    const correcao = String(body?.correcao ?? '').trim()
    const liberarExe = String(body?.liberarExe ?? '').trim()
    const liberarSli = String(body?.liberarSli ?? '').trim()
    const liberarCorr = String(body?.liberarCorr ?? '').trim()
    const turma = parseId(String(body?.turma ?? ''))

    if (!titulo || !descricao || !data || !tipo || !ordem || !turma) {
      return jsonError('Campos obrigatorios nao preenchidos', 400)
    }

    await pool.execute(
      `INSERT INTO aulas (
        titulo, descricao, data, tipo, ordem, status,
        exercicio, slide, correcao,
        fk_turma_id, fk_professor_id,
        liberarExe, liberarSli, liberarCorr
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        descricao,
        data,
        tipo,
        ordem,
        status,
        exercicio,
        slide,
        correcao,
        turma,
        roleCheck.context.id_nivel,
        liberarExe,
        liberarSli,
        liberarCorr,
      ]
    )

    return NextResponse.json({ success: true, message: 'Aula criada com sucesso' })
  }

  return jsonError('Rota nao encontrada', 404)
}

async function handlePut(path: string[], request: NextRequest) {
  const context = await authenticate(request)

  if (path[0] === 'aulas' && path.length === 2) {
    const roleCheck = checkRole(context, ['professor'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const aulaId = parseId(path[1])
    if (!aulaId) {
      return jsonError('Aula invalida', 400)
    }

    const [existingRows] = await pool.execute(
      'SELECT id FROM aulas WHERE id = ? AND fk_professor_id = ? LIMIT 1',
      [aulaId, roleCheck.context.id_nivel]
    )

    const existing = existingRows as Array<{ id: number }>

    if (existing.length === 0) {
      return jsonError('Aula nao encontrada ou acesso negado', 404)
    }

    const body = await request.json()
    const titulo = String(body?.titulo ?? '').trim()
    const descricao = String(body?.descricao ?? '').trim()
    const data = String(body?.data ?? '').trim()
    const tipo = String(body?.tipo ?? '').trim()
    const ordem = String(body?.ordem ?? '').trim()
    const status = String(body?.status ?? 'ativa').trim() || 'ativa'
    const exercicio = String(body?.exercicio ?? '').trim()
    const slide = String(body?.slide ?? '').trim()
    const correcao = String(body?.correcao ?? '').trim()
    const liberarExe = String(body?.liberarExe ?? '').trim()
    const liberarSli = String(body?.liberarSli ?? '').trim()
    const liberarCorr = String(body?.liberarCorr ?? '').trim()

    await pool.execute(
      `UPDATE aulas SET
        titulo = ?,
        descricao = ?,
        data = ?,
        tipo = ?,
        ordem = ?,
        status = ?,
        exercicio = ?,
        slide = ?,
        correcao = ?,
        liberarExe = ?,
        liberarSli = ?,
        liberarCorr = ?
      WHERE id = ? AND fk_professor_id = ?`,
      [
        titulo,
        descricao,
        data,
        tipo,
        ordem,
        status,
        exercicio,
        slide,
        correcao,
        liberarExe,
        liberarSli,
        liberarCorr,
        aulaId,
        roleCheck.context.id_nivel,
      ]
    )

    return NextResponse.json({ success: true, message: 'Aula atualizada com sucesso' })
  }

  return jsonError('Rota nao encontrada', 404)
}

async function handleDelete(path: string[], request: NextRequest) {
  const context = await authenticate(request)

  if (path[0] === 'aulas' && path.length === 2) {
    const roleCheck = checkRole(context, ['professor'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const aulaId = parseId(path[1])
    if (!aulaId) {
      return jsonError('Aula invalida', 400)
    }

    const [rows] = await pool.execute(
      'SELECT id FROM aulas WHERE id = ? AND fk_professor_id = ? LIMIT 1',
      [aulaId, roleCheck.context.id_nivel]
    )
    const aulas = rows as Array<{ id: number }>

    if (aulas.length === 0) {
      return jsonError('Aula nao encontrada ou acesso negado', 404)
    }

    await pool.execute('DELETE FROM aulas WHERE id = ? AND fk_professor_id = ?', [
      aulaId,
      roleCheck.context.id_nivel,
    ])
    return NextResponse.json({ success: true, message: 'Aula excluida com sucesso' })
  }

  if (path[0] === 'users' && path[1] === 'professor' && path.length === 3) {
    const roleCheck = checkRole(context, ['administrador'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const professorId = parseId(path[2])
    if (!professorId) {
      return jsonError('Professor invalido', 400)
    }

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const [profRows] = await connection.execute(
        'SELECT fk_usuario_id FROM professor WHERE id = ? LIMIT 1',
        [professorId]
      )
      const professores = profRows as Array<{ fk_usuario_id: number }>

      if (professores.length === 0) {
        await connection.rollback()
        return jsonError('Professor nao encontrado', 404)
      }

      const usuarioId = professores[0].fk_usuario_id

      const [turmaRows] = await connection.execute(
        'SELECT id, fk_usuario_id FROM turma WHERE fk_professor = ?',
        [professorId]
      )
      const turmas = turmaRows as Array<{ id: number; fk_usuario_id: number }>

      const turmaUserIds = turmas.map((turma) => turma.fk_usuario_id)

      if (turmaUserIds.length > 0) {
        await connection.execute('DELETE FROM aulas WHERE fk_professor_id = ?', [professorId])
        await connection.execute('DELETE FROM turma WHERE fk_professor = ?', [professorId])

        const placeholders = turmaUserIds.map(() => '?').join(',')
        await connection.execute(`DELETE FROM usuario WHERE id IN (${placeholders})`, turmaUserIds)
      }

      await connection.execute('DELETE FROM professor WHERE id = ?', [professorId])
      await connection.execute('DELETE FROM usuario WHERE id = ?', [usuarioId])

      await connection.commit()
      return NextResponse.json({ success: true, message: 'Professor excluido com sucesso' })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  if (path[0] === 'users' && path[1] === 'turma' && path.length === 3) {
    const roleCheck = checkRole(context, ['administrador'])
    if (!roleCheck.ok) {
      return roleCheck.response
    }

    const turmaId = parseId(path[2])
    if (!turmaId) {
      return jsonError('Turma invalida', 400)
    }

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const [turmaRows] = await connection.execute(
        'SELECT fk_usuario_id FROM turma WHERE id = ? LIMIT 1',
        [turmaId]
      )
      const turmas = turmaRows as Array<{ fk_usuario_id: number }>

      if (turmas.length === 0) {
        await connection.rollback()
        return jsonError('Turma nao encontrada', 404)
      }

      const usuarioId = turmas[0].fk_usuario_id

      await connection.execute('DELETE FROM aulas WHERE fk_turma_id = ?', [turmaId])
      await connection.execute('DELETE FROM turma WHERE id = ?', [turmaId])
      await connection.execute('DELETE FROM usuario WHERE id = ?', [usuarioId])

      await connection.commit()
      return NextResponse.json({ success: true, message: 'Turma excluida com sucesso' })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  return jsonError('Rota nao encontrada', 404)
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    return await handleGet(params.path ?? [], request)
  } catch (error) {
    console.error('Erro na API de cronograma-alunos (GET):', error)
    return jsonError('Erro interno do servidor', 500)
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    return await handlePost(params.path ?? [], request)
  } catch (error) {
    console.error('Erro na API de cronograma-alunos (POST):', error)
    return jsonError('Erro interno do servidor', 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    return await handlePut(params.path ?? [], request)
  } catch (error) {
    console.error('Erro na API de cronograma-alunos (PUT):', error)
    return jsonError('Erro interno do servidor', 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    return await handleDelete(params.path ?? [], request)
  } catch (error) {
    console.error('Erro na API de cronograma-alunos (DELETE):', error)
    return jsonError('Erro interno do servidor', 500)
  }
}