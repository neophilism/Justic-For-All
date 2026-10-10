/** Versioned core status enum, not an upstream service contract. */
export type InitiativeStatus = "planning" | "building" | "available";
export type PublicApiError = Readonly<{ code: string; message: string; requestId?: string }>;
