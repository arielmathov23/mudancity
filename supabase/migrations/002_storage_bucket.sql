-- Storage bucket for item photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-photos', 'item-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY item_photos_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'item-photos');

-- Authenticated upload (owner validated in app layer)
CREATE POLICY item_photos_auth_insert ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'item-photos' AND auth.role() = 'authenticated');

CREATE POLICY item_photos_auth_update ON storage.objects
  FOR UPDATE USING (bucket_id = 'item-photos' AND auth.role() = 'authenticated');

CREATE POLICY item_photos_auth_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'item-photos' AND auth.role() = 'authenticated');
