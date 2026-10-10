import { NextResponse } from "next/server";
/** Until JFA-05/06, no DB exists to establish real readiness. */
export function GET() {
  return NextResponse.json(
    { status: "not_ready", check: "readiness", reason: "core_database_unconfigured" },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}
