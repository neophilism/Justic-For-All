import type { InitiativeStatus } from "@jfa/contracts";
import manifest from "../../../config/initiative-registry.v1.json";

export type Initiative = Readonly<{
  slug: string;
  name: string;
  description: string;
  overview: string;
  lifecycle: string;
  status: InitiativeStatus;
}>;

/**
 * Source-reviewed information only: even a future "live" declaration in an
 * unchecked manifest would NOT activate links or mark a module available.
 * Promotion to "available" belongs to the verified service release gate.
 */
export const initiatives: readonly Initiative[] = Object.freeze(
  manifest.initiatives
    .filter(item => item.status !== "retired")
    .map(item => Object.freeze({
      slug:item.slug,
      name:item.name,
      description:item.description,
      overview:item.overview,
      lifecycle:item.status,
      status:(item.status === "building" ? "building" : "planning") as InitiativeStatus
    }))
);

/** Public metadata only, without service URLs, secrets, intake or internal notes. */
export function findPublicInitiative(slug: string): Initiative | undefined {
  return initiatives.find(item => item.slug === slug);
}
