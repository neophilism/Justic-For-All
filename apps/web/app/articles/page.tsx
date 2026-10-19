import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {loadPublishedEditorial} from "@jfa/db";
import {PublishedEditorialArticle} from "../../components/published-editorial-article";

export const dynamic="force-dynamic";
export const revalidate=0;
type Context={searchParams:Promise<{slug?:string|string[]}>};
export async function generateMetadata({searchParams}:Context):Promise<Metadata>{
 const query=await searchParams;
 const slug=typeof query.slug==="string"?query.slug:"";
 const result=await loadPublishedEditorial(slug);
 if(result.status!=="published")return {title:"Article unavailable",robots:{index:false,follow:false}};
 return {title:`${result.record.title} — Justice For All`,description:result.record.summary,
  alternates:{canonical:`/articles?slug=${result.record.slug}`}};
}
export default async function ArticlePage({searchParams}:Context){
 const query=await searchParams;
 const slug=typeof query.slug==="string"?query.slug:"";
 const result=await loadPublishedEditorial(slug);
 if(result.status!=="published")notFound();
 return <PublishedEditorialArticle record={result.record}/>;
}
