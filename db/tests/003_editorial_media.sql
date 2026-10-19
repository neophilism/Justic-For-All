-- Private asset metadata must be bounded, scanner-attributed, and absent from public views.
BEGIN;
DO $$
DECLARE actor uuid; asset uuid; blocked boolean := false;
BEGIN
 INSERT INTO identities(account_state) VALUES ('active') RETURNING id INTO actor;
 INSERT INTO cms_media_assets(uploaded_by,object_key,mime_type,byte_size,sha256,scanner_id)
 VALUES(actor,'editorial/private/synthetic.png','image/png',256,repeat('a',64),'ci-scanner')
 RETURNING id INTO asset;
 IF EXISTS (SELECT 1 FROM core_public_content WHERE slug='synthetic.png')
  THEN RAISE EXCEPTION 'asset leaked to public projection'; END IF;
 BEGIN
  INSERT INTO cms_media_assets(uploaded_by,object_key,mime_type,byte_size,sha256,scanner_id)
  VALUES(actor,'editorial/private/unsafe.svg','image/svg+xml',256,repeat('b',64),'ci-scanner');
 EXCEPTION WHEN check_violation THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'unsafe media type accepted'; END IF;
 blocked:=false;
 BEGIN
  INSERT INTO cms_media_assets(uploaded_by,object_key,mime_type,byte_size,sha256,scanner_id)
  VALUES(actor,'editorial/private/huge.png','image/png',10485761,repeat('c',64),'ci-scanner');
 EXCEPTION WHEN check_violation THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'oversized media accepted'; END IF;
END $$;
ROLLBACK;
