/** Versioned core status enum, not an upstream service contract. */
export type InitiativeStatus = "planning" | "building" | "available";
export type PublicApiError = Readonly<{ code: string; message: string; requestId?: string }>;

export type ApiEnvelope<T> = Readonly<{ api_version: "1"; request_id: string; data: T }>;
export type ApiErrorEnvelope = Readonly<{ api_version: "1"; request_id: string; error: Readonly<{ code: string; message: string }> }>;
