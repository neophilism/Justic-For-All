import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createEditorialImage} from '../packages/db/src/editorial-media.ts';
import {scanEditorialImage} from '../scripts/lib/editorial-upload.mjs';

const png=()=>Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGP4DwQACfsD/fteaysAAAAASUVORK5CYII=','base64');
const actor='00000000-0000-4000-8000-000000000001';
const digest=b=>createHash('sha256').update(b).digest('hex');
const clean=async()=>({verdict:'clean',scannerId:'test-scanner'});
function dependencies({allowed=true,failQuery,putError}={}){
 const queries=[],puts=[],deletes=[];
 return {queries,puts,deletes,client:{query:async(sql,values)=>{
  queries.push({sql,values});if(failQuery&&sql.includes(failQuery))throw new Error('synthetic query failure');
  return {rows:[{allowed}]};
 }},store:{putPrivate:async(key,bytes,mime)=>{if(putError)throw new Error('synthetic storage failure');puts.push({key,bytes:Buffer.from(bytes),mime});},deletePrivate:async key=>{deletes.push(key);}}};
}

test('upload snapshots caller bytes before asynchronous scanning and isolates retained scanner buffers',async()=>{
 const input=png(),original=Buffer.from(input),d=dependencies();let scannerBytes;
 const result=await createEditorialImage(d.client,actor,input,'image/png',async bytes=>{
  scannerBytes=bytes;input.fill(0);return {verdict:'clean',scannerId:'test-scanner'};
 },d.store);
 scannerBytes.fill(0);
 assert.deepEqual(d.puts[0].bytes,original);assert.equal(result.sha256,digest(original));
 const insert=d.queries.find(x=>x.sql.includes('INSERT INTO cms_media_assets'));
 assert.equal(insert.values[5],digest(d.puts[0].bytes));assert.equal(d.queries.at(-1).sql,'COMMIT');
});
test('scanner mutation fails closed before any database or storage effects',async()=>{
 const input=png(),original=Buffer.from(input),d=dependencies();
 await assert.rejects(createEditorialImage(d.client,actor,input,'image/png',async bytes=>{
  bytes[25]^=1;return {verdict:'clean',scannerId:'test-scanner'};
 },d.store),/changed during scan/);
 assert.deepEqual(input,original);assert.equal(d.queries.length,0);assert.equal(d.puts.length,0);
});
test('standalone scanner receives an isolated buffer and detects content replacement',async()=>{
 const input=png(),original=Buffer.from(input);
 await assert.rejects(scanEditorialImage(input,'image/png',async b=>{b.fill(0);return {verdict:'clean',scannerId:'test-scanner'};}),/changed during scan/);
 assert.deepEqual(input,original);
});
test('unauthorized editor cannot store bytes and transaction is rolled back',async()=>{
 const d=dependencies({allowed:false});
 await assert.rejects(createEditorialImage(d.client,actor,png(),'image/png',clean,d.store),/authorization required/);
 assert.equal(d.puts.length,0);assert.equal(d.queries.at(-1).sql,'ROLLBACK');
});
test('database insert failure removes the staged object after rollback',async()=>{
 const d=dependencies({failQuery:'INSERT INTO cms_media_assets'});
 await assert.rejects(createEditorialImage(d.client,actor,png(),'image/png',clean,d.store),/synthetic query failure/);
 assert.equal(d.puts.length,1);assert.deepEqual(d.deletes,[d.puts[0].key]);assert.equal(d.queries.at(-1).sql,'ROLLBACK');
});
test('storage failure never inserts an asset or commits',async()=>{
 const d=dependencies({putError:true});
 await assert.rejects(createEditorialImage(d.client,actor,png(),'image/png',clean,d.store),/synthetic storage failure/);
 assert.equal(d.queries.some(x=>x.sql.includes('INSERT')),false);assert.equal(d.queries.at(-1).sql,'ROLLBACK');
});
test('uncertain commit preserves staged object for reconciliation',async()=>{
 const d=dependencies({failQuery:'COMMIT'});
 await assert.rejects(createEditorialImage(d.client,actor,png(),'image/png',clean,d.store),/synthetic query failure/);
 assert.equal(d.puts.length,1);assert.equal(d.deletes.length,0);assert.equal(d.queries.at(-1).sql,'COMMIT');
});
