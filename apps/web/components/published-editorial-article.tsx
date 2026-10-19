import type {PublicEditorial} from "@jfa/db";
import type {EditorialBlock,EditorialRun} from "../../../scripts/lib/editorial-doc.mjs";

function Runs({runs}:{runs:EditorialRun[]}){
 return <>{runs.map((run,index)=>run.emphasis==="strong"?<strong key={index}>{run.text}</strong>:
  run.emphasis==="em"?<em key={index}>{run.text}</em>:<span key={index}>{run.text}</span>)}</>;
}
function Block({block}:{block:EditorialBlock}){
 if(block.kind==="list")return <ul>{block.items.map((item,index)=><li key={index}>{item}</li>)}</ul>;
 if(block.kind==="heading")return <h2><Runs runs={block.runs}/></h2>;
 if(block.kind==="quote")return <blockquote><Runs runs={block.runs}/></blockquote>;
 return <p><Runs runs={block.runs}/></p>;
}
export function PublishedEditorialArticle({record}:{record:PublicEditorial}){
 return <article className="wrap public-article">
  <p className="eyebrow">Published {record.entryType} · {record.locale}</p>
  <h1>{record.title}</h1>
  <p className="lede">{record.summary}</p>
  <p>By {record.authorLabel}. Reviewed by {record.reviewerLabel}.
   Published <time dateTime={record.publishedAt}>{new Date(record.publishedAt).toLocaleDateString("en-US",{timeZone:"UTC"})}</time>.
   Reviewed <time dateTime={record.reviewedAt}>{new Date(record.reviewedAt).toLocaleDateString("en-US",{timeZone:"UTC"})}</time>.</p>
  <p className="ui-note">{record.verificationLabel}</p>
  {record.blocks.map((block,index)=><Block block={block} key={index}/>)}
  {record.media.length>0?<section aria-label="Media source descriptions">
   <h2>Referenced media</h2>
   <p>Media is described here and is not fetched or embedded from external sites.</p>
   <ul>{record.media.map((media,index)=><li key={index}>
    <strong>{media.kind} description:</strong> {media.alt}. {media.caption}.
    {"source_url" in media?<span> Source reference: {media.source_url}</span>:<span> Private scanned asset reference.</span>}
   </li>)}</ul>
  </section>:null}
 </article>;
}
