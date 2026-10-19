import test from 'node:test';
import assert from 'node:assert/strict';
import {editorialTransition} from './editorial-review.mjs';
const ids=['11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333'];
const initial=highRisk=>({state:'draft',authorId:ids[0],highRisk,approverIds:[],version:1});
test('high risk requires two distinct nonauthor approvals before publishing',()=>{
 let s=editorialTransition(initial(true),'submit',{actorId:ids[0],expectedVersion:1});
 assert.throws(()=>editorialTransition(s,'approve',{actorId:ids[0],expectedVersion:2}));
 s=editorialTransition(s,'approve',{actorId:ids[1],expectedVersion:2});
 assert.equal(s.state,'in_review');
 assert.throws(()=>editorialTransition(s,'approve',{actorId:ids[1],expectedVersion:3}));
 s=editorialTransition(s,'approve',{actorId:ids[2],expectedVersion:3});
 assert.equal(s.state,'approved');
 assert.throws(()=>editorialTransition(s,'publish',{actorId:ids[0],expectedVersion:4}));
 s=editorialTransition(s,'publish',{actorId:ids[1],expectedVersion:4});
 assert.equal(editorialTransition(s,'withdraw',{actorId:ids[2],expectedVersion:5}).state,'withdrawn');
});
test('stale revisions and duplicate publication transitions fail closed',()=>{
 let s=editorialTransition(initial(false),'submit',{actorId:ids[0],expectedVersion:1});
 assert.throws(()=>editorialTransition(s,'approve',{actorId:ids[1],expectedVersion:1}));
 s=editorialTransition(s,'approve',{actorId:ids[1],expectedVersion:2});
 s=editorialTransition(s,'publish',{actorId:ids[1],expectedVersion:3});
 assert.throws(()=>editorialTransition(s,'publish',{actorId:ids[1],expectedVersion:4}));
});
