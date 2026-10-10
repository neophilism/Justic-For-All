/**
 * Explicitly unconfigured integration baseline.
 * Never translate mere repository existence into runtime availability.
 */
export type AdapterAvailability = "unconfigured" | "unverified" | "verified";
export type AdapterStatus = Readonly<{ availability: AdapterAvailability; integrationId: string }>;
export function disconnectedAdapter(integrationId: string): AdapterStatus {
  return { integrationId, availability: "unconfigured" };
}
