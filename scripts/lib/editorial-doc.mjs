/** Public editorial-document validator. Does not accept user testimony or case evidence. */
const allowedTypes=new Set(["page","article","resource","faq"]);
const allowedKinds=new Set(["paragraph","heading","quote","list"]);
const allowedEmphasis=new Set(["normal","strong","em"]);
const allowedMedia=new Set(["image","audio","video"]);
const slugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const exact=(value,allowed)=>{
 if(!value||typeof value!=="object"||Array.isArray(value))return false;
 return Object.keys(value).every(k=>allowed.includes(k)) && allowed.every(k=>Object.hasOwn(value,k));
};
function cleanText(value,max,name,min=1){
 if(typeof value!=="string"||value.length<min||value.length>max||value.trim()!==value||/[<>]/.test(value))throw new Error("Unsafe or invalid "+name);
 return value;
}
function cleanRichRun(value){
 // Whitespace at run boundaries separates adjacent formatted spans.
 if(typeof value!=="string"||value.length<1||value.length>1200||!value.trim()||/[<>]/.test(value)) {
  throw new Error("Unsafe or invalid rich-text run");
 }
 return value;
}
function safeReference(value){
 const raw=cleanText(value,1500,"source reference");
 let parsed;
 try {parsed=new URL(raw);} catch {throw new Error("Source URL must be HTTPS");}
 if(parsed.protocol!=="https:"||parsed.username||parsed.password||!parsed.hostname||parsed.hostname==="localhost"||
  parsed.hostname.endsWith(".local")||parsed.hostname.endsWith(".internal")||
  /^[0-9.]+$/.test(parsed.hostname)||parsed.hostname.includes(":"))throw new Error("Unsafe media source URL");
 return raw;
}
export function validateEditorialDocument(value){
 if(!exact(value,["schema_version","entry_type","slug","locale","title","summary","blocks","media"])||value.schema_version!==1)throw new Error("Invalid editorial document version/keys");
 if(!allowedTypes.has(value.entry_type))throw new Error("Invalid editorial type");
 if(typeof value.slug!=="string"||value.slug.length>80||!slugPattern.test(value.slug))throw new Error("Invalid editorial slug");
 if(!/^[a-z]{2}(-[A-Z]{2})?$/.test(value.locale))throw new Error("Invalid editorial locale");
 cleanText(value.title,180,"title",8);
 cleanText(value.summary,700,"summary",12);
 if(!Array.isArray(value.blocks)||value.blocks.length<1||value.blocks.length>80)throw new Error("Invalid editorial blocks");
 let total=0;
 for(const block of value.blocks){
  if(!block||typeof block!=="object"||!allowedKinds.has(block.kind))throw new Error("Invalid block kind");
  const list=block.kind==="list";
  if(!exact(block,list?["kind","items"]:["kind","runs"]))throw new Error("Invalid block shape");
  if(list){
   if(!Array.isArray(block.items)||block.items.length<1||block.items.length>30)throw new Error("Invalid list items");
   for(const item of block.items)total+=cleanText(item,1000,"list item").length;
  } else {
   if(!Array.isArray(block.runs)||block.runs.length<1||block.runs.length>30)throw new Error("Invalid text runs");
   for(const run of block.runs){
    if(!exact(run,["text","emphasis"])||!allowedEmphasis.has(run.emphasis))throw new Error("Invalid rich-text run");
    total+=cleanRichRun(run.text).length;
   }
  }
 }
 if(total>50000)throw new Error("Editorial content exceeds maximum size");
 if(!Array.isArray(value.media)||value.media.length>12)throw new Error("Too many media references");
 for(const media of value.media){
  const external=exact(media,["kind","source_url","alt","caption"]);
  const uploaded=exact(media,["kind","asset_id","alt","caption"]);
  if((!external&&!uploaded)||!allowedMedia.has(media.kind)||uploaded&&media.kind!=="image")throw new Error("Invalid media metadata");
  if(external)safeReference(media.source_url);
  if(uploaded&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(media.asset_id))throw new Error("Invalid media asset ID");
  cleanText(media.alt,400,"alt text",8);
  cleanText(media.caption,700,"caption",8);
 }
 // This schema stores structured text and media references only, never HTML, embeds or upload bytes.
 return structuredClone(value);
}
