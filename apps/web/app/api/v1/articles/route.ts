import {randomUUID} from "node:crypto";
import {NextResponse} from "next/server";
import {loadPublishedEditorial} from "@jfa/db";
import {publicApiError} from "../../../../lib/api-response";

export const dynamic="force-dynamic";
export async function GET(request:Request){
 const slug=new URL(request.url).searchParams.get("slug")??"";
 const result=await loadPublishedEditorial(slug);
 if(result.status==="not_found")return publicApiError(404,"not_found","Article not found");
 if(result.status==="unavailable")return publicApiError(503,"service_unavailable","Editorial content is temporarily unavailable");
 return NextResponse.json({api_version:"1",request_id:randomUUID(),data:result.record},{
  headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}
 });
}
