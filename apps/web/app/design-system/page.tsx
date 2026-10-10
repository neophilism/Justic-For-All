import {ActionButton,AvailabilityText,Notice,Panel,TextField} from "@jfa/ui";
export const metadata = { title:"Design system — Justice For All" };
export default function DesignSystem() {
 return <div className="wrap">
   <p className="eyebrow">Implementation reference</p><h1>Design system</h1>
   <p className="lede">A static example of accessible typography, neutral statuses, safe notices and form semantics. Examples on this page do not submit information.</p>
   <div className="ui-stack">
     <Panel heading="Readable content" id="readable"><p>Clear language, consistent spacing, and real text distinguish public information from planned services. This presentation deliberately avoids partisan color coding.</p></Panel>
     <Panel heading="Availability shown in words" id="status"><p>Every module discloses its current status, including in text for nonvisual readers.</p><div className="actions">
       <AvailabilityText state="planning"/><AvailabilityText state="building"/><AvailabilityText state="unavailable"/>
     </div></Panel>
     <Panel heading="Safety and disclosure" id="safety"><Notice title="Sensitive records are not accepted" tone="caution"><p>No testimony upload, confidential evidence form, or volunteer contact collection is enabled in this preview.</p></Notice></Panel>
     <Panel heading="Form controls (visual examples only)" id="fields"><div className="ui-stack">
       <TextField id="sample-input" label="Example label" hint="Disabled sample input; not collecting information." disabled placeholder="Example only"/>
       <ActionButton disabled aria-label="Example disabled submission control">Submission unavailable</ActionButton>
     </div></Panel>
   </div>
 </div>;
}
