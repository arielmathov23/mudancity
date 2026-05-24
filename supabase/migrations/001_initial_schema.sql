-- Mudancity POC initial schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('owner', 'buyer')),
  email TEXT,
  phone TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Moves (mudanzas)
CREATE TABLE moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Publications
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  move_id UUID NOT NULL REFERENCES moves(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  type TEXT NOT NULL DEFAULT 'bundle' CHECK (type IN ('bundle', 'subset')),
  public_slug TEXT NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(6), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_publications_slug ON publications(public_slug);
CREATE INDEX idx_publications_owner ON publications(owner_id);
CREATE INDEX idx_publications_move ON publications(move_id);

-- Items
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL CHECK (price > 0),
  photo_path TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_items_publication ON items(publication_id);

-- Included items for subset publications
CREATE TABLE publication_items (
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (publication_id, item_id)
);

-- Offers
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  move_id UUID NOT NULL REFERENCES moves(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  offered_price NUMERIC(12,2) NOT NULL CHECK (offered_price > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_offers_publication ON offers(publication_id);
CREATE INDEX idx_offers_buyer ON offers(buyer_id);

-- Offer items (subset offered)
CREATE TABLE offer_items (
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, item_id)
);

-- Owner responses (one per offer)
CREATE TABLE offer_responses (
  offer_id UUID PRIMARY KEY REFERENCES offers(id) ON DELETE CASCADE,
  response TEXT NOT NULL CHECK (response IN ('accepted', 'rejected')),
  response_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Coordination
CREATE TABLE coordinations (
  offer_id UUID PRIMARY KEY REFERENCES offers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'coordinated', 'closed', 'cancelled')),
  coordinated_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'buyer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordinations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_select_accepted_buyer ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM offers o
      JOIN offer_responses r ON r.offer_id = o.id
      JOIN publications p ON p.id = o.publication_id
      WHERE o.buyer_id = profiles.id
        AND p.owner_id = auth.uid()
        AND r.response = 'accepted'
    )
  );

-- Moves policies
CREATE POLICY moves_owner_all ON moves FOR ALL USING (owner_id = auth.uid());

-- Publications: public read, owner write
CREATE POLICY publications_public_read ON publications FOR SELECT USING (true);
CREATE POLICY publications_owner_write ON publications FOR ALL USING (owner_id = auth.uid());

-- Items: public read, owner write via publication
CREATE POLICY items_public_read ON items FOR SELECT USING (true);
CREATE POLICY items_owner_write ON items FOR ALL
  USING (EXISTS (SELECT 1 FROM publications p WHERE p.id = items.publication_id AND p.owner_id = auth.uid()));

-- Publication items
CREATE POLICY pub_items_public_read ON publication_items FOR SELECT USING (true);
CREATE POLICY pub_items_owner_write ON publication_items FOR ALL
  USING (EXISTS (SELECT 1 FROM publications p WHERE p.id = publication_items.publication_id AND p.owner_id = auth.uid()));

-- Offers
CREATE POLICY offers_insert_buyer ON offers FOR INSERT
  WITH CHECK (
    buyer_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.email IS NOT NULL AND pr.phone IS NOT NULL)
    AND EXISTS (SELECT 1 FROM publications p WHERE p.id = publication_id AND p.status = 'open' AND p.owner_id != auth.uid())
  );
CREATE POLICY offers_select_owner ON offers FOR SELECT
  USING (EXISTS (SELECT 1 FROM publications p WHERE p.id = offers.publication_id AND p.owner_id = auth.uid()));
CREATE POLICY offers_select_buyer ON offers FOR SELECT USING (buyer_id = auth.uid());

-- Offer items
CREATE POLICY offer_items_select ON offer_items FOR SELECT USING (true);
CREATE POLICY offer_items_insert ON offer_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM offers o WHERE o.id = offer_id AND o.buyer_id = auth.uid()));

-- Offer responses
CREATE POLICY offer_responses_owner ON offer_responses FOR ALL
  USING (EXISTS (
    SELECT 1 FROM offers o JOIN publications p ON p.id = o.publication_id
    WHERE o.id = offer_responses.offer_id AND p.owner_id = auth.uid()
  ));
CREATE POLICY offer_responses_buyer_read ON offer_responses FOR SELECT
  USING (EXISTS (SELECT 1 FROM offers o WHERE o.id = offer_responses.offer_id AND o.buyer_id = auth.uid()));

-- Coordinations
CREATE POLICY coordinations_owner ON coordinations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM offers o JOIN publications p ON p.id = o.publication_id
    WHERE o.id = coordinations.offer_id AND p.owner_id = auth.uid()
  ));
CREATE POLICY coordinations_buyer_read ON coordinations FOR SELECT
  USING (EXISTS (SELECT 1 FROM offers o WHERE o.id = coordinations.offer_id AND o.buyer_id = auth.uid()));

-- Storage bucket (run in Supabase dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('item-photos', 'item-photos', true);
