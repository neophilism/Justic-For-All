-- Synthetically labeled fixture; this does not become a published initiative.
INSERT INTO initiatives(slug,display_name,public_description,status)
VALUES ('example-civic-literacy', 'Synthetic civic literacy example', 'Demonstration record. No participation or services are active.', 'planning')
ON CONFLICT(slug) DO NOTHING;
