import { NextRequest, NextResponse } from 'next/server'
import { getState, setState } from '@/lib/turso'

export const dynamic = 'force-dynamic'

/** If APP_KEY is set in the env, every request must send x-app-key: <APP_KEY>. */
function checkKey(req: NextRequest): boolean {
  const expected = process.env.APP_KEY
  if (!expected) return true
  return req.headers.get('x-app-key') === expected
}

/** GET /api/state -> { data: <DB object> | null } */
export async function GET(req: NextRequest) {
  if (!checkKey(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const raw = await getState()
    let data: unknown = null
    if (raw) {
      try {
        data = JSON.parse(raw)
      } catch {
        data = null
      }
    }
    return NextResponse.json(
      { data },
      { headers: { 'cache-control': 'no-store' } },
    )
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'failed' },
      { status: 500 },
    )
  }
}

/** POST /api/state { data: <DB object> } -> { ok: true } */
export async function POST(req: NextRequest) {
  if (!checkKey(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json().catch(() => null)
    const payload =
      body && typeof body === 'object' && 'data' in (body as Record<string, unknown>)
        ? (body as { data: unknown }).data
        : body
    const json = JSON.stringify(payload ?? {})
    await setState(json)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'failed' },
      { status: 500 },
    )
  }
}
