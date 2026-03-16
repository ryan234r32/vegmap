-- ============================================================
-- Reports table for community trust system
-- Allows users to flag issues with restaurant listings
-- ============================================================

-- Report type enum
CREATE TYPE report_type AS ENUM (
  'permanently_closed',
  'relocated',
  'wrong_veg_type',
  'hidden_animal_ingredients',
  'wrong_hours',
  'wrong_address',
  'other'
);

-- Report status enum
CREATE TYPE report_status AS ENUM (
  'pending',
  'resolved',
  'dismissed'
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  description TEXT,
  -- For hidden_animal_ingredients reports, store which ones
  hidden_ingredients TEXT[] DEFAULT '{}',
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_reports_restaurant ON reports(restaurant_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_user ON reports(user_id);

-- RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Anyone can read reports (for showing badges)
CREATE POLICY "Reports are viewable by everyone"
  ON reports FOR SELECT
  USING (true);

-- Authenticated users can create reports
CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own pending reports
CREATE POLICY "Users can delete own pending reports"
  ON reports FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

-- Only admins can update reports (resolve/dismiss)
CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
