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

    const [rows] = await pool.execute(sql, values);
    return rows;
  } catch (error: any) {
    console.error('DB Query Error:', error.message)
    throw error;
  }
}