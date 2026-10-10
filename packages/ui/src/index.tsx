import type { ReactNode, InputHTMLAttributes, ButtonHTMLAttributes } from "react";

export const headingScale = Object.freeze({ hero: "clamp(2.25rem, 5.5vw, 4.4rem)", section: "clamp(1.3rem, 3vw, 1.8rem)" });
export type Tone = "information" | "caution";

/** Server-compatible, noninteractive document components. */
export function Panel({children,heading,id}: {children:ReactNode;heading?:string;id?:string}) {
  return <section aria-labelledby={heading && id ? id : undefined} className="ui-panel">
    {heading ? <h2 id={id}>{heading}</h2> : null}
    {children}
  </section>;
}

export function Notice({children,tone="information",title}: {children:ReactNode;tone?:Tone;title:string}) {
  return <aside aria-label={title} className={tone==="caution"?"ui-note ui-note--caution":"ui-note"}>
    <strong>{title}</strong><div>{children}</div>
  </aside>;
}

/** Text labels: do not convey live status by color alone. */
export function AvailabilityText({state}: {state:"planning"|"building"|"available"|"unavailable"}) {
  const names={planning:"Planning",building:"In development",available:"Available",unavailable:"Unavailable"};
  return <span className={state==="unavailable"?"ui-status ui-status--unavailable":"ui-status"}>{names[state]}</span>;
}

/** Strictly labeled input. Actual submissions require a separate approved route. */
export function TextField({id,label,hint,...props}: {id:string;label:string;hint?:string} & InputHTMLAttributes<HTMLInputElement>) {
  const hintId=hint? `${id}-hint` : undefined;
  return <div><label className="ui-label" htmlFor={id}>{label}</label>
    {hint ? <span className="ui-hint" id={hintId}>{hint}</span> : null}
    <input id={id} className="ui-input" aria-describedby={hintId} {...props}/>
  </div>;
}

/** App owners must supply working actions; disabled examples are labeled as samples. */
export function ActionButton({children,...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="ui-button" type="button" {...props}>{children}</button>;
}
