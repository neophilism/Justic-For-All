import { NextResponse } from "next/server";
import { probeCoreReadiness } from "@jfa/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await probeCoreReadiness();
  return NextResponse.json(
    { status: result.ready ? "ready" : "not_ready", check: "readiness", reason: result.reason },
    { status: result.ready ? 200 : 503, headers: { "Cache-Control": "no-store" } }
  );
}
