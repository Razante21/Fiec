import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'sql301.infinityfree.com',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'if0_41629374',
  password: process.env.DB_PASSWORD || 'BqAChDVdHJc3',
  database: process.env.DB_NAME || 'if0_41629374_fiec_db',
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