import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const registry=JSON.parse(read("config/security-boundaries.json"));
test("assurance status is explicit and does not imply approval",()=>{
 assert.equal(registry.reference.conformanceClaim,"none");
 assert.equal(registry.reference.independentReview,false);
 assert.equal(registry.assurance.productionConformance,"unassessed");
 assert.match(registry.reference.commit,/^[0-9a-f]{40}$/);
});
test("every flow has unique ID, classification, evidence and risk references",()=>{
 const f=registry.flows,r=registry.threats;
 assert.equal(f.length,11);
 assert.equal(r.length,8);
 assert.equal(new Set(f.map(x=>x.id)).size,f.length);
 assert.equal(new Set(r.map(x=>x.id)).size,r.length);
 const risks=new Set(r.map(x=>x.id));
 const allowedClasses=new Set(["PUBLIC_APPROVED","EDITORIAL_DRAFT","INTERNAL_OPERATIONS","PERSONAL_RESTRICTED","HIGH_RISK_CONFIDENTIAL","PUBLIC_REPLICATED"]);
 for(const item of f){
  assert.ok(allowedClasses.has(item.dataClass));
  assert.ok(item.evidence.length>0);
  assert.ok(item.controls.length>0);
  assert.ok(item.profileState);
  assert.ok(item.keyAuthority.length>10);
  assert.ok(item.metadata.length>10);
  for(const id of item.riskRefs)assert.ok(risks.has(id));
  if(item.protectedContent)assert.notEqual(item.profileState,"not_applicable_documented");
 }
});
test("high-risk testimony and public replication are disabled with review gates",()=>{
 const intake=registry.flows.find(f=>f.id==="F07"),replica=registry.flows.find(f=>f.id==="F10");
 assert.equal(intake.state,"blocked");
 assert.equal(replica.state,"blocked");
 assert.ok(replica.controls.includes("no-restricted-content"));
 assert.ok(intake.controls.includes("no-generic-intake-form"));
});
test("current public implementation has no private serialization promise",()=>{
 const publicEntries=registry.flows.filter(x=>x.state==="implemented"&&x.dataClass==="PUBLIC_APPROVED");
 assert.ok(publicEntries.length>=2);
 assert.ok(publicEntries.every(x=>x.protectedContent===false));
 const src=read("apps/web/app/api/v1/initiatives/route.ts");
 assert.doesNotMatch(src,/identity_id|contact_points|private_case/);
});
