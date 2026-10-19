import assert from "node:assert/strict";
import test from "node:test";
import {editorialTransition} from "../scripts/lib/editorial-review.mjs";
const author="11111111-1111-4111-8111-111111111111";
const reviewerA="22222222-2222-4222-8222-222222222222";
const reviewerB="33333333-3333-4333-8333-333333333333";
const draft={state:"draft",authorId:author,highRisk:true,approverIds:[],version:1};
test("high-risk content needs two distinct nonauthor reviewers",()=>{
 let next=editorialTransition(draft,"submit",{actorId:author,expectedVersion:1});
 assert.equal(next.state,"in_review");
 assert.throws(()=>editorialTransition(next,"approve",{actorId:author,expectedVersion:2}));
 next=editorialTransition(next,"approve",{actorId:reviewerA,expectedVersion:2});
 assert.equal(next.state,"in_review");
 assert.throws(()=>editorialTransition(next,"approve",{actorId:reviewerA,expectedVersion:3}));
 assert.throws(()=>editorialTransition(next,"publish",{actorId:reviewerB,expectedVersion:3}));
 next=editorialTransition(next,"approve",{actorId:reviewerB,expectedVersion:3});
 assert.equal(next.state,"approved");
 assert.throws(()=>editorialTransition(next,"publish",{actorId:author,expectedVersion:4}));
 next=editorialTransition(next,"publish",{actorId:reviewerA,expectedVersion:4});
 assert.equal(editorialTransition(next,"withdraw",{actorId:reviewerB,expectedVersion:5}).state,"withdrawn");
});
test("stale, malformed and duplicate transitions fail closed",()=>{
 const submitted=editorialTransition(draft,"submit",{actorId:author,expectedVersion:1});
 assert.throws(()=>editorialTransition(submitted,"approve",{actorId:reviewerA,expectedVersion:1}));
 assert.throws(()=>editorialTransition(submitted,"submit",{actorId:author,expectedVersion:2}));
 const approved=editorialTransition({...submitted,highRisk:false},"approve",{actorId:reviewerA,expectedVersion:2});
 assert.throws(()=>editorialTransition(approved,"approve",{actorId:reviewerB,expectedVersion:3}));
 assert.throws(()=>editorialTransition({...approved,approverIds:[reviewerA,reviewerA]},"publish",{actorId:reviewerB,expectedVersion:3}));
});
