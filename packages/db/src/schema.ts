import { pgTable, uuid, text, timestamp, boolean, jsonb, integer, bigint } from "drizzle-orm/pg-core";

/**
 * Initial strongly typed schema mirrors the public and integration-control tables.
 * Canonical historical DB migration defines the complete 21-table core schema.
 * Remaining private tables receive typed mappings before any runtime private access.
 */
export const initiatives = pgTable("initiatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  displayName: text("display_name").notNull(),
  publicDescription: text("public_description").notNull(),
  status: text("status").notNull().default("planning"),
  serviceRef: text("service_ref"),
  capabilities: jsonb("capabilities").notNull().default([]),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  publicationApprovedAt: timestamp("publication_approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  rowVersion: bigint("row_version", {mode:"number"}).notNull().default(1)
});
export const moduleConnections = pgTable("module_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  baseUrl: text("base_url"),
  contractVersion: text("contract_version"),
  capabilities: jsonb("capabilities").notNull().default([]),
  credentialRef: text("credential_ref"),
  verificationState: text("verification_state").notNull().default("unverified"),
  enabled: boolean("enabled").notNull().default(false),
  verifiedAt: timestamp("verified_at",{withTimezone:true}),
  approvedAt: timestamp("approved_at",{withTimezone:true})
});
export const publicProjections = pgTable("public_projections",{
 id: uuid("id").primaryKey().defaultRandom(),
 sourceRef:text("source_ref").notNull(),
 sourceVersion:text("source_version").notNull(),
 releaseState:text("release_state").notNull().default("draft"),
 safeFields:jsonb("safe_fields").notNull().default({}),
 approvedAt:timestamp("approved_at",{withTimezone:true}),
 publishedAt:timestamp("published_at",{withTimezone:true}),
 lastVerifiedAt:timestamp("last_verified_at",{withTimezone:true})
});
export const healthObservations = pgTable("health_observations",{
 id:uuid("id").primaryKey().defaultRandom(),
 serviceRef:text("service_ref").notNull(),
 checkedAt:timestamp("checked_at",{withTimezone:true}).notNull(),
 source:text("source").notNull(),
 result:text("result").notNull(),
 freshnessSeconds:integer("freshness_seconds").notNull(),
 evidenceRef:text("evidence_ref")
});
