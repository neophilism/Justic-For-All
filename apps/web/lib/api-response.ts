import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorEnvelope } from "@jfa/contracts";

export function publicApiSuccess<T>(data: T): NextResponse<ApiEnvelope<T>> {
  return NextResponse.json(
    { api_version: "1" as const, request_id: randomUUID(), data },
    { headers: { "Cache-Control": "public, max-age=60", "X-Content-Type-Options": "nosniff" } }
  );
}
export function publicApiError(status: number, code: string, message: string): NextResponse<ApiErrorEnvelope> {
  return NextResponse.json(
    { api_version: "1" as const, request_id: randomUUID(), error: { code, message } },
    { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } }
  );
}
