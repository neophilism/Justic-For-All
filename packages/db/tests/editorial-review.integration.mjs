import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import test from "node:test";
import pg from "pg";
import {submitEditorialReview,transitionEditorialReview,loadEditorialReviewPreview} from "../src/editorial-review.ts";

test("editorial review publishes only two-person approved content and withdraws projections",async()=>{
 if(!process.env.PGPASSWORD)throw new Error("Disposable PostgreSQL test password required");
 const client=new pg.Client({host:process.env.PGHOST??"localhost",port:Number(process.env.PGPORT??5432),
  user:process.env.PGUSER??"jfa_ci",database:process.env.PGDATABASE??"jfa_ci",password:process.env.PGPASSWORD});
 await client.connect();
 try{
  const author=randomUUID(),reviewerA=randomUUID(),reviewerB=randomUUID(),disabled=randomUUID(),entry=randomUUID();
  const slug="synthetic-review-"+randomUUID().slice(0,8);
  const doc={schema_version:1,entry_type:"article",slug,locale:"en",
   title:"A reviewed information article",summary:"A general rights information summary",
   blocks:[{kind:"paragraph",runs:[{text:"Review before publishing.",emphasis:"normal"}]}],media:[]};
  for(const id of [author,reviewerA,reviewerB])await client.query("INSERT INTO identities(id) VALUES($1)",[id]);
  await client.query("INSERT INTO identities(id,account_state) VALUES($1,'disabled')",[disabled]);
  for(const [id,role] of [[author,"editor"],[reviewerA,"reviewer"],[reviewerA,"editor"],
   [reviewerB,"reviewer"],[reviewerB,"admin"],[disabled,"reviewer"]]){
   await client.query("INSERT INTO role_grants(subject_id,role,resource_scope) VALUES($1,$2,'core')",[id,role]);
  }
  await client.query(`INSERT INTO cms_entries(id,entry_type,slug,locale,visibility,current_revision)
   VALUES($1,'article',$2,'en','private',1)`,[entry,slug]);
  await client.query(`INSERT INTO cms_revisions(entry_id,version,content,author_id,editorial_state,content_hash)
   VALUES($1,1,$2::jsonb,$3,'draft',$4)`,[entry,JSON.stringify(doc),author,"a".repeat(64)]);
  const submitted=await submitEditorialReview(client,author,entry,1);
  assert.equal((await loadEditorialReviewPreview(client,reviewerA,submitted.workflowId)).document.title,doc.title);
  await assert.rejects(loadEditorialReviewPreview(client,disabled,submitted.workflowId));
  await assert.rejects(transitionEditorialReview(client,author,submitted.workflowId,"approve",2));
  await transitionEditorialReview(client,reviewerA,submitted.workflowId,"approve",2);
  await assert.rejects(transitionEditorialReview(client,reviewerA,submitted.workflowId,"publish",3));
  await transitionEditorialReview(client,reviewerB,submitted.workflowId,"approve",3);
  await transitionEditorialReview(client,reviewerA,submitted.workflowId,"revoke",4);
  await assert.rejects(transitionEditorialReview(client,reviewerA,submitted.workflowId,"publish",5));
  await transitionEditorialReview(client,reviewerA,submitted.workflowId,"approve",5);
  await transitionEditorialReview(client,reviewerA,submitted.workflowId,"publish",6);
  assert.equal((await client.query("SELECT count(*)::int AS n FROM core_public_content WHERE slug=$1",[slug])).rows[0].n,1);
  assert.equal((await client.query(`SELECT count(*)::int AS n FROM public_projections
   WHERE source_ref=$1 AND release_state='published'`,[`cms:${entry}`])).rows[0].n,1);
  await transitionEditorialReview(client,reviewerB,submitted.workflowId,"withdraw",7);
  assert.equal((await client.query("SELECT count(*)::int AS n FROM core_public_content WHERE slug=$1",[slug])).rows[0].n,0);
  assert.equal((await client.query(`SELECT count(*)::int AS n FROM public_projections
   WHERE source_ref=$1 AND release_state='published'`,[`cms:${entry}`])).rows[0].n,0);
  assert.equal((await client.query(`SELECT count(*)::int AS n FROM outbox_events
   WHERE subject_ref=$1 AND event_type IN ('cms.published','cms.withdrawn')`,[`cms:${entry}`])).rows[0].n,2);
 }finally{await client.end()}
});
