import test from "node:test";
import assert from "node:assert/strict";
import {projectPublishedEditorial} from "../scripts/lib/editorial-projection.mjs";
const doc={schema_version:1,entry_type:"article",slug:"example-article",locale:"en",
 title:"Example public article",summary:"A suitably described short public summary.",
 blocks:[{kind:"paragraph",runs:[{text:"A checked statement.",emphasis:"normal"}]}],media:[]};
const author="11111111-1111-4111-8111-111111111111";
const reviewer="22222222-2222-4222-8222-222222222222";
const row=()=>({visibility:"public",editorialState:"published",authorId:author,reviewerId:reviewer,
 version:2,publishedAt:"2026-10-18T22:00:00.000Z",content:doc});
test("projects only validated published content with separate attribution",()=>{
 const result=projectPublishedEditorial(row());
 assert.equal(result.document.slug,"example-article");
 assert.equal(result.authorId,author);
 assert.equal(result.reviewerId,reviewer);
});
test("draft, withdrawn, self-reviewed and unsafe content fail closed",()=>{
 for(const patch of [{visibility:"private"},{visibility:"withdrawn"},{editorialState:"draft"},
  {reviewerId:author},{version:0},{publishedAt:"bad date"},
  {content:{...doc,blocks:[{kind:"paragraph",runs:[{text:"<script>",emphasis:"normal"}]}]}}]){
  assert.throws(()=>projectPublishedEditorial({...row(),...patch}));
 }
});
