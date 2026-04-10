import mysql from 'mysql2/promise';

const getEnv = (key: string, fallback: string): string => {
  const val = process.env[key];
  return val && val !== '' ? val : fallback;
};

const host = getEnv('DB_HOST', 'sql100.infinityfree.com');
const port = parseInt(getEnv('DB_PORT', '3306'));
const user = getEnv('DB_USER', 'if0_41629769');
const password = getEnv('DB_PASSWORD', 'Razante21');
const database = getEnv('DB_NAME', 'if0_41629769_db_fiec');

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