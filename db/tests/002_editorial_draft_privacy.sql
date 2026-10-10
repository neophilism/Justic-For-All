-- JFA-13A: verify drafts remain unpublished and the revision history is immutable.
-- Disposable CI transaction, never touches production user data.
BEGIN;
DO $$
DECLARE actor uuid; entry uuid; blocked boolean := false;
BEGIN
 INSERT INTO identities(account_state) VALUES ('active') RETURNING id INTO actor;
 INSERT INTO role_grants(subject_id,role,resource_scope) VALUES(actor,'editor','core');
 INSERT INTO cms_entries(entry_type,slug,locale,visibility,current_revision)
   VALUES('article','synthetic-editorial-draft','en','private',1) RETURNING id INTO entry;
 INSERT INTO cms_revisions(entry_id,version,content,author_id,editorial_state)
   VALUES(entry,1,'{"title":"Synthetic draft","summary":"Internal test only"}'::jsonb,actor,'draft');
 IF EXISTS (SELECT 1 FROM core_public_content WHERE slug='synthetic-editorial-draft')
  THEN RAISE EXCEPTION 'private draft leaked to public projection'; END IF;

 -- Public visibility alone is insufficient; the selected revision must be published.
 UPDATE cms_entries SET visibility='public' WHERE id=entry;
 IF EXISTS (SELECT 1 FROM core_public_content WHERE slug='synthetic-editorial-draft')
  THEN RAISE EXCEPTION 'draft leaked with public flag'; END IF;

 -- Immutability prevents a draft from being promoted by rewriting historical revision.
 BEGIN
  UPDATE cms_revisions SET editorial_state='published' WHERE entry_id=entry AND version=1;
 EXCEPTION WHEN raise_exception THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'historical draft revision was mutable'; END IF;
END $$;
ROLLBACK;
