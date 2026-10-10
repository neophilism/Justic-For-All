import { NextResponse } from "next/server";
export function GET() {
  return NextResponse.json({status:"ok",service:"justice-for-all-core",liveDeploymentVerified:false},{headers:{"Cache-Control":"no-store"}});
}
