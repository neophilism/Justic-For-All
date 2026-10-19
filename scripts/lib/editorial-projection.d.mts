import type {EditorialDocument} from "./editorial-doc.mjs";
export declare function projectPublishedEditorial(row:{
 visibility:string;editorialState:string;authorId:string;reviewerId:string;
 version:number;publishedAt:string;content:unknown
}):Readonly<{slug:string;locale:string;entryType:EditorialDocument["entry_type"];
 version:number;authorId:string;reviewerId:string;publishedAt:string;document:EditorialDocument}>;
