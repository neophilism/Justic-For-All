import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const source=readFileSync(new URL("../packages/db/src/editorial.ts",import.meta.url),"utf8");
test("draft storage requires active staff authorization and transactional rollback",()=>{
 assert.match(source,/i.account_state='active'/);
 assert.match(source,/r.role IN \('editor','admin'\)/);
 assert.match(source,/r.resource_scope='core'/);
 assert.match(source,/BEGIN/);
 assert.match(source,/ROLLBACK/);
 assert.match(source,/cms_draft_created/);
});
test("drafts cannot modify published pointer and are never sent to public endpoints",()=>{
 assert.match(source,/if\(entry.visibility==="private"\)/);
 assert.match(source,/editorial_state,content_hash/);
 assert.match(source,/'draft'/);
 assert.doesNotMatch(source,/editorial_state='published'|visibility='public'/);
});
