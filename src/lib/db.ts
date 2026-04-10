import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'sql.freedb.tech',
  user: process.env.DB_USER || 'freedb_inclusao',
  password: process.env.DB_PASSWORD || '$r4h?KQG6Zjm6*!',
  database: process.env.DB_NAME || 'freedb_fiec_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

export async function query(sql: string, params?: any[]) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}