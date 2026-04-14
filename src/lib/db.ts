import mysql from 'mysql2/promise';

const host = process.env.MYSQLHOST || 'localhost';
const port = parseInt(process.env.MYSQLPORT || '3306');
const user = process.env.MYSQLUSER || 'root';
const password = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '';
const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway';

console.log('DB Config:', { host, port, user, database });

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

function assertSingleStatement(sql: string) {
  // MySQL aceita ';' final opcional; qualquer ';' extra indica múltiplos comandos.
  const normalized = sql.trim();
  if (!normalized) {
    throw new Error('SQL vazio nao e permitido');
  }

  const stripped = normalized.endsWith(';')
    ? normalized.slice(0, -1).trim()
    : normalized;

  if (stripped.includes(';')) {
    throw new Error('Apenas 1 comando SQL por execucao e permitido');
  }
}

export default pool;

export async function query(options: { sql: string; values?: any[] } | string, params?: any[]) {
  try {
    let sql: string;
    let values: any[] = [];

    if (typeof options === 'string') {
      sql = options;
      values = params || [];
    } else {
      sql = options.sql;
      values = options.values || [];
    }

    assertSingleStatement(sql);

    const [rows] = await pool.execute(sql, values);
    return rows;
  } catch (error: any) {
    console.error('DB Query Error:', error.message)
    throw error;
  }
}