import mysql from 'mysql2/promise';

const host = process.env.DB_HOST || 'sql100.infinityfree.com';
const port = parseInt(process.env.DB_PORT || '3306');
const user = process.env.DB_USER || 'if0_41629769';
const password = process.env.DB_PASSWORD || 'Razante21';
const database = process.env.DB_NAME || 'if0_41629769_db_fiec';

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

export async function query(sql: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error: any) {
    console.error('DB Query Error:', error.message)
    throw error;
  }
}