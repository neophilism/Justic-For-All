import {createHash} from "node:crypto";
import type {PoolClient} from "pg";
import {validateEditorialDocument} from "../../../scripts/lib/editorial-doc.mjs";

/**
 * Internal-only draft repository. Not wired to an HTTP route or the public app.
 * Only an already authenticated, trusted server-side staff context may invoke it.
 * The DB role check is defense in depth, not a replacement for authentication.
 *
 * The provided connection must be dedicated to this call (no ambient transaction).
 */
export async function createEditorialDraft(
 client:PoolClient,
 actorId:string,
 untrustedContent:unknown
):Promise<Readonly<{entryId:string;version:number;contentHash:string}>> {
 const doc=validateEditorialDocument(untrustedContent);
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(actorId)) {
  throw new Error("Invalid actor identity");
 }
 const contentJson=JSON.stringify(doc);
 const contentHash=createHash("sha256").update(contentJson,"utf8").digest("hex");
 await client.query("BEGIN");
 try {
  const auth=await client.query<{allowed:boolean}>(`SELECT EXISTS (
     SELECT 1 FROM identities i JOIN role_grants r ON r.subject_id=i.id
     WHERE i.id=$1 AND i.account_state='active' AND
     r.role IN ('editor','admin') AND r.resource_scope='core' AND
     (r.expires_at IS NULL OR r.expires_at>now())
    ) AS allowed`,[actorId]);
  if(!auth.rows[0]?.allowed)throw new Error("Editor authorization required");
  // Serialize creation for an identical slug/locale before row locks are possible.
  // The transaction-scoped advisory lock also prevents competing first revisions.
  await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
    [JSON.stringify([doc.locale,doc.slug])]);
  for(const media of doc.media){
   if("asset_id" in media){
    const asset=await client.query<{allowed:boolean}>(`SELECT EXISTS (
      SELECT 1 FROM cms_media_assets WHERE id=$1 AND uploaded_by=$2 AND scan_state='clean'
     ) AS allowed`,[media.asset_id,actorId]);
    if(!asset.rows[0]?.allowed)throw new Error("Scanned media asset required");
   }
  }
  const existing=await client.query<{id:string;visibility:string}>(`
     SELECT id,visibility FROM cms_entries WHERE slug=$1 AND locale=$2 FOR UPDATE
   `,[doc.slug,doc.locale]);
  let entry=existing.rows[0];
  if(!entry){
   const created=await client.query<{id:string}>(`INSERT INTO cms_entries
     (entry_type,slug,locale,visibility) VALUES($1,$2,$3,'private') RETURNING id`,
    [doc.entry_type,doc.slug,doc.locale]);
   entry={id:created.rows[0].id,visibility:"private"};
  } else {
   const kind=await client.query<{entry_type:string}>("SELECT entry_type FROM cms_entries WHERE id=$1",[entry.id]);
   if(kind.rows[0]?.entry_type!==doc.entry_type)throw new Error("Cannot change editorial entry type");
  }
  const last=await client.query<{version:number}>(`
    SELECT COALESCE(MAX(version),0)::int AS version FROM cms_revisions WHERE entry_id=$1
   `,[entry.id]);
  const version=(last.rows[0]?.version??0)+1;
  await client.query(`INSERT INTO cms_revisions
     (entry_id,version,content,author_id,editorial_state,content_hash)
     VALUES($1,$2,$3::jsonb,$4,'draft',$5)`,
    [entry.id,version,contentJson,actorId,contentHash]);
  // Never replace a published pointer with an unapproved draft.
  if(entry.visibility==="private"){
    await client.query("UPDATE cms_entries SET current_revision=$1 WHERE id=$2 AND visibility='private'",[version,entry.id]);
  }
  await client.query(`INSERT INTO audit_events (actor_ref,action,resource_ref,policy_result)
    VALUES($1,'cms_draft_created',$2,'allow')`,[actorId,`cms:${entry.id}:${version}`]);
  await client.query("COMMIT");
  return {entryId:entry.id,version,contentHash};
 } catch(error){
  await client.query("ROLLBACK");
  throw error;
 }
}
