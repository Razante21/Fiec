import mysql from 'mysql2/promise';

const host = 'sql100.infinityfree.com';
const port = 3306;
const user = 'if0_41629769';
const password = 'Razante21';
const database = 'if0_41629769_db_fiec';

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

export async function query(sql: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error: any) {
    console.error('DB Query Error:', error.message)
    throw error;
  }
}