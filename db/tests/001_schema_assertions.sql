-- Run in a disposable PostgreSQL 16 database after 0001_core.sql; no mutation persists.
BEGIN;
DO $$
DECLARE v integer; blocked boolean;
BEGIN
 SELECT count(*) INTO v FROM information_schema.tables
  WHERE table_schema='public' AND table_name IN ('identities','authenticators','profiles','contact_points','role_grants','initiatives','cms_entries','cms_revisions','publication_approvals','consent_records','interest_offers','subscriptions','privacy_requests','content_reports','moderation_actions','module_connections','public_projections','outbox_events','audit_events','health_observations','aggregate_metrics');
 IF v<>21 THEN RAISE EXCEPTION 'expected 21 core tables, found %',v; END IF;

 blocked:=false;
 BEGIN
  INSERT INTO initiatives(slug,display_name,public_description,status)
    VALUES ('invalid-state','Invalid','Synthetic only','not_a_state');
 EXCEPTION WHEN check_violation THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'initiative invalid state was accepted'; END IF;

 blocked:=false;
 BEGIN
  INSERT INTO module_connections(slug,enabled,verification_state,base_url,contract_version)
    VALUES ('disabled-check',true,'unverified','https://example.invalid','1.0.0');
 EXCEPTION WHEN check_violation THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'unverified module became enabled'; END IF;

 blocked:=false;
 BEGIN
  INSERT INTO public_projections(source_ref,source_version,release_state)
    VALUES ('synthetic-source','1','published');
 EXCEPTION WHEN check_violation THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'unapproved public projection was accepted'; END IF;

 INSERT INTO consent_records(subject_ref,purpose,scope,policy_version,decision)
  VALUES ('synthetic-subject','notifications','test','1','grant');
 blocked:=false;
 BEGIN
  UPDATE consent_records SET decision='withdraw' WHERE subject_ref='synthetic-subject';
 EXCEPTION WHEN raise_exception THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'immutable consent record was modified'; END IF;

 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name IN('core_public_initiatives','core_public_content') AND column_name ~ '(ciphertext|credential|identity|contact)')
 THEN RAISE EXCEPTION 'public view exposed restricted column'; END IF;
END $$;
ROLLBACK;
