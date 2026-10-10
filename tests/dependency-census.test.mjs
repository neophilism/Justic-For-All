import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const catalog=JSON.parse(readFileSync(new URL("../config/dependency-census.json",import.meta.url),"utf8"));
test("dependency evidence is complete and pinned to immutable revisions",()=>{
 assert.equal(catalog.dependencies.length,6);
 assert.equal(new Set(catalog.dependencies.map(d=>d.id)).size,6);
 for(const d of catalog.dependencies){
  assert.match(d.repository,/^neophilism\/[A-Za-z0-9_.-]+$/);
  assert.match(d.sourceCommit,/^[a-f0-9]{40}$/);
  assert.equal(d.licenseSpdx,null);
  assert.equal(d.runtimeVerified,false);
  assert.equal(d.productionPermissionVerified,false);
  assert.equal(d.readyForSensitiveIntegration,false);
  assert.ok(d.verifiedSourceDocuments.length>0);
  for(const link of d.verifiedSourceDocuments){ assert.ok(link.startsWith("https://github.com/"+d.repository+"/blob/"+d.sourceCommit+"/")); }
 }
});
test("source census does not assign guessed runtime hosts",()=>{
 for(const d of catalog.dependencies){ assert.equal(Object.hasOwn(d,"runtimeBaseUrl"),false); }
});
