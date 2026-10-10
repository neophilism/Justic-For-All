import pg from "pg";
import { parseDatabaseUrl } from "./config.mjs";

const { Pool } = pg;
let pool: pg.Pool | undefined;
let initializedFor: string | undefined;

export type Readiness = Readonly<{ ready: boolean; reason: "ready" | "unconfigured" | "invalid_configuration" | "migration_missing" | "database_unavailable" }>;

/** Only a real DB + recognized core migration can produce readiness=true. */
export async function probeCoreReadiness(env: NodeJS.ProcessEnv = process.env): Promise<Readiness> {
  const value = parseDatabaseUrl(env.DATABASE_URL, env.NODE_ENV === "production" ? "production" : "development");
  if (!value.ok) return { ready: false, reason: value.reason };
  try {
    if (!pool) {
      pool = new Pool({connectionString:value.url,max:3,connectionTimeoutMillis:3000,idleTimeoutMillis:10000});
      initializedFor = value.url;
    }
    if (initializedFor !== value.url) return {ready:false,reason:"invalid_configuration"};
    const result = await pool.query<{version:string}>("SELECT version FROM jfa_schema_migrations WHERE version = $1",["0001_core"]);
    return result.rows.length ? {ready:true,reason:"ready"} : {ready:false,reason:"migration_missing"};
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "42P01") {
      return {ready:false,reason:"migration_missing"};
    }
    // Never echo DB exception strings, URLs, hostnames or credentials.
    return {ready:false,reason:"database_unavailable"};
  }
}
