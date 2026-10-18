import {createHash} from 'node:crypto';
const HEX=/^[0-9a-f]{64}$/;
const ACTIONS=new Set(['cms_draft_created','cms_reviewed','cms_published','cms_withdrawn','consent_granted','consent_withdrawn']);
const TOKEN=/^[a-zA-Z0-9_:-]{1,128}$/;
export function auditDigest({previousHash,sequence,action,actorRef,resourceRef,result}={}) {
 if(!HEX.test(previousHash||'')||!Number.isSafeInteger(sequence)||sequence<1||
  !ACTIONS.has(action)||!TOKEN.test(actorRef||'')||!TOKEN.test(resourceRef||'')||
  !['allow','deny'].includes(result))throw new TypeError('Invalid audit descriptor');
 const canonical=JSON.stringify([previousHash,sequence,action,actorRef,resourceRef,result]);
 return createHash('sha256').update(canonical,'utf8').digest('hex');
}
/** Integrity only: caller must enforce append-only database grants, chain head
 * transaction locks and trusted actor binding. Never log private source text. */
export function verifyAuditChain(records,{genesisHash='0'.repeat(64)}={}) {
 if(!HEX.test(genesisHash)||!Array.isArray(records)||records.length>100000)return false;
 let head=genesisHash,seq=0;
 for(const record of records){
  if(!record||record.sequence!==++seq||record.previousHash!==head)return false;
  try{const digest=auditDigest(record);if(digest!==record.digest)return false;head=digest;}
  catch{return false;}
 }
 return true;
}
