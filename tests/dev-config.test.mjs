import assert from "node:assert/strict";
import test from "node:test";
import { parseDatabaseUrl } from "../packages/db/src/config.mjs";

test("DB is unconfigured by default",()=>{
 assert.deepEqual(parseDatabaseUrl(undefined),{ok:false,reason:"unconfigured"});
});
test("invalid URLs are rejected without being repeated",()=>{
 const bad=parseDatabaseUrl("postgresql://secret:password@");
 assert.equal(bad.ok,false);
 assert.ok(!JSON.stringify(bad).includes("password"));
});
test("local fixture permitted in development but production requires TLS mode",()=>{
 const uri="postgresql://dev:secret@127.0.0.1:55432/jfa_dev";
 assert.equal(parseDatabaseUrl(uri,"development").ok,true);
 assert.equal(parseDatabaseUrl(uri,"production").ok,false);
 assert.equal(parseDatabaseUrl(uri+"?sslmode=require","production").ok,true);
});
test("non-postgres URL and URL without database rejected",()=>{
 assert.equal(parseDatabaseUrl("https://example.com/db").ok,false);
 assert.equal(parseDatabaseUrl("postgresql://user:pass@example.com/").ok,false);
});
