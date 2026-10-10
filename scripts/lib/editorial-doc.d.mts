export type EditorialRun={text:string;emphasis:"normal"|"strong"|"em"};
export type EditorialBlock=
 | {kind:"paragraph"|"heading"|"quote";runs:EditorialRun[]}
 | {kind:"list";items:string[]};
export type EditorialDocument={
 schema_version:1;
 entry_type:"page"|"article"|"resource"|"faq";
 slug:string;locale:string;title:string;summary:string;
 blocks:EditorialBlock[];
 media:Array<{kind:"image"|"audio"|"video";source_url:string;alt:string;caption:string}>;
};
export declare function validateEditorialDocument(value:unknown):EditorialDocument;
