import {validateEditorialDocument} from './editorial-doc.mjs';
/** Defensive immutable public projection. Caller must authenticate and fetch from
 * a trusted published-revision query; this function is not an authorization gate. */
const ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function projectPublishedEditorial(row) {
 if(!row||typeof row!=='object'||Array.isArray(row)||
   row.visibility!=='public'||row.editorialState!=='published'||
   !ID.test(row.authorId||'')||!ID.test(row.reviewerId||'')||
   row.authorId===row.reviewerId||
   !Number.isSafeInteger(row.version)||row.version<1||
   typeof row.publishedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(row.publishedAt)||
   !Number.isFinite(Date.parse(row.publishedAt)))throw new TypeError('Unpublishable editorial record');
 const document=validateEditorialDocument(row.content);
 return Object.freeze({slug:document.slug,locale:document.locale,entryType:document.entry_type,
   version:row.version,authorId:row.authorId,reviewerId:row.reviewerId,
   publishedAt:row.publishedAt,document});
}
