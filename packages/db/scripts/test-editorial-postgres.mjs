import assert from "node:assert/strict";
import pg from "pg";
import {createEditorialDraft} from "../src/editorial.ts";

const {Pool}=pg;
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:6});

function document(slug,entryType="article"){
 return {
  schema_version:1,
  entry_type:entryType,
  slug,
  locale:"en",
  title:"Synthetic editorial integration record",
  summary:"Synthetic content used only to verify the private draft repository",
  blocks:[{kind:"paragraph",runs:[{text:"No public or personal information is stored.",emphasis:"normal"}]}],
  media:[]
 };
}

async function createActor(role,scope="core"){
 const identity=await pool.query("INSERT INTO identities(account_state) VALUES('active') RETURNING id");
 const id=identity.rows[0].id;
 await pool.query("INSERT INTO role_grants(subject_id,role,resource_scope) VALUES($1,$2,$3)",[id,role,scope]);
 return id;
}

async function write(actor,doc){
 const client=await pool.connect();
 try{return await createEditorialDraft(client,actor,doc);}
 finally{client.release();}
}

try{
 const editor=await createActor("editor");
 const viewer=await createActor("viewer");
 const wrongScope=await createActor("editor","other");
 const deniedSlug="synthetic-denied-draft";

 await assert.rejects(write(viewer,document(deniedSlug)),/authorization/i);
 await assert.rejects(write(wrongScope,document(deniedSlug)),/authorization/i);
 const denied=await pool.query("SELECT count(*)::int AS count FROM cms_entries WHERE slug=$1",[deniedSlug]);
 assert.equal(denied.rows[0].count,0,"denied writes must roll back without creating an entry");

 const concurrentSlug="synthetic-concurrent-draft";
 const [first,second]=await Promise.all([
  write(editor,document(concurrentSlug)),
  write(editor,document(concurrentSlug))
 ]);
 assert.equal(first.entryId,second.entryId);
 assert.deepEqual([first.version,second.version].sort((a,b)=>a-b),[1,2]);

 const stored=await pool.query(`SELECT e.visibility,e.current_revision,
   count(r.id)::int AS revisions,
   bool_and(r.editorial_state='draft') AS only_drafts
  FROM cms_entries e JOIN cms_revisions r ON r.entry_id=e.id
  WHERE e.id=$1 GROUP BY e.id`,[first.entryId]);
 assert.deepEqual(stored.rows[0],{
  visibility:"private",
  current_revision:2,
  revisions:2,
  only_drafts:true
 });
 const publicRows=await pool.query("SELECT count(*)::int AS count FROM core_public_content WHERE slug=$1",[concurrentSlug]);
 assert.equal(publicRows.rows[0].count,0,"drafts must remain absent from the public projection");
 const audits=await pool.query(
  "SELECT count(*)::int AS count FROM audit_events WHERE action='cms_draft_created' AND resource_ref LIKE $1",
  [`cms:${first.entryId}:%`]
 );
 assert.equal(audits.rows[0].count,2,"each committed revision must have audit evidence");

 const rollbackSlug="synthetic-rollback-draft";
 const initial=await write(editor,document(rollbackSlug,"article"));
 await assert.rejects(write(editor,document(rollbackSlug,"page")),/entry type/i);
 const rollback=await pool.query(`SELECT count(r.id)::int AS revisions,count(a.event_id)::int AS audits
  FROM cms_entries e
  JOIN cms_revisions r ON r.entry_id=e.id
  LEFT JOIN audit_events a ON a.resource_ref LIKE ('cms:'||e.id::text||':%')
  WHERE e.id=$1`,[initial.entryId]);
 assert.equal(rollback.rows[0].revisions,1);
 assert.equal(rollback.rows[0].audits,1);
} finally {
 await pool.end();
}
