import { readFile } from "node:fs/promises";
import pg from "pg";
import { parseDatabaseUrl } from "../src/config.mjs";

const parsed = parseDatabaseUrl(process.env.DATABASE_URL, process.env.NODE_ENV === "production" ? "production" : "development");
if (!parsed.ok) {
  console.error("Migration blocked: database configuration is missing or invalid.");
  process.exitCode = 1;
} else {
  const migrations = ["0001_core.sql","0002_editorial_media.sql"];
  const client = new pg.Client({connectionString:parsed.url,connectionTimeoutMillis:5000});
  try {
    await client.connect();
    for(const name of migrations){
      const sql=await readFile(new URL("../../../db/migrations/"+name, import.meta.url),"utf8");
      await client.query(sql);
    }
    console.info("Applied or confirmed core migrations.");
  } catch {
    console.error("Migration failed; inspect server-side protected database logs.");
    process.exitCode = 1;
  } finally {
    await client.end().catch(()=>undefined);
  }
}
