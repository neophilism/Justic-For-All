import assert from "node:assert/strict";
import test from "node:test";
import { scanContents } from "../scripts/scan-secrets.mjs";

test("scanner flags common credential forms without logging bytes",()=>{
 assert.ok(scanContents(["ghp_","a".repeat(36)].join("")).includes("github-personal-access-token"));
 assert.ok(scanContents(["npg_","Z".repeat(24)].join("")).includes("neon-credential"));
 assert.deepEqual(scanContents("No credential-bearing data here."),[]);
});
