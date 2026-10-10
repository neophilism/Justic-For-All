import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const sql=readFileSync(new URL("../db/migrations/0001_core.sql",import.meta.url),"utf8");
test("baseline documents all twenty-one core-owned tables",()=>{
 const actual=[...sql.matchAll(/CREATE TABLE IF NOT EXISTS ([a-z_]+) \(/g)].map(x=>x[1]).filter(x=>x!=="jfa_schema_migrations");
 assert.equal(actual.length,21);
 assert.equal(new Set(actual).size,21);
});
test("core private data stays outside published database projections",()=>{
 assert.match(sql,/CREATE OR REPLACE VIEW core_public_initiatives/);
 assert.match(sql,/CREATE OR REPLACE VIEW core_public_content/);
 assert.match(sql,/publication_approved_at IS NOT NULL/);
 assert.match(sql,/editorial_state='published'/);
 assert.match(sql,/CHECK\(NOT enabled OR/);
 assert.match(sql,/jfa_forbid_history_rewrite/);
});
