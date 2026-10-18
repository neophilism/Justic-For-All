/** Pure consent policy: a live server must authenticate subject and read records
 * from an append-only ledger under transaction. Never trust browser-supplied grants. */
const PURPOSE=/^[a-z][a-z0-9_]{1,63}$/;
const VERSION=/^[a-zA-Z0-9._-]{1,64}$/;
export function hasCurrentConsent(records,{subjectRef,purpose,scope,policyVersion}={}) {
 if(typeof subjectRef!=='string'||!subjectRef||!PURPOSE.test(purpose||'')||
  !PURPOSE.test(scope||'')||!VERSION.test(policyVersion||'')||
  !Array.isArray(records)||records.length>10000)return false;
 const matching=records.filter(r=>r&&r.subjectRef===subjectRef&&r.purpose===purpose&&r.scope===scope);
 if(!matching.length||matching.some(r=>!Number.isSafeInteger(r.sequence)||r.sequence<1||
   !['grant','withdraw'].includes(r.decision)||typeof r.policyVersion!=='string'))return false;
 matching.sort((a,b)=>b.sequence-a.sequence);
 if(matching.length>1&&matching[0].sequence===matching[1].sequence)return false;
 return matching[0].decision==='grant'&&matching[0].policyVersion===policyVersion;
}
