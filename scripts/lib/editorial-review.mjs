/** Pure editorial transition policy only. Callers must authenticate actors and
 * transact state, approvals and audit records in PostgreSQL. No public writes. */
const ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STATES=new Set(['draft','in_review','approved','published','rejected','withdrawn']);
const ACTIONS=new Set(['submit','approve','revoke','reject','publish','withdraw']);
const fail=()=>{throw new TypeError('Invalid editorial transition');};
export function editorialTransition(current, action, {actorId,expectedVersion}={}) {
 if(!current||typeof current!=='object'||Array.isArray(current)||
   !STATES.has(current.state)||!ACTIONS.has(action)||!ID.test(actorId||'')||
   !ID.test(current.authorId||'')||!Number.isSafeInteger(current.version)||
   current.version<1||current.version!==expectedVersion||
   typeof current.highRisk!=='boolean'||!Array.isArray(current.approverIds)||
   current.approverIds.length>2||new Set(current.approverIds).size!==current.approverIds.length||
   current.approverIds.some(id=>!ID.test(id)||id===current.authorId))fail();
 let next=current.state,approvers=[...current.approverIds];
 if(action==='submit'&&current.state==='draft')next='in_review';
 else if(action==='approve'&&current.state==='in_review'){
   if(actorId===current.authorId||approvers.includes(actorId))fail();
   approvers.push(actorId);
   if(approvers.length >= (current.highRisk?2:1))next='approved';
 } else if(action==='revoke'&&['in_review','approved'].includes(current.state)&&approvers.includes(actorId)){
   approvers=approvers.filter(id=>id!==actorId);
   next='in_review';
 } else if(action==='reject'&&current.state==='in_review'&&actorId!==current.authorId)next='rejected';
 else if(action==='publish'&&current.state==='approved'&&
   approvers.length >= (current.highRisk?2:1)&&actorId!==current.authorId)next='published';
 else if(action==='withdraw'&&current.state==='published')next='withdrawn';
 else fail();
 return Object.freeze({state:next,authorId:current.authorId,highRisk:current.highRisk,
   approverIds:Object.freeze(approvers),version:current.version+1});
}
