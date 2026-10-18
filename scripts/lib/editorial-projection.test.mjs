import test from 'node:test';
import assert from 'node:assert/strict';
import {projectPublishedEditorial} from './editorial-projection.mjs';
const doc={schema_version:1,entry_type:'article',slug:'example-article',locale:'en',
 title:'Example public article',summary:'A suitably described short public summary.',
 blocks:[{kind:'paragraph',runs:[{text:'A checked statement.',emphasis:'normal'}]}],media:[]};
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222';
const valid=()=>({visibility:'public',editorialState:'published',authorId:a,reviewerId:b,
 version:1,publishedAt:'2026-10-18T22:00:00.000Z',content:doc});
test('approved publication projects portable validated text and attribution',()=>{
 const result=projectPublishedEditorial(valid());
 assert.equal(result.document.slug,'example-article');assert.equal(result.version,1);
 assert.equal(result.authorId,a);assert.ok(Object.isFrozen(result));
});
test('draft withdrawn unreviewed or self-approved content cannot project',()=>{
 for(const patch of [{visibility:'private'},{visibility:'withdrawn'},
 {editorialState:'draft'},{reviewerId:a},{reviewerId:null},{version:0},
 {publishedAt:'bad date'},{content:{...doc,blocks:[]}}])
  assert.throws(()=>projectPublishedEditorial({...valid(),...patch}),/./);
});
