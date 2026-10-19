import {createHash} from "node:crypto";

const MAX_BYTES=10*1024*1024;
const PNG=Buffer.from([137,80,78,71,13,10,26,10]);
const JPEG=Buffer.from([255,216]);
const PNG_END=Buffer.from([0,0,0,0,73,69,78,68,174,66,96,130]);

/** Cheap, bounded preflight only. A separate malware scanner is mandatory. */
export function inspectEditorialImage(input,declaredType){
 if(!Buffer.isBuffer(input)||input.length<24||input.length>MAX_BYTES)throw new Error("Invalid image size");
 let mime,extension,width,height;
 if(input.subarray(0,8).equals(PNG)){
  if(!input.subarray(12,16).equals(Buffer.from("IHDR"))||!input.subarray(-12).equals(PNG_END))throw new Error("Invalid PNG structure");
  width=input.readUInt32BE(16);height=input.readUInt32BE(20);
  mime="image/png";extension="png";
 }else if(input.subarray(0,2).equals(JPEG)){
  if(input.at(-2)!==255||input.at(-1)!==217)throw new Error("Invalid JPEG structure");
  mime="image/jpeg";extension="jpg";
 }else throw new Error("Unsupported image signature");
 if(declaredType!==mime)throw new Error("Image MIME mismatch");
 if(width!==undefined&&(!width||!height||width>10000||height>10000||width*height>40000000))throw new Error("Image dimensions exceed limits");
 return Object.freeze({mime,extension,size:input.length,sha256:createHash("sha256").update(input).digest("hex")});
}

/** The scanner must return an explicit clean verdict; absence or error fails closed. */
export async function scanEditorialImage(input,declaredType,scanner){
 const metadata=inspectEditorialImage(input,declaredType);
 if(typeof scanner!=="function")throw new Error("Media scanner required");
 const result=await scanner(input,metadata);
 if(result?.verdict!=="clean")throw new Error("Media scan rejected");
 return metadata;
}
