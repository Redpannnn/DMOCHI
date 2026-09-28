import { createClient, type Client } from '@libsql/client'

let _client: Client | null = null

export function getTurso(): Client {
  if (_client) return _client
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  _client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  })
  return _client
}

const TABLE = 'app_state'
const ROW_ID = 1

let _ensured = false
export async function ensureSchema(): Promise<void> {
  if (_ensured) return
  await getTurso().execute(
    `CREATE TABLE IF NOT EXISTS ${TABLE} (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL,
      "updatedAt" INTEGER NOT NULL
    )`,
  )
  _ensured = true
}

export async function getState(): Promise<string | null> {
  await ensureSchema()
  const r = await getTurso().execute({
    sql: `SELECT data FROM ${TABLE} WHERE id = ?`,
    args: [ROW_ID],
  })
  if (r.rows.length === 0) return null
  return String(r.rows[0].data)
}

export async function setState(data: string): Promise<void> {
  await ensureSchema()
  const now = Date.now()
  await getTurso().execute({
    sql: `INSERT INTO ${TABLE} (id, data, "updatedAt") VALUES (?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET data = excluded.data, "updatedAt" = excluded."updatedAt"`,
    args: [ROW_ID, data, now],
  })
}
