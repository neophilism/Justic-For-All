import {createHash} from "node:crypto";
import {inspectPngStructure,inspectJpegStructure} from "./editorial-image-structure.mjs";

const MAX_BYTES=10*1024*1024;
const PNG=Buffer.from([137,80,78,71,13,10,26,10]);
const JPEG=Buffer.from([255,216]);

/** Cheap, bounded preflight only. A separate malware scanner is mandatory. */
export function inspectEditorialImage(input,declaredType){
 if(!Buffer.isBuffer(input)||input.length<24||input.length>MAX_BYTES)throw new Error("Invalid image size");
 let mime,extension;
 if(input.subarray(0,8).equals(PNG)){
  inspectPngStructure(input);
  mime="image/png";extension="png";
 }else if(input.subarray(0,2).equals(JPEG)){
  inspectJpegStructure(input);
  mime="image/jpeg";extension="jpg";
 }else throw new Error("Unsupported image signature");
 if(declaredType!==mime)throw new Error("Image MIME mismatch");
 return Object.freeze({mime,extension,size:input.length,sha256:createHash("sha256").update(input).digest("hex")});
}

/** The scanner must return an explicit clean verdict; absence or error fails closed. */
export async function scanEditorialImage(input,declaredType,scanner){
 // The scanner must never retain the caller's mutable upload buffer.
 if(!Buffer.isBuffer(input)||input.length<24||input.length>MAX_BYTES)throw new Error("Invalid image size");
 const scannedBytes=Buffer.from(input);
 const metadata=inspectEditorialImage(scannedBytes,declaredType);
 if(typeof scanner!=="function")throw new Error("Media scanner required");
 const result=await scanner(scannedBytes,metadata);
 if(createHash("sha256").update(scannedBytes).digest("hex")!==metadata.sha256)throw new Error("Media changed during scan");
 if(result?.verdict!=="clean")throw new Error("Media scan rejected");
 if(typeof result.scannerId!=="string"||!/^[a-z0-9][a-z0-9.-]{2,119}$/.test(result.scannerId))throw new Error("Invalid scanner identity");
 return Object.freeze({...metadata,scannerId:result.scannerId});
}

