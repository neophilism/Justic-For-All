import assert from "node:assert/strict";
import test from "node:test";
import {validateEditorialDocument} from "../scripts/lib/editorial-doc.mjs";
const good=()=>({
 schema_version:1,entry_type:"article",slug:"sample-resource",locale:"en",
 title:"A clear public rights resource",summary:"A reviewed summary of general civic information",
 blocks:[{kind:"paragraph",runs:[{text:"Read the primary sources.",emphasis:"normal"},{text:" Ask questions.",emphasis:"strong"}]}],
 media:[{kind:"image",source_url:"https://example.org/source.jpg",alt:"Descriptive photograph metadata",caption:"Courtesy of the original publisher"}]
});
test("structured editorial documents validate without HTML or file bytes",()=>{
 const out=validateEditorialDocument(good());
 assert.equal(out.blocks[0].runs[1].emphasis,"strong");
 assert.notStrictEqual(out,good());
});
test("rejects executable markup, unknown content keys and dangerous media URLs",()=>{
 for(const inject of ["<script>alert(1)</script>","<img src=x>"]){
  const obj=good();obj.blocks[0].runs[0].text=inject;
  assert.throws(()=>validateEditorialDocument(obj),/Unsafe/);
 }
 const bad=good();bad.private_case="secret";assert.throws(()=>validateEditorialDocument(bad),/version\/keys/);
 const url=good();url.media[0].source_url="javascript:alert(1)";assert.throws(()=>validateEditorialDocument(url),/Unsafe|HTTPS/);
 const local=good();local.media[0].source_url="https://localhost/private";assert.throws(()=>validateEditorialDocument(local),/Unsafe/);
});
test("rejects unbounded body, unsupported types, malformed formats",()=>{
 const x=good();x.blocks=[...Array(90)].map(()=>x.blocks[0]);assert.throws(()=>validateEditorialDocument(x),/blocks/);
 const y=good();y.entry_type="personal-case";assert.throws(()=>validateEditorialDocument(y),/type/);
 const z=good();z.blocks[0].runs[0].emphasis="script";assert.throws(()=>validateEditorialDocument(z),/rich-text/);
});
