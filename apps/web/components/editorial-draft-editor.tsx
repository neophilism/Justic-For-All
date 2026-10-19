"use client";
import {useMemo,useState} from "react";
import type {EditorialBlock,EditorialDocument,EditorialRun} from "../../../scripts/lib/editorial-doc.mjs";
import {validateEditorialDocument} from "../../../scripts/lib/editorial-doc.mjs";
import {EditorialDocumentPreview} from "./editorial-document-preview";

export type DraftEditorProps={
 initial:EditorialDocument;
 /** A trusted parent must authenticate and revalidate server-side before writing. */
 onSave?:(validated:EditorialDocument)=>Promise<void>;
};
/**
 * Reusable local editor component, deliberately not mounted on a public route.
 * This is not authentication and onSave is not an authorization mechanism.
 */
export function EditorialDraftEditor({initial,onSave}:DraftEditorProps) {
 const [draft,setDraft]=useState<EditorialDocument>(()=>structuredClone(initial));
 const [saving,setSaving]=useState(false);
 const [message,setMessage]=useState("Local preview only. No changes have been sent to a server.");
 const validation=useMemo(()=>{
  try {return {ok:true as const,document:validateEditorialDocument(draft)};}
  catch {return {ok:false as const,document:undefined};}
 },[draft]);
 const edit=(fn:(value:EditorialDocument)=>EditorialDocument)=>{
  setDraft(prev=>fn(prev));setMessage("Unsaved local changes.");
 };
 const updateBlock=(idx:number,fn:(block:EditorialBlock)=>EditorialBlock)=>{
  edit(doc=>({...doc,blocks:doc.blocks.map((block,i)=>i===idx?fn(block):block)}));
 };
 const updateRun=(idx:number,runIndex:number,fn:(run:EditorialRun)=>EditorialRun)=>{
  updateBlock(idx,block=>block.kind==="list"?block:{...block,runs:block.runs.map((run,i)=>i===runIndex?fn(run):run)});
 };
 const addBlock=(kind:EditorialBlock["kind"])=>{
  const block:EditorialBlock=kind==="list"?{kind,items:["A new list item"]}:{kind,runs:[{text:"A new text block",emphasis:"normal"}]};
  edit(doc=>({...doc,blocks:[...doc.blocks,block]}));
 };
 const save=async()=>{
  if(!validation.ok||!onSave||saving)return;
  setSaving(true);setMessage("Submitting draft to the configured authoring service.");
  try {await onSave(validation.document);setMessage("Draft saved by the configured service.");}
  catch {setMessage("Save could not be confirmed. The local draft is still on this page.");}
  finally {setSaving(false);}
 };
 return <div className="ui-stack" aria-label="Internal editorial draft editor">
  <p className="ui-note"><strong>Internal editing component.</strong> It is not connected to public intake. A trusted authenticated administrator must attach a server-validated save handler before use.</p>
  <div className="ui-panel">
   <h2>Draft fields</h2>
   <label className="ui-label" htmlFor="editor-type">Entry type</label>
   <select className="ui-input" id="editor-type" value={draft.entry_type}
    onChange={event=>edit(doc=>({...doc,entry_type:event.target.value as EditorialDocument["entry_type"]}))}>
    <option value="page">Page</option><option value="article">Article</option>
    <option value="resource">Resource</option><option value="faq">FAQ</option>
   </select>
   <label className="ui-label" htmlFor="editor-slug">Slug</label>
   <input className="ui-input" id="editor-slug" value={draft.slug} maxLength={80}
    onChange={event=>edit(doc=>({...doc,slug:event.target.value}))}/>
   <label className="ui-label" htmlFor="editor-locale">Locale</label>
   <input className="ui-input" id="editor-locale" value={draft.locale} maxLength={5}
    onChange={event=>edit(doc=>({...doc,locale:event.target.value}))}/>
   <label className="ui-label" htmlFor="editor-title">Title</label>
   <input className="ui-input" id="editor-title" value={draft.title} maxLength={180}
    onChange={e=>edit(d=>({...d,title:e.target.value}))}/>
   <label className="ui-label" htmlFor="editor-summary">Summary</label>
   <textarea className="ui-input" id="editor-summary" value={draft.summary} maxLength={700} rows={3}
    onChange={e=>edit(d=>({...d,summary:e.target.value}))}/>
  </div>
  <section aria-label="Editable text blocks" className="ui-panel">
   <h2>Content blocks</h2>
   {draft.blocks.map((block,i)=><fieldset key={i} className="editorial-block">
     <legend>{block.kind} {i+1}</legend>
     {block.kind==="list" ? block.items.map((item,j)=><div key={j}>
       <label className="ui-label" htmlFor={`list-${i}-${j}`}>List item {j+1}</label>
       <textarea className="ui-input" id={`list-${i}-${j}`} value={item} maxLength={1000} rows={2}
        onChange={e=>updateBlock(i,b=>b.kind==="list"?{...b,items:b.items.map((v,k)=>k===j?e.target.value:v)}:b)}/>
      </div>) : block.runs.map((run,j)=><div key={j}>
        <label className="ui-label" htmlFor={`run-${i}-${j}`}>Text segment {j+1}</label>
        <textarea className="ui-input" id={`run-${i}-${j}`} value={run.text} maxLength={1200} rows={3}
         onChange={e=>updateRun(i,j,r=>({...r,text:e.target.value}))}/>
        <label className="ui-label" htmlFor={`style-${i}-${j}`}>Segment style</label>
        <select className="ui-input" id={`style-${i}-${j}`} value={run.emphasis}
         onChange={e=>updateRun(i,j,r=>({...r,emphasis:e.target.value as EditorialRun["emphasis"]}))}>
         <option value="normal">Normal</option><option value="strong">Bold</option><option value="em">Italic</option>
        </select>
       </div>)}
     <div className="actions">
      {block.kind==="list" ? <button type="button" disabled={block.items.length>=30}
       onClick={()=>updateBlock(i,b=>b.kind==="list"?{...b,items:[...b.items,"New list item"]}:b)}>Add list item</button>
       : <button type="button" disabled={block.runs.length>=30}
       onClick={()=>updateBlock(i,b=>b.kind==="list"?b:{...b,runs:[...b.runs,{text:"New text",emphasis:"normal"}]})}>Add styled segment</button>}
      <button type="button" disabled={draft.blocks.length<=1}
       onClick={()=>edit(d=>({...d,blocks:d.blocks.filter((_,index)=>index!==i)}))}>Remove block {i+1}</button>
     </div>
    </fieldset>)}
   <div className="actions">
    <button type="button" disabled={draft.blocks.length>=80} onClick={()=>addBlock("paragraph")}>Add paragraph</button>
    <button type="button" disabled={draft.blocks.length>=80} onClick={()=>addBlock("heading")}>Add heading</button>
    <button type="button" disabled={draft.blocks.length>=80} onClick={()=>addBlock("quote")}>Add quote</button>
    <button type="button" disabled={draft.blocks.length>=80} onClick={()=>addBlock("list")}>Add list</button>
   </div>
  </section>
  <section aria-label="Media references" className="ui-panel">
   <h2>Media descriptions</h2>
   <p className="ui-note">References are metadata only. Image bytes require a separate scanned, private upload before an asset ID can be attached.</p>
   {draft.media.map((media,index)=><fieldset key={index}>
    <legend>{media.kind} {index+1}</legend>
    {"source_url" in media ? <>
     <label className="ui-label" htmlFor={`media-url-${index}`}>HTTPS source URL</label>
     <input className="ui-input" id={`media-url-${index}`} value={media.source_url}
      onChange={event=>edit(doc=>({...doc,media:doc.media.map((item,i)=>i===index&&"source_url" in item?{...item,source_url:event.target.value}:item)}))}/>
    </> : <p>Private scanned asset: {media.asset_id}</p>}
    <label className="ui-label" htmlFor={`media-alt-${index}`}>Alternative text</label>
    <input className="ui-input" id={`media-alt-${index}`} value={media.alt} maxLength={400}
     onChange={event=>edit(doc=>({...doc,media:doc.media.map((item,i)=>i===index?{...item,alt:event.target.value}:item)}))}/>
    <label className="ui-label" htmlFor={`media-caption-${index}`}>Caption and credit</label>
    <input className="ui-input" id={`media-caption-${index}`} value={media.caption} maxLength={700}
     onChange={event=>edit(doc=>({...doc,media:doc.media.map((item,i)=>i===index?{...item,caption:event.target.value}:item)}))}/>
    <button type="button" onClick={()=>edit(doc=>({...doc,media:doc.media.filter((_,i)=>i!==index)}))}>Remove media reference</button>
   </fieldset>)}
   <button type="button" disabled={draft.media.length>=12} onClick={()=>edit(doc=>({...doc,media:[...doc.media,{
    kind:"image",source_url:"https://example.org/image.jpg",
    alt:"Describe this image for readers",caption:"Describe source and credit"
   }]}))}>Add image reference</button>
  </section>
  <div className="ui-panel">
   <h2>Validation and save</h2>
   <p role="status" aria-live="polite">{validation.ok?"Draft format is valid.":"Draft contains invalid or incomplete fields."} {message}</p>
   <button className="ui-button" type="button" onClick={save} disabled={!onSave||!validation.ok||saving}>
    {saving?"Saving...":onSave?"Save draft":"Save unavailable until authenticated"}
   </button>
  </div>
  <EditorialDocumentPreview document={draft}/>
 </div>;
}
