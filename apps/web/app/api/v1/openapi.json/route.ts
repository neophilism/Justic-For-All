import { NextResponse } from "next/server";
import spec from "@jfa/contracts/openapi/v1";

export function GET() {
  return NextResponse.json(spec, { headers: { "Cache-Control": "public, max-age=300" } });
}
