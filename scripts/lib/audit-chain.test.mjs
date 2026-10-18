import test from 'node:test';
import assert from 'node:assert/strict';
import {auditDigest,verifyAuditChain} from './audit-chain.mjs';
const prior='0'.repeat(64);
const row={previousHash:prior,sequence:1,action:'cms_reviewed',actorRef:'actor:123',
 resourceRef:'cms:456',result:'allow'};
test('immutable event descriptor chains and detects reordering or tampering',()=>{
 const event={...row,digest:auditDigest(row)};
 assert.equal(verifyAuditChain([event]),true);
 assert.equal(verifyAuditChain([{...event,result:'deny'}]),false);
 assert.equal(verifyAuditChain([{...event,sequence:2}]),false);
 assert.equal(verifyAuditChain([event,event]),false);
});
test('raw content and unknown actions cannot enter audit digest',()=>{
 assert.throws(()=>auditDigest({...row,action:'story_contents'}));
 assert.throws(()=>auditDigest({...row,resourceRef:'confidential story text'}));
});
