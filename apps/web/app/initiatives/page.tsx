import Link from "next/link";
import { initiatives } from "@jfa/core";
import { AvailabilityText } from "@jfa/ui";

export const metadata = {
  title: "Initiatives — Justice For All",
  description: "Browse Justice For All initiatives and their verified availability status."
};

export default function Initiatives() {
  return (
    <div className="wrap">
      <p className="eyebrow">What we are building</p>
      <h1>Initiatives</h1>
      <p className="lede">Every program below is in planning or development. The directory is informational; a listed initiative is not necessarily an available service.</p>
      <ul className="initiative-list">
        {initiatives.map(item => <li key={item.slug}>
          <h2><Link href={`/initiatives/${item.slug}`}>{item.name}</Link></h2>
          <p>{item.description}</p>
          <AvailabilityText state={item.status}/>
        </li>)}
      </ul>
      <section aria-labelledby="directory-security"><h2 id="directory-security">Privacy and availability</h2><p>The secure story-submission, records-filing, volunteer-matching and distributed archiving services are not enabled through these pages. Do not submit sensitive personal information here.</p></section>
    </div>
  );
}
