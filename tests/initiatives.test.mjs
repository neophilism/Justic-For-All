import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
test("initiative registry includes truthful planning statuses", () => {
 const source=readFileSync(new URL("../packages/core/src/index.ts", import.meta.url),"utf8");
 assert.match(source,/injustice-project/);
 assert.match(source,/public-record/);
 assert.doesNotMatch(source,/status:"available"/);
});
test("public homepage does not solicit confidential testimony",()=>{
 const source=readFileSync(new URL("../apps/web/app/page.tsx", import.meta.url),"utf8");
 assert.match(source,/Please do not send sensitive testimony/);
});
