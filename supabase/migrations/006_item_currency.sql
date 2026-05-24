-- Item price currency (defaults to ARS for existing rows)
ALTER TABLE items
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'ARS'
  CHECK (currency IN ('ARS', 'USD', 'EUR', 'BRL', 'UYU', 'CLP'));
