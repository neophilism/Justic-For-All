import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("roadmap evidence maps only explicitly verified merged PRs",()=>{
 const mapping=JSON.parse(read(".exechub/approved-pr-mapping.json"));
 const yaml=read(".exechub/project.yml");
 assert.equal(mapping.sourceRepository,"neophilism/Justic-For-All");
 assert.equal(mapping.roadmapVersion,1);
 assert.match(yaml,/planned_prs: 50/);
 assert.equal(mapping.pullRequestNumbers.length,50);
 const known=[1,2,3,4,5,6,7,12,14,15,16,17];
 assert.deepEqual(mapping.pullRequestNumbers.slice(0,12),known);
 assert.ok(mapping.pullRequestNumbers.slice(12).every(n=>n===null));
 const numbers=mapping.pullRequestNumbers.filter(n=>n!==null);
 assert.equal(numbers.length,new Set(numbers).size);
 assert.ok(numbers.every(n=>Number.isSafeInteger(n)&&n>0));
});
