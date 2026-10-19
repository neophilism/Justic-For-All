-- JFA-14: disposable publication, approval and withdrawal assertions.
BEGIN;
DO $$
DECLARE author_id uuid; reviewer_a uuid; reviewer_b uuid; entry_id uuid; draft_id uuid;
 published_id uuid; blocked boolean := false;
BEGIN
 INSERT INTO identities(account_state) VALUES('active') RETURNING id INTO author_id;
 INSERT INTO identities(account_state) VALUES('active') RETURNING id INTO reviewer_a;
 INSERT INTO identities(account_state) VALUES('active') RETURNING id INTO reviewer_b;
 INSERT INTO cms_entries(entry_type,slug,locale,visibility,current_revision)
 VALUES('article','synthetic-reviewed-publication','en','private',1) RETURNING id INTO entry_id;
 INSERT INTO cms_revisions(entry_id,version,content,author_id,editorial_state,content_hash)
 VALUES(entry_id,1,'{"title":"Synthetic review"}'::jsonb,author_id,'draft',repeat('a',64))
 RETURNING id INTO draft_id;
 BEGIN
  INSERT INTO cms_revisions(entry_id,version,content,author_id,editorial_state,content_hash)
  VALUES(entry_id,2,'{"title":"Synthetic review"}'::jsonb,author_id,'published',repeat('a',64));
 EXCEPTION WHEN raise_exception THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'unreviewed publication accepted'; END IF;
 INSERT INTO cms_review_workflows(entry_id,source_revision_id,state,row_version)
 VALUES(entry_id,draft_id,'approved',4);
 INSERT INTO publication_approvals(revision_id,approver_id,decision,reason_code)
 VALUES(draft_id,reviewer_a,'approve','test-review');
 blocked:=false;
 BEGIN
  INSERT INTO cms_revisions(entry_id,version,content,author_id,editorial_state,content_hash)
  VALUES(entry_id,2,'{"title":"Synthetic review"}'::jsonb,author_id,'published',repeat('a',64));
 EXCEPTION WHEN raise_exception THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'single approval published high-risk content'; END IF;
 INSERT INTO publication_approvals(revision_id,approver_id,decision,reason_code)
 VALUES(draft_id,reviewer_b,'approve','test-review');
 INSERT INTO publication_approvals(revision_id,approver_id,decision,reason_code)
 VALUES(draft_id,reviewer_b,'revoke','test-revoke');
 blocked:=false;
 BEGIN
  INSERT INTO cms_revisions(entry_id,version,content,author_id,editorial_state,content_hash)
  VALUES(entry_id,2,'{"title":"Synthetic review"}'::jsonb,author_id,'published',repeat('a',64));
 EXCEPTION WHEN raise_exception THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'revoked approval remained effective'; END IF;
 INSERT INTO publication_approvals(revision_id,approver_id,decision,reason_code)
 VALUES(draft_id,reviewer_b,'approve','test-reapprove');
 INSERT INTO cms_revisions(entry_id,version,content,author_id,editorial_state,content_hash)
 VALUES(entry_id,2,'{"title":"Synthetic review"}'::jsonb,author_id,'published',repeat('a',64))
 RETURNING id INTO published_id;
 UPDATE cms_entries SET current_revision=2,visibility='public' WHERE id=entry_id;
 IF NOT EXISTS(SELECT 1 FROM core_public_content WHERE slug='synthetic-reviewed-publication')
  THEN RAISE EXCEPTION 'approved content not visible'; END IF;
 INSERT INTO cms_revisions(entry_id,version,content,author_id,editorial_state,content_hash)
 VALUES(entry_id,3,'{"title":"Synthetic review"}'::jsonb,author_id,'withdrawn',repeat('a',64));
 UPDATE cms_entries SET current_revision=3,visibility='withdrawn' WHERE id=entry_id;
 IF EXISTS(SELECT 1 FROM core_public_content WHERE slug='synthetic-reviewed-publication')
  THEN RAISE EXCEPTION 'withdrawn content still visible'; END IF;
 blocked:=false;
 BEGIN
  UPDATE cms_revisions SET editorial_state='draft' WHERE id=published_id;
 EXCEPTION WHEN raise_exception THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'published history was mutable'; END IF;
END $$;
ROLLBACK;
