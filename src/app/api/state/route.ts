import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** If APP_KEY is set in the env, every request must send x-app-key: <APP_KEY>. */
function checkKey(req: NextRequest): boolean {
  const expected = process.env.APP_KEY;
  if (!expected) return true;
  return req.headers.get("x-app-key") === expected;
}

/** GET /api/state -> { data: <DB object> | null } */
export async function GET(req: NextRequest) {
  if (!checkKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const row = await db.appState.findUnique({ where: { id: 1 } });
    let data: unknown = null;
    if (row?.data) {
      try {
        data = JSON.parse(row.data);
      } catch {
        data = null;
      }
    }
    return NextResponse.json(
      { data },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "failed" },
      { status: 500 },
    );
  }
}

/** POST /api/state { data: <DB object> } -> { ok: true } */
export async function POST(req: NextRequest) {
  if (!checkKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => null);
    const payload =
      body &&
      typeof body === "object" &&
      "data" in (body as Record<string, unknown>)
        ? (body as { data: unknown }).data
        : body;
    const json = JSON.stringify(payload ?? {});
    await db.appState.upsert({
      where: { id: 1 },
      update: { data: json },
      create: { id: 1, data: json },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "failed" },
      { status: 500 },
    );
  }
}
