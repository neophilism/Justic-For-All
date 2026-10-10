import type {EditorialBlock,EditorialDocument,EditorialRun} from "../../../scripts/lib/editorial-doc.mjs";

/** Pure React text rendering. No raw HTML, iframe, or remote-media fetch. */
function TextRuns({runs}:{runs:EditorialRun[]}) {
 return <>{runs.map((run,index)=>run.emphasis==="strong"
  ? <strong key={index}>{run.text}</strong>
  : run.emphasis==="em" ? <em key={index}>{run.text}</em> : <span key={index}>{run.text}</span>)}</>;
}
function Block({block}:{block:EditorialBlock}) {
 if(block.kind==="list")return <ul>{block.items.map((item,index)=><li key={index}>{item}</li>)}</ul>;
 if(block.kind==="heading")return <h3><TextRuns runs={block.runs}/></h3>;
 if(block.kind==="quote")return <blockquote><TextRuns runs={block.runs}/></blockquote>;
 return <p><TextRuns runs={block.runs}/></p>;
}
export function EditorialDocumentPreview({document}:{document:EditorialDocument}) {
 return <article aria-label="Editorial draft preview" className="editorial-preview">
   <p className="eyebrow">Unpublished local preview — not public content</p>
   <h2>{document.title}</h2><p>{document.summary}</p>
   {document.blocks.map((block,index)=><Block block={block} key={index}/>)}
   {document.media.length>0 ? <section aria-label="Referenced media metadata">
    <h3>Media descriptions (not loaded)</h3>
    <ul>{document.media.map((media,index)=><li key={index}>{media.kind}: {media.alt} — {media.caption}</li>)}</ul>
   </section> : null}
  </article>;
}
