-- Add nearest MRT station column to restaurants
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS nearest_mrt TEXT;

-- Index for filtering by MRT station
CREATE INDEX IF NOT EXISTS idx_restaurants_nearest_mrt ON restaurants (nearest_mrt)
  WHERE nearest_mrt IS NOT NULL;
