import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";
import test from "node:test";

const src = (p) => readFileSync(new URL("../" + p, import.meta.url),"utf8");
const routes = [
  "/","/about","/stories","/records","/principles","/initiatives","/get-involved","/privacy","/terms"
];
test("all listed core public pages have implemented routes", () => {
  for (const route of routes) {
    const p = route === "/" ? "apps/web/app/page.tsx" : `apps/web/app${route}/page.tsx`;
    assert.equal(existsSync(resolve(process.cwd(),p)),true,p);
  }
});
test("public home offers three real informational paths and explicitly rejects sensitive input", () => {
  const home = src("apps/web/app/page.tsx");
  const content = src("apps/web/content/editorial.ts");
  assert.match(home,/journeyCopy\.map/);
  assert.match(content,/href: "\/stories"/);
  assert.match(content,/href: "\/records"/);
  assert.match(content,/href: "\/get-involved"/);
  assert.match(home,/Please do not send sensitive testimony/);
  assert.doesNotMatch(home,/<form|type="submit"|autoSubmit/i);
});
test("public pages include people without allegations or political affiliations", () => {
  const about=src("apps/web/app/about/page.tsx");
  const homepage=src("apps/web/app/page.tsx");
  assert.match(about,/People do not need to have been arrested/);
  assert.match(about,/does not require a party membership/);
  assert.match(homepage,/you do not need/i);
});
test("pages do not pretend sensitive services are available", () => {
  const stories=src("apps/web/app/stories/page.tsx");
  const records=src("apps/web/app/records/page.tsx");
  const involved=src("apps/web/app/get-involved/page.tsx");
  assert.match(stories,/not available yet/i);
  assert.match(records,/not been activated/i);
  assert.match(involved,/Registration is not open/);
  for(const item of [stories,records,involved]) assert.doesNotMatch(item,/<form|type="submit"/i);
});
