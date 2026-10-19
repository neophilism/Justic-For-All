import { readFile,readdir } from "node:fs/promises";
import pg from "pg";
import { parseDatabaseUrl } from "../src/config.mjs";

const parsed = parseDatabaseUrl(process.env.DATABASE_URL, process.env.NODE_ENV === "production" ? "production" : "development");
if (!parsed.ok) {
  console.error("Migration blocked: database configuration is missing or invalid.");
  process.exitCode = 1;
} else {
  const directory=new URL("../../../db/migrations/",import.meta.url);
  const migrations=(await readdir(directory)).filter(name=>/^\d{4}_[a-z0-9_]+\.sql$/.test(name)&&!name.endsWith("_down.sql")).sort();
  const client = new pg.Client({connectionString:parsed.url,connectionTimeoutMillis:5000});
  try {
    await client.connect();
    for(const name of migrations){
      const sql=await readFile(new URL(name,directory),"utf8");
      await client.query(sql);
    }
    console.info("Applied or confirmed "+migrations.length+" core migrations.");
  } catch {
    console.error("Migration failed; inspect server-side protected database logs.");
    process.exitCode = 1;
  } finally {
    await client.end().catch(()=>undefined);
  }
}
