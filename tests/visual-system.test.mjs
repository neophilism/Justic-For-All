import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const css=readFileSync(new URL("../apps/web/app/styles.css",import.meta.url),"utf8");
const ui=readFileSync(new URL("../packages/ui/src/index.tsx",import.meta.url),"utf8");
const guide=readFileSync(new URL("../apps/web/app/design-system/page.tsx",import.meta.url),"utf8");
const token=(n)=>{const m=css.match(new RegExp("--"+n+":\\s*(#[0-9a-f]{6})","i"));assert.ok(m,"missing "+n);return m[1];};
const lin=(u)=>{u/=255;return u<=0.04045?u/12.92:((u+0.055)/1.055)**2.4};
const luminance=(h)=>0.2126*lin(parseInt(h.slice(1,3),16))+0.7152*lin(parseInt(h.slice(3,5),16))+0.0722*lin(parseInt(h.slice(5,7),16));
const contrast=(a,b)=>{const [x,y]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (x+0.05)/(y+0.05)};
test("core text and actionable accents meet AA normal-text contrast",()=>{
 assert.ok(contrast(token("ink"),token("canvas"))>=4.5);
 assert.ok(contrast(token("muted"),token("canvas"))>=4.5);
 assert.ok(contrast(token("accent-ink"),token("accent"))>=4.5);
 assert.ok(contrast(token("link"),token("canvas"))>=4.5);
});
test("focus, reduced motion and forced colors are documented in CSS",()=>{
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/forced-colors: active/);
 assert.match(css,/min-height:44px/);
});
test("controls require visible labels and descriptive non-color status",()=>{
 assert.match(ui,/htmlFor=\{id\}/);
 assert.match(ui,/aria-describedby=\{hintId\}/);
 assert.match(ui,/Planning/);
 assert.match(ui,/Unavailable/);
});
test("style showcase never offers an active fake submission",()=>{
 assert.match(guide,/visual examples only/i);
 assert.match(guide,/<ActionButton disabled/);
 assert.match(guide,/disabled placeholder=/);
});
