-- Allow anonymous read of moves linked to open publications (public feed + product pages)
CREATE POLICY moves_public_read ON moves FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM publications p
      WHERE p.move_id = moves.id AND p.status = 'open'
    )
  );
