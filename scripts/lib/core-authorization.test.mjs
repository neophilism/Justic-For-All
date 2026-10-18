import test from 'node:test';
import assert from 'node:assert/strict';
import {authorizeCoreAction} from './core-authorization.mjs';
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222';
const valid=()=>({subjectId:a,active:true,action:'cms.create_draft',resourceScope:'core',
 resourceId:b,nowMs:1000,grants:[{subjectId:a,role:'editor',scope:'core',resourceId:b,expiresAtMs:2000}]});
test('only active scoped subject grants authorize resource action',()=>{
 assert.equal(authorizeCoreAction(valid()),true);
 for(const patch of [{subjectId:b},{active:false},{resourceId:a},
 {action:'cms.publish'},{nowMs:2000},{action:'unknown'}])
  assert.equal(authorizeCoreAction({...valid(),...patch}),false);
});
test('foreign organization and forged role are denied',()=>{
 const args=valid();
 assert.equal(authorizeCoreAction({...args,grants:[{...args.grants[0],scope:'organization'}]}),false);
 assert.equal(authorizeCoreAction({...args,grants:[{...args.grants[0],role:'superadmin'}]}),false);
 assert.equal(authorizeCoreAction({...args,grants:[{...args.grants[0],subjectId:b}]}),false);
});
