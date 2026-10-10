import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {initiatives,findPublicInitiative} from "@jfa/core";
import {AvailabilityText,Notice} from "@jfa/ui";

type PageContext = {params:Promise<{slug:string}>};

export function generateStaticParams() {
  return initiatives.map(item=>({slug:item.slug}));
}
export async function generateMetadata({params}:PageContext):Promise<Metadata> {
  const {slug}=await params;
  const item=findPublicInitiative(slug);
  return item ? {title:`${item.name} — Justice For All`,description:item.description} : {title:"Initiative not found"};
}
export default async function InitiativePage({params}:PageContext) {
  const {slug}=await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 64) notFound();
  const initiative=findPublicInitiative(slug);
  if (!initiative) notFound();
  return <article className="wrap public-article">
    <p className="eyebrow">Initiative information</p>
    <h1>{initiative.name}</h1>
    <AvailabilityText state={initiative.status}/>
    <p className="lede">{initiative.description}</p>
    <section aria-labelledby="overview"><h2 id="overview">About this initiative</h2><p>{initiative.overview}</p></section>
    <Notice title="This is not an active submission service" tone="caution"><p>Only general information is available here. There is no intake, public-record filing, volunteer registration or private messaging on this page. Do not share sensitive information here.</p></Notice>
    <p><Link href="/initiatives">Back to all initiatives</Link> or <Link href="/get-involved">learn about voluntary participation</Link>.</p>
  </article>;
}
