export type ImageMetadata={mime:"image/png"|"image/jpeg";extension:"png"|"jpg";size:number;sha256:string};
export declare function inspectEditorialImage(input:Buffer,declaredType:string):ImageMetadata;
export declare function scanEditorialImage(input:Buffer,declaredType:string,scanner:(bytes:Buffer,metadata:ImageMetadata)=>Promise<{verdict:string;scannerId?:string}>):Promise<ImageMetadata&{scannerId:string}>;
