import assert from "node:assert/strict";
import test from "node:test";
import {inspectEditorialImage,scanEditorialImage} from "../scripts/lib/editorial-upload.mjs";
const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFQAAAABJRU5ErkJggg==","base64");
test("small PNG requires a clean scanner verdict",async()=>{
 const info=inspectEditorialImage(png,"image/png");
 assert.equal(info.mime,"image/png");
 assert.equal(info.size,png.length);
 assert.match(info.sha256,/^[a-f0-9]{64}$/);
 assert.equal((await scanEditorialImage(png,"image/png",async()=>({verdict:"clean",scannerId:"test-scanner"}))).sha256,info.sha256);
 await assert.rejects(scanEditorialImage(png,"image/png",async()=>({verdict:"pending"})),/rejected/);
 await assert.rejects(scanEditorialImage(png,"image/png",undefined),/required/);
});
test("rejects disguised, oversized, active and malformed media",()=>{
 assert.throws(()=>inspectEditorialImage(png,"image/jpeg"),/mismatch/);
 assert.throws(()=>inspectEditorialImage(Buffer.from("<svg><script/></svg>"),"image/svg+xml"),/signature|size/);
 assert.throws(()=>inspectEditorialImage(Buffer.alloc(10*1024*1024+1),"image/png"),/size/);
 assert.throws(()=>inspectEditorialImage(Buffer.concat([png,Buffer.from("<script>")]),"image/png"),/structure/);
 const changed=Buffer.from(png);changed.writeUInt32BE(10001,16);
 assert.throws(()=>inspectEditorialImage(changed,"image/png"),/dimensions/);
});
