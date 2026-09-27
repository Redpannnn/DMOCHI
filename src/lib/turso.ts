import { createClient, type Client } from '@libsql/client'

/**
 * libSQL / Turso client.
 *
 * Works locally with a file: URL (DATABASE_URL=file:.../custom.db) and on
 * Vercel with a Turso libsql:// URL + TURSO_AUTH_TOKEN. No migration CLI is
 * needed: the single-row state table is created on first use via CREATE TABLE
 * IF NOT EXISTS, so you never have to run `prisma db push` by hand.
 */

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

/** Returns the raw JSON string of the saved app state, or null if empty. */
export async function getState(): Promise<string | null> {
  await ensureSchema()
  const r = await getTurso().execute({
    sql: `SELECT data FROM ${TABLE} WHERE id = ?`,
    args: [ROW_ID],
  })
  if (r.rows.length === 0) return null
  return String(r.rows[0].data)
}

/** Saves (insert or update) the raw JSON string of the app state. */
export async function setState(data: string): Promise<void> {
  await ensureSchema()
  const now = Date.now()
  await getTurso().execute({
    sql: `INSERT INTO ${TABLE} (id, data, "updatedAt") VALUES (?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET data = excluded.data, "updatedAt" = excluded."updatedAt"`,
    args: [ROW_ID, data, now],
  })
}
