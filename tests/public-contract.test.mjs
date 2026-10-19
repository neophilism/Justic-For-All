import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const spec=JSON.parse(readFileSync(new URL("../packages/contracts/openapi/public-v1.json",import.meta.url),"utf8"));
test("published API surface has valid 3.1 contract skeleton and operation IDs",()=>{
 assert.equal(spec.openapi,"3.1.0");
 assert.equal(spec.info.version,"1.0.0");
 const operations=Object.values(spec.paths).flatMap(p=>Object.entries(p).filter(([method])=>["get","post","patch","delete","put"].includes(method)).map(([,v])=>v.operationId));
 assert.equal(operations.length,new Set(operations).size);
 assert.ok(operations.length>=5);
 for(const path of Object.keys(spec.paths)){assert.ok(path.startsWith("/"));}
});
test("schema references resolve and no private mutation is advertised",()=>{
 const schemas=spec.components.schemas;
 for(const path of Object.values(spec.paths)){
  for(const operation of Object.values(path)){
   const value=JSON.stringify(operation);
   for(const match of value.matchAll(/#\/components\/schemas\/([A-Za-z0-9_]+)/g)){assert.ok(schemas[match[1]],match[1]);}
  }
 }
 assert.ok(!Object.keys(spec.paths).some(p=>p.includes("/me")||p.includes("content-reports")||p.includes("interest")));
 assert.equal(Object.keys(spec.paths).length,6);
});
test("private data is never exposed through the public initiatives projection",()=>{
 const src=readFileSync(new URL("../apps/web/app/api/v1/initiatives/route.ts",import.meta.url),"utf8");
 assert.match(src,/slug, name, description, status/);
 assert.doesNotMatch(src,/email|identity|private_case|service_ref/);
});

test("published editorial contract exposes only safe read fields",()=>{
 const article=spec.paths["/api/v1/articles"].get;
 assert.equal(article.operationId,"getPublishedArticle");
 assert.ok(article.responses["404"]&&article.responses["503"]);
 const publicKeys=Object.keys(spec.components.schemas.PublicEditorial.properties);
 for(const key of ["authorLabel","reviewerLabel","publishedAt","reviewedAt","verificationLabel"])assert.ok(publicKeys.includes(key));
 assert.ok(!publicKeys.some(key=>/identity|authorId|reviewerId|content_hash|workflow/i.test(key)));
});
