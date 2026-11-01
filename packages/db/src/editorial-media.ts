import {randomUUID} from "node:crypto";
import type {PoolClient} from "pg";
import {scanEditorialImage} from "../../../scripts/lib/editorial-upload.mjs";

export type PrivateMediaStore={
 /** Must write only to a private, non-publicly listed bucket/container. */
 putPrivate:(key:string,bytes:Buffer,mime:string)=>Promise<void>;
 deletePrivate:(key:string)=>Promise<void>;
};
export type MediaScanner=(bytes:Buffer,metadata:{mime:string;size:number;sha256:string})=>Promise<{verdict:string;scannerId?:string}>;
const actorPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Internal staff-only intake. Caller must independently authenticate actorId.
 * No public route or URL is exposed. Scanner and private store are required.
 * Use a dedicated database connection; do not call inside an ambient transaction.
 */
export async function createEditorialImage(
 client:PoolClient,actorId:string,bytes:Buffer,declaredType:string,
 scanner:MediaScanner,store:PrivateMediaStore
):Promise<Readonly<{assetId:string;sha256:string}>> {
 if(!actorPattern.test(actorId))throw new Error("Invalid actor identity");
 if(!store||typeof store.putPrivate!=="function"||typeof store.deletePrivate!=="function")throw new Error("Private media store required");
 // Freeze upload content by value before the first asynchronous boundary.
 // Caller/scanner buffer reuse must not change the bytes stored under this digest.
 if(!Buffer.isBuffer(bytes)||bytes.length<24||bytes.length>10*1024*1024)throw new Error("Invalid image size");
 const uploadBytes=Buffer.from(bytes);
 const info=await scanEditorialImage(uploadBytes,declaredType,scanner);
 if(!/^[a-z0-9][a-z0-9.-]{2,119}$/.test(info.scannerId))throw new Error("Invalid scanner identity");
 const assetId=randomUUID();
 const objectKey=`editorial/private/${assetId}.${info.extension}`;
 let uploaded=false,commitStarted=false;
 await client.query("BEGIN");
 try {
  const auth=await client.query<{allowed:boolean}>(`SELECT EXISTS (
   SELECT 1 FROM identities i JOIN role_grants r ON r.subject_id=i.id
   WHERE i.id=$1 AND i.account_state='active' AND r.role IN ('editor','admin')
   AND r.resource_scope='core' AND (r.expires_at IS NULL OR r.expires_at>now())
  ) AS allowed`,[actorId]);
  if(!auth.rows[0]?.allowed)throw new Error("Editor authorization required");
  await store.putPrivate(objectKey,Buffer.from(uploadBytes),info.mime);
  uploaded=true;
  await client.query(`INSERT INTO cms_media_assets
   (id,uploaded_by,object_key,mime_type,byte_size,sha256,scanner_id)
   VALUES($1,$2,$3,$4,$5,$6,$7)`,
   [assetId,actorId,objectKey,info.mime,info.size,info.sha256,info.scannerId]);
  await client.query(`INSERT INTO audit_events(actor_ref,action,resource_ref,policy_result)
   VALUES($1,'cms_media_uploaded',$2,'allow')`,[actorId,`cms-media:${assetId}`]);
  commitStarted=true;
  await client.query("COMMIT");
  return {assetId,sha256:info.sha256};
 } catch(error) {
  if(!commitStarted) {
   await client.query("ROLLBACK").catch(()=>undefined);
   if(uploaded)await store.deletePrivate(objectKey).catch(()=>undefined);
  }
  // An uncertain COMMIT must be reconciled before deleting the object or retrying.
  throw error;
 }
}

