import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("draft editor is a disconnected local component, not a public HTTP endpoint",()=>{
 const source=read("apps/web/components/editorial-draft-editor.tsx");
 assert.match(source,/"use client"/);
 assert.match(source,/disabled=\{!onSave\|\|!validation.ok\|\|saving\}/);
 assert.match(source,/onSave\(validation.document\)/);
 assert.match(source,/authenticated administrator/);
 assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|FormData\(|dangerouslySetInnerHTML/);
});
test("preview renders structured data as React text rather than HTML, images or iframes",()=>{
 const source=read("apps/web/components/editorial-document-preview.tsx");
 assert.match(source,/aria-label="Editorial draft preview"/);
 assert.match(source,/run.text/);
 assert.doesNotMatch(source,/dangerouslySetInnerHTML|<iframe|<img|<video/);
});
