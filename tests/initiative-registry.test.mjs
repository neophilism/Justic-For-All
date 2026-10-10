import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {validateInitiativeRegistry} from "../scripts/lib/initiative-registry.mjs";

const manifest=JSON.parse(readFileSync(new URL("../config/initiative-registry.v1.json",import.meta.url),"utf8"));
const clone=()=>structuredClone(manifest);
test("canonical manifest validates with ten unique public entries",()=>{
 const valid=validateInitiativeRegistry(manifest);
 assert.equal(valid.initiatives.length,10);
 assert.equal(new Set(valid.initiatives.map(x=>x.slug)).size,10);
});
test("unexpected metadata and duplicate slugs fail closed",()=>{
 const extra=clone(); extra.initiatives[0].service_ref="https://private.internal"; assert.throws(()=>validateInitiativeRegistry(extra),/unsupported/);
 const dup=clone(); dup.initiatives[1].slug=dup.initiatives[0].slug; assert.throws(()=>validateInitiativeRegistry(dup),/Duplicate/);
});
test("static manifest may not claim pilot/live without independent review",()=>{
 for(const stage of ["pilot","live","available"]){
  const bogus=clone(); bogus.initiatives[0].status=stage;
  assert.throws(()=>validateInitiativeRegistry(bogus),/release process/);
 }
});
test("HTML injection, invalid slug, and version downgrade rejected",()=>{
 const a=clone(); a.initiatives[0].description="<img src=x onerror=alert(1)>"; assert.throws(()=>validateInitiativeRegistry(a),/HTML/);
 const b=clone(); b.initiatives[0].slug="../secret"; assert.throws(()=>validateInitiativeRegistry(b),/slug/);
 const c=clone(); c.schema_version=0; assert.throws(()=>validateInitiativeRegistry(c),/version/);
});
test("public API returns reviewed minimal fields only",()=>{
 const src=readFileSync(new URL("../apps/web/app/api/v1/initiatives/route.ts",import.meta.url),"utf8");
 assert.match(src,/slug, name, description, status/);
 assert.doesNotMatch(src,/email|serviceRef|contact/);
});
test("DB seed requires explicit apply and public-copy approval, never alters service status",()=>{
 const src=readFileSync(new URL("../packages/db/scripts/seed-initiatives.mjs",import.meta.url),"utf8");
 assert.match(src,/--approve-public-planning-copy/);
 assert.match(src,/--apply/);
 assert.match(src,/ON CONFLICT\(slug\)/);
 assert.doesNotMatch(src,/SET status|enabled=true|verification_state='verified'/);
});
