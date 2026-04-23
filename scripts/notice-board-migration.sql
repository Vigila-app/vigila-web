-- Migration: Create notice_board and search_analytics tables
-- Run this SQL in your Supabase SQL editor or via the Supabase CLI

-- ============================================================
-- Table: notice_board
-- Purpose: Collect service requests from users in areas not yet
--          covered by existing Vigila services. Visible to VIGILs
--          in their covered postal codes.
-- ============================================================
CREATE TABLE IF NOT EXISTS notice_board (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  postal_code text NOT NULL,
  city text,
  service_type text NOT NULL CHECK (service_type IN (
    'companionship',
    'light_assistance',
    'medical_assistance',
    'house_keeping',
    'transportation',
    'specialized_care'
  )),
  status text DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'proposed', 'closed')),
  vigil_id uuid REFERENCES vigils(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE notice_board ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to insert (protected at API level via Altcha captcha)
CREATE POLICY "Public can insert notice_board"
  ON notice_board
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service_role (used by the admin client in API routes) can read and update
CREATE POLICY "Service role can read notice_board"
  ON notice_board
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can update notice_board"
  ON notice_board
  FOR UPDATE
  TO service_role
  USING (true);

-- ============================================================
-- Table: search_analytics
-- Purpose: Track public homepage searches for demand analytics
-- ============================================================
CREATE TABLE IF NOT EXISTS search_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  postal_code text,
  city text,
  lat numeric,
  lon numeric
);

-- Enable Row Level Security
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to insert (protected at API level via Altcha captcha)
CREATE POLICY "Public can insert search_analytics"
  ON search_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service_role can read analytics
CREATE POLICY "Service role can read search_analytics"
  ON search_analytics
  FOR SELECT
  TO service_role
  USING (true);

-- Add updated_at trigger for notice_board
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notice_board_updated_at
  BEFORE UPDATE ON notice_board
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
