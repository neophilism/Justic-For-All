import test from 'node:test';
import assert from 'node:assert/strict';
import {hasCurrentConsent} from './consent-policy.mjs';
const consent={subjectRef:'user-1',purpose:'newsletter',scope:'email',policyVersion:'v1',decision:'grant',sequence:1};
const check=(rows,overrides={})=>hasCurrentConsent(rows,{subjectRef:'user-1',purpose:'newsletter',scope:'email',policyVersion:'v1',...overrides});
test('only newest exact-purpose exact-version consent grants optional processing',()=>{
 assert.equal(check([consent]),true);
 assert.equal(check([consent],{purpose:'analytics'}),false);
 assert.equal(check([consent],{policyVersion:'v2'}),false);
 assert.equal(check([consent],{scope:'sms'}),false);
 assert.equal(check([consent,{...consent,decision:'withdraw',sequence:2}]),false);
 assert.equal(check([consent,{...consent,policyVersion:'v2',sequence:2}]),false);
});
test('conflicting ledger ordering and invalid records deny consent',()=>{
 assert.equal(check([consent,{...consent,sequence:1}]),false);
 assert.equal(check([{...consent,decision:'unexpected'}]),false);
 assert.equal(check([]),false);
});
