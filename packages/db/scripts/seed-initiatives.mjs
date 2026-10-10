/**
 * Explicit, review-gated seed of publicly visible planning metadata.
 * Neither executes at runtime nor promotes any program to available/live.
 */
import {readFileSync} from "node:fs";
import pg from "pg";
import {validateInitiativeRegistry} from "../../../scripts/lib/initiative-registry.mjs";

const manifest = validateInitiativeRegistry(JSON.parse(readFileSync(new URL("../../../config/initiative-registry.v1.json",import.meta.url),"utf8")));
const apply = process.argv.includes("--apply");
const approved = process.argv.includes("--approve-public-planning-copy");
if (!apply) {
  process.stdout.write(`DRY RUN: ${manifest.initiatives.length} public-only planning entries. No database changes. Supply --apply --approve-public-planning-copy after review.\n`);
  process.exit(0);
}
if (!approved) throw new Error("Explicit public-copy approval flag required");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be configured in the secrets environment");

const {Pool} = pg;
const pool=new Pool({connectionString:process.env.DATABASE_URL});
const client=await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(hashtext('jfa-initiative-public-seed-v1'))");
  for (const item of manifest.initiatives) {
    // Existing runtime lifecycle status and private connector metadata are NOT changed.
    await client.query(`INSERT INTO initiatives
      (slug,display_name,public_description,status,reviewed_at,publication_approved_at)
      VALUES ($1,$2,$3,$4,now(),now())
      ON CONFLICT(slug) DO UPDATE
      SET display_name=EXCLUDED.display_name,
          public_description=EXCLUDED.public_description,
          reviewed_at=now(),
          publication_approved_at=COALESCE(initiatives.publication_approved_at,now()),
          row_version=initiatives.row_version+1
      WHERE initiatives.display_name IS DISTINCT FROM EXCLUDED.display_name
         OR initiatives.public_description IS DISTINCT FROM EXCLUDED.public_description
         OR initiatives.publication_approved_at IS NULL`,
      [item.slug,item.name,item.description,item.status]);
  }
  await client.query("COMMIT");
  process.stdout.write(`Applied public planning registry (${manifest.initiatives.length} entries). No services activated.\n`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
