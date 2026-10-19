import pg from "pg";
import type {PoolClient} from "pg";
import type {EditorialDocument} from "../../../scripts/lib/editorial-doc.mjs";
import {projectPublishedEditorial} from "../../../scripts/lib/editorial-projection.mjs";
import {parseDatabaseUrl} from "./config.mjs";

export type PublicEditorial=Readonly<{
 slug:string;locale:string;entryType:EditorialDocument["entry_type"];version:number;
 title:string;summary:string;blocks:EditorialDocument["blocks"];media:EditorialDocument["media"];
 publishedAt:string;reviewedAt:string;authorLabel:string;reviewerLabel:string;
 verificationLabel:string;
}>;
type Row={
 slug:string;locale:string;entry_type:EditorialDocument["entry_type"];visibility:string;
 version:number;editorial_state:string;content:unknown;author_id:string;reviewer_id:string;
 published_at:Date;reviewed_at:Date;author_name:string|null;reviewer_name:string|null;
};
const SLUG=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCALE=/^[a-z]{2}(?:-[A-Z]{2})?$/;

/** Exact-current-version public read. Missing JFA-14 schema fails closed. */
export async function readPublishedEditorial(client:PoolClient,slug:string,locale="en"):Promise<PublicEditorial|null>{
 if(typeof slug!=="string"||slug.length>80||!SLUG.test(slug)||
  typeof locale!=="string"||!LOCALE.test(locale))return null;
 const result=await client.query<Row>(`SELECT e.slug,e.locale,e.entry_type,e.visibility,
  r.version,r.editorial_state,r.content,r.author_id,
  active.approvers[1] AS reviewer_id,r.created_at AS published_at,
  active.reviewed_at,p_author.public_display_name AS author_name,
  p_reviewer.public_display_name AS reviewer_name
 FROM cms_entries e
 JOIN cms_revisions r ON r.entry_id=e.id AND r.version=e.current_revision
 JOIN cms_review_workflows w ON w.entry_id=e.id AND w.published_revision_id=r.id
 JOIN cms_revisions source ON source.id=w.source_revision_id
 CROSS JOIN LATERAL (
  SELECT count(*)::int AS approval_count,
   array_agg(decisions.approver_id ORDER BY decisions.approver_id) AS approvers,
   max(decisions.decided_at) AS reviewed_at
  FROM (
   SELECT DISTINCT ON (p.approver_id) p.approver_id,p.decision,p.decided_at
   FROM publication_approvals p WHERE p.revision_id=source.id
   ORDER BY p.approver_id,p.decision_order DESC
  ) decisions WHERE decisions.decision='approve'
 ) active
 LEFT JOIN profiles p_author ON p_author.identity_id=r.author_id AND p_author.visibility='public'
 LEFT JOIN profiles p_reviewer ON p_reviewer.identity_id=active.approvers[1] AND p_reviewer.visibility='public'
 WHERE e.slug=$1 AND e.locale=$2 AND e.visibility='public'
  AND r.editorial_state='published' AND w.state='published'
  AND source.editorial_state='draft' AND source.version=r.version-1
  AND source.author_id=r.author_id AND source.content_hash=r.content_hash
  AND source.content=r.content AND active.approval_count>=2
  AND NOT (r.author_id=ANY(active.approvers))
 LIMIT 1`,[slug,locale]);
 const row=result.rows[0];
 if(!row)return null;
 const projected=projectPublishedEditorial({
  visibility:row.visibility,editorialState:row.editorial_state,authorId:row.author_id,
  reviewerId:row.reviewer_id,version:row.version,publishedAt:row.published_at.toISOString(),
  content:row.content
 });
 if(projected.slug!==row.slug||projected.locale!==row.locale||projected.entryType!==row.entry_type)
  throw new Error("Editorial identity mismatch");
 const doc=projected.document;
 return Object.freeze({
  slug:doc.slug,locale:doc.locale,entryType:doc.entry_type,version:projected.version,
  title:doc.title,summary:doc.summary,blocks:doc.blocks,media:doc.media,
  publishedAt:projected.publishedAt,reviewedAt:row.reviewed_at.toISOString(),
  authorLabel:row.author_name?.trim()||"Justice For All editorial team",
  reviewerLabel:row.reviewer_name?.trim()||"Justice For All editorial review",
  verificationLabel:"Editorial review confirms publication approval, not independent verification of every claim."
 });
}

let pool:pg.Pool|undefined;
let initializedFor:string|undefined;
export async function loadPublishedEditorial(slug:string,locale="en",env:NodeJS.ProcessEnv=process.env):
 Promise<{status:"published";record:PublicEditorial}|{status:"not_found"|"unavailable"}>{
 if(typeof slug!=="string"||slug.length>80||!SLUG.test(slug)||
  typeof locale!=="string"||!LOCALE.test(locale))return {status:"not_found"};
 const parsed=parseDatabaseUrl(env.DATABASE_URL,env.NODE_ENV==="production"?"production":"development");
 if(!parsed.ok)return {status:"unavailable"};
 try{
  if(!pool){pool=new pg.Pool({connectionString:parsed.url,max:3,connectionTimeoutMillis:3000,idleTimeoutMillis:10000});initializedFor=parsed.url;}
  if(initializedFor!==parsed.url)return {status:"unavailable"};
  const client=await pool.connect();
  try{
   const record=await readPublishedEditorial(client,slug,locale);
   return record?{status:"published",record}:{status:"not_found"};
  }finally{client.release();}
 }catch{
  // Do not log database URLs or errors into public responses.
  return {status:"unavailable"};
 }
}
