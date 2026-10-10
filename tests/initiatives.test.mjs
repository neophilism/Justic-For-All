import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
test("initiative registry includes truthful planning statuses", () => {
 const contents = readFileSync(new URL("../lib/initiatives.ts", import.meta.url),"utf8");
 assert.match(contents, /injustice-project/);
 assert.match(contents, /public-record/);
 assert.doesNotMatch(contents, /status: "live"/);
});
test("core homepage does not collect testimony", () => {
 const contents = readFileSync(new URL("../app/page.tsx", import.meta.url),"utf8");
 assert.match(contents,/Please do not send sensitive testimony/);
});
