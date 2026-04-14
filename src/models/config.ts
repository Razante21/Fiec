import { query } from '@/lib/db';

const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweWUdM750BmfdjZkcmTYE6Bg7WxIO4Dp1kV7Z35CPKkiQ-C-QMpiYBa3i6FtEL8t-j/exec';

let initialized = false;

async function ensureConfigTable() {
  if (initialized) return;

  await query(`
    CREATE TABLE IF NOT EXISTS configuracoes (
      id INT PRIMARY KEY,
      apps_script_url VARCHAR(500) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await query(
    `INSERT INTO configuracoes (id, apps_script_url)
     VALUES (1, ?)
     ON DUPLICATE KEY UPDATE apps_script_url = apps_script_url`,
    [DEFAULT_APPS_SCRIPT_URL]
  );

  initialized = true;
}

export async function getAppsScriptUrl(): Promise<string> {
  await ensureConfigTable();

  const rows = await query(
    'SELECT apps_script_url FROM configuracoes WHERE id = 1 LIMIT 1'
  ) as { apps_script_url: string }[];

  return rows[0]?.apps_script_url || DEFAULT_APPS_SCRIPT_URL;
}

export async function setAppsScriptUrl(url: string) {
  await ensureConfigTable();

  return query(
    `INSERT INTO configuracoes (id, apps_script_url)
     VALUES (1, ?)
     ON DUPLICATE KEY UPDATE apps_script_url = VALUES(apps_script_url)`,
    [url]
  );
}
