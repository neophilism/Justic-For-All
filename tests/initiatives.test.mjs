import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

test("initiative registry has approved public names in planning stage",()=>{
  const source=JSON.parse(readFileSync(new URL("../config/initiative-registry.v1.json",import.meta.url),"utf8"));
  assert.equal(source.schema_version,1);
  assert.equal(source.initiatives.length,10);
  assert.ok(source.initiatives.some(item=>item.slug==="injustice-project"));
  assert.ok(source.initiatives.some(item=>item.slug==="public-record"));
  assert.ok(source.initiatives.every(item=>item.status==="planning"));
});
test("public homepage does not solicit confidential testimony",()=>{
  const source=readFileSync(new URL("../apps/web/app/page.tsx",import.meta.url),"utf8");
  assert.match(source,/Please do not send sensitive testimony/);
});
