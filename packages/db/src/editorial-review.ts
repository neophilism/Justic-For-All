import type {PoolClient} from "pg";
import {editorialTransition} from "../../../scripts/lib/editorial-review.mjs";
import {validateEditorialDocument} from "../../../scripts/lib/editorial-doc.mjs";

const ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Action="approve"|"reject"|"publish"|"withdraw";
type Workflow={id:string;entry_id:string;source_revision_id:string;state:"in_review"|"approved"|"rejected"|"published"|"withdrawn";row_version:number;published_revision_id:string|null};
type Source={id:string;version:number;content:unknown;content_hash:string|null;author_id:string;editorial_state:string};
async function requireRole(client:PoolClient,actorId:string,roles:readonly string[]) {
 const result=await client.query<{allowed:boolean}>(`SELECT EXISTS (
  SELECT 1 FROM identities i JOIN role_grants r ON r.subject_id=i.id
  WHERE i.id=$1 AND i.account_state='active' AND r.role=ANY($2::text[])
   AND r.resource_scope='core' AND (r.expires_at IS NULL OR r.expires_at>now())
 ) AS allowed`,[actorId,roles]);
 if(!result.rows[0]?.allowed)throw new Error("Editorial role required");
}

/** Internal-only: the caller must authenticate actorId from a trusted session. */
export async function submitEditorialReview(client:PoolClient,actorId:string,entryId:string,sourceVersion:number) {
 if(!ID.test(actorId)||!ID.test(entryId)||!Number.isSafeInteger(sourceVersion)||sourceVersion<1)throw new Error("Invalid review input");
 await client.query("BEGIN");
 try {
  await requireRole(client,actorId,["editor","admin"]);
  const entry=await client.query<{id:string}>(`SELECT id FROM cms_entries WHERE id=$1 FOR UPDATE`,[entryId]);
  if(!entry.rows[0])throw new Error("Editorial entry not found");
  const source=await client.query<Source>(`SELECT id,version,content,content_hash,author_id,editorial_state
   FROM cms_revisions WHERE entry_id=$1 AND version=$2`,[entryId,sourceVersion]);
  const draft=source.rows[0];
  if(!draft||draft.editorial_state!=="draft"||draft.author_id!==actorId||!draft.content_hash)throw new Error("Only a valid draft author may submit");
  validateEditorialDocument(draft.content);
  const latest=await client.query<{version:number}>(`SELECT MAX(version)::int AS version FROM cms_revisions WHERE entry_id=$1`,[entryId]);
  if(latest.rows[0]?.version!==sourceVersion)throw new Error("Stale editorial draft");
  editorialTransition({state:"draft",authorId:actorId,highRisk:true,approverIds:[],version:1},
   "submit",{actorId,expectedVersion:1});
  const workflow=await client.query<{id:string}>(`INSERT INTO cms_review_workflows
   (entry_id,source_revision_id,state,row_version,high_risk)
   VALUES($1,$2,'in_review',2,true) RETURNING id`,[entryId,draft.id]);
  await client.query(`INSERT INTO audit_events(actor_ref,action,resource_ref,policy_result)
   VALUES($1,'cms_review_submitted',$2,'allow')`,[actorId,`cms-review:${workflow.rows[0].id}`]);
  await client.query("COMMIT");
  return {workflowId:workflow.rows[0].id,version:2};
 }catch(error){await client.query("ROLLBACK").catch(()=>undefined);throw error;}
}

/** Approval/publishing writes, public pointer updates, audit and cache invalidation are atomic. */
export async function transitionEditorialReview(
 client:PoolClient,actorId:string,workflowId:string,action:Action,expectedVersion:number
) {
 if(!ID.test(actorId)||!ID.test(workflowId)||!Number.isSafeInteger(expectedVersion)||expectedVersion<2||
  !["approve","reject","publish","withdraw"].includes(action))throw new Error("Invalid review transition input");
 await client.query("BEGIN");
 try {
  const roles=action==="approve"||action==="reject"?["reviewer","admin"]:
   action==="publish"?["editor","admin"]:["admin"];
  await requireRole(client,actorId,roles);
  const found=await client.query<Workflow>(`SELECT id,entry_id,source_revision_id,state,row_version,published_revision_id
   FROM cms_review_workflows WHERE id=$1 FOR UPDATE`,[workflowId]);
  const workflow=found.rows[0];
  if(!workflow)throw new Error("Review workflow not found");
  const entry=await client.query<{slug:string;locale:string;visibility:string;current_revision:number|null}>(`
   SELECT slug,locale,visibility,current_revision FROM cms_entries WHERE id=$1 FOR UPDATE`,[workflow.entry_id]);
  if(!entry.rows[0])throw new Error("Editorial entry not found");
  const source=await client.query<Source>(`SELECT id,version,content,content_hash,author_id,editorial_state
   FROM cms_revisions WHERE id=$1`,[workflow.source_revision_id]);
  const draft=source.rows[0];
  if(!draft||draft.editorial_state!=="draft"||!draft.author_id||!draft.content_hash)throw new Error("Review source is invalid");
  validateEditorialDocument(draft.content);
  const approvals=await client.query<{approver_id:string;decision:string}>(`SELECT DISTINCT ON (approver_id)
    approver_id,decision FROM publication_approvals WHERE revision_id=$1
    ORDER BY approver_id,decision_order DESC`,[draft.id]);
  const approverIds=approvals.rows.filter(row=>row.decision==="approve").map(row=>row.approver_id);
  const next=editorialTransition({
   state:workflow.state,authorId:draft.author_id,highRisk:true,approverIds,version:workflow.row_version
  },action,{actorId,expectedVersion});
  if(action!=="withdraw"){
   const latest=await client.query<{version:number}>(`SELECT MAX(version)::int AS version FROM cms_revisions WHERE entry_id=$1`,[workflow.entry_id]);
   if(latest.rows[0]?.version!==draft.version)throw new Error("Draft changed during review");
  }
  if(action==="approve"){
   await client.query(`INSERT INTO publication_approvals(revision_id,approver_id,decision,reason_code)
    VALUES($1,$2,'approve','editorial_peer_review')`,[draft.id,actorId]);
  }
  if(action==="reject"){
   await client.query(`INSERT INTO publication_approvals(revision_id,approver_id,decision,reason_code)
    VALUES($1,$2,'reject','editorial_peer_review')`,[draft.id,actorId]);
  }
  let publishedRevisionId=workflow.published_revision_id;
  if(action==="publish"||action==="withdraw"){
   if(action==="withdraw"){
    const live=await client.query<{id:string}>(`SELECT id FROM cms_revisions
      WHERE entry_id=$1 AND version=$2 AND editorial_state='published'`,
      [workflow.entry_id,entry.rows[0].current_revision]);
    if(entry.rows[0].visibility!=="public"||live.rows[0]?.id!==workflow.published_revision_id)throw new Error("Current published revision required");
   }
   const versionRow=await client.query<{version:number}>(`SELECT COALESCE(MAX(version),0)::int AS version FROM cms_revisions WHERE entry_id=$1`,[workflow.entry_id]);
   const newVersion=versionRow.rows[0].version+1;
   const state=action==="publish"?"published":"withdrawn";
   const revision=await client.query<{id:string}>(`INSERT INTO cms_revisions
    (entry_id,version,content,author_id,editorial_state,content_hash)
    VALUES($1,$2,$3::jsonb,$4,$5,$6) RETURNING id`,
    [workflow.entry_id,newVersion,JSON.stringify(draft.content),draft.author_id,state,draft.content_hash]);
   if(action==="publish")publishedRevisionId=revision.rows[0].id;
   await client.query(`UPDATE cms_entries SET current_revision=$1,visibility=$2 WHERE id=$3`,
    [newVersion,action==="publish"?"public":"withdrawn",workflow.entry_id]);
   const publicEvent={slug:entry.rows[0].slug,locale:entry.rows[0].locale,version:newVersion,event:state};
   await client.query(`INSERT INTO outbox_events(event_type,subject_ref,schema_version,public_payload)
    VALUES($1,$2,'1',$3::jsonb)`,
    [action==="publish"?"cms.published":"cms.withdrawn",`cms:${workflow.entry_id}`,JSON.stringify(publicEvent)]);
  }
  await client.query(`UPDATE cms_review_workflows SET state=$1,row_version=$2,published_revision_id=$3,updated_at=now()
   WHERE id=$4`,[next.state,next.version,publishedRevisionId,workflowId]);
  await client.query(`INSERT INTO audit_events(actor_ref,action,resource_ref,policy_result)
   VALUES($1,$2,$3,'allow')`,[actorId,`cms_${action}`,`cms-review:${workflowId}`]);
  await client.query("COMMIT");
  return {state:next.state,version:next.version};
 }catch(error){await client.query("ROLLBACK").catch(()=>undefined);throw error;}
}

/** Authenticated staff preview of the exact immutable draft under review. */
export async function loadEditorialReviewPreview(client:PoolClient,actorId:string,workflowId:string) {
 if(!ID.test(actorId)||!ID.test(workflowId))throw new Error("Invalid preview input");
 await client.query("BEGIN READ ONLY");
 try {
  await requireRole(client,actorId,["editor","reviewer","admin"]);
  const result=await client.query<{
   state:string;row_version:number;entry_id:string;source_revision_id:string;
   version:number;content:unknown;content_hash:string|null
  }>(`SELECT w.state,w.row_version,w.entry_id,w.source_revision_id,
   r.version,r.content,r.content_hash FROM cms_review_workflows w
   JOIN cms_revisions r ON r.id=w.source_revision_id WHERE w.id=$1`,[workflowId]);
  const row=result.rows[0];
  if(!row||!row.content_hash)throw new Error("Review preview unavailable");
  const document=validateEditorialDocument(row.content);
  await client.query("COMMIT");
  return {state:row.state,workflowVersion:row.row_version,entryId:row.entry_id,
   sourceVersion:row.version,contentHash:row.content_hash,document};
 }catch(error){await client.query("ROLLBACK").catch(()=>undefined);throw error;}
}
