import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import test from "node:test";
const read=(path)=>JSON.parse(readFileSync(new URL("../"+path, import.meta.url),"utf8"));
test("pnpm workspace is pinned and owns exactly one web entrypoint",()=>{
 const root=read("package.json");
 assert.equal(root.packageManager,"pnpm@10.18.3");
 assert.equal(read("apps/web/package.json").name,"@jfa/web");
 assert.equal(existsSync(new URL("../apps/web/app/page.tsx", import.meta.url)),true);
 assert.equal(existsSync(new URL("../app/page.tsx", import.meta.url)),false);
});
test("core packages enforce typed, local boundaries",()=>{
 const expected=["core","contracts","ui","adapters","security"];
 for(const item of expected){assert.equal(read("packages/"+item+"/package.json").name,"@jfa/"+item);}
 assert.equal(read("apps/worker/package.json").name,"@jfa/worker");
});
