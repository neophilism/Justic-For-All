/** Pure core permission predicate, never a substitute for authenticated identity.
 * Routes must load trusted server-side subject and grants, not client claims. */
const ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ACTIONS=new Set(['cms.read_draft','cms.create_draft','cms.review','cms.publish','cms.withdraw']);
const ROLE_ACTIONS={editor:new Set(['cms.read_draft','cms.create_draft']),
 reviewer:new Set(['cms.read_draft','cms.review']),admin:new Set([...ACTIONS])};
export function authorizeCoreAction({subjectId,active,grants,action,resourceScope,resourceId,nowMs}={}) {
 if(!ID.test(subjectId||'')||active!==true||!ACTIONS.has(action)||
  !['core','organization'].includes(resourceScope)||!ID.test(resourceId||'')||
  !Number.isSafeInteger(nowMs)||!Array.isArray(grants)||grants.length>100)return false;
 return grants.some(grant=>grant&&typeof grant==='object'&&
  ROLE_ACTIONS[grant.role]?.has(action)===true&&grant.subjectId===subjectId&&
  grant.scope===resourceScope&&grant.resourceId===resourceId&&
  (grant.expiresAtMs===null||(Number.isSafeInteger(grant.expiresAtMs)&&grant.expiresAtMs>nowMs)));
}
