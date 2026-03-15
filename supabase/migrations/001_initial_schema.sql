-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Vegetarian type enum
CREATE TYPE vegetarian_type AS ENUM (
  'vegan',
  'ovo_lacto',
  'lacto',
  'ovo',
  'five_spice',
  'vegetarian_friendly'
);

-- Price range enum
CREATE TYPE price_range AS ENUM ('$', '$$', '$$$', '$$$$');

-- Translation status enum
CREATE TYPE translation_status AS ENUM (
  'pending',
  'ai_translated',
  'community_reviewed',
  'verified'
);

-- Contribution status enum
CREATE TYPE contribution_status AS ENUM ('pending', 'approved', 'rejected');

-----------------------------------------------
-- RESTAURANTS
-----------------------------------------------
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_zh TEXT,
  slug TEXT UNIQUE NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  vegetarian_types vegetarian_type[] NOT NULL DEFAULT '{}',
  cuisine_tags TEXT[] DEFAULT '{}',
  price_range price_range,
  address_en TEXT,
  address_zh TEXT,
  city TEXT NOT NULL DEFAULT 'Taipei',
  district TEXT,
  location GEOGRAPHY(POINT, 4326),
  phone TEXT,
  website TEXT,
  opening_hours JSONB DEFAULT '{}',
  google_place_id TEXT UNIQUE,
  google_rating NUMERIC(2,1),
  google_maps_url TEXT,
  cover_image_url TEXT,
  avg_rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_restaurants_location ON restaurants USING GIST (location);
CREATE INDEX idx_restaurants_slug ON restaurants (slug);
CREATE INDEX idx_restaurants_district ON restaurants (district);
CREATE INDEX idx_restaurants_vegetarian_types ON restaurants USING GIN (vegetarian_types);
CREATE INDEX idx_restaurants_is_active ON restaurants (is_active) WHERE is_active = true;

-----------------------------------------------
-- PROFILES (extends auth.users)
-----------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  nationality TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-----------------------------------------------
-- REVIEWS
-----------------------------------------------
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_rating SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  food_rating SMALLINT CHECK (food_rating BETWEEN 1 AND 5),
  service_rating SMALLINT CHECK (service_rating BETWEEN 1 AND 5),
  value_rating SMALLINT CHECK (value_rating BETWEEN 1 AND 5),
  english_friendly_rating SMALLINT CHECK (english_friendly_rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  visit_date DATE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(restaurant_id, user_id)
);

CREATE INDEX idx_reviews_restaurant ON reviews (restaurant_id);
CREATE INDEX idx_reviews_user ON reviews (user_id);

-----------------------------------------------
-- REVIEW PHOTOS
-----------------------------------------------
CREATE TABLE review_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-----------------------------------------------
-- MENUS
-----------------------------------------------
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  photo_storage_path TEXT,
  translation_status translation_status DEFAULT 'pending',
  items JSONB DEFAULT '[]',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_menus_restaurant ON menus (restaurant_id);

-----------------------------------------------
-- MENU CONTRIBUTIONS
-----------------------------------------------
CREATE TABLE menu_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_index INTEGER NOT NULL,
  field TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL,
  status contribution_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-----------------------------------------------
-- FAVORITE LISTS
-----------------------------------------------
CREATE TABLE favorite_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_favorite_lists_user ON favorite_lists (user_id);
CREATE INDEX idx_favorite_lists_slug ON favorite_lists (slug) WHERE slug IS NOT NULL;

-----------------------------------------------
-- FAVORITE ITEMS
-----------------------------------------------
CREATE TABLE favorite_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES favorite_lists(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  note TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(list_id, restaurant_id)
);

-----------------------------------------------
-- HELPFUL VOTES (prevents duplicate votes)
-----------------------------------------------
CREATE TABLE helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-----------------------------------------------
-- FUNCTIONS & TRIGGERS
-----------------------------------------------

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_menus_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-calculate restaurant avg_rating and review_count
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants SET
    avg_rating = COALESCE((
      SELECT ROUND(AVG(overall_rating)::numeric, 1)
      FROM reviews WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
    ), 0),
    review_count = (
      SELECT COUNT(*)
      FROM reviews WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
    )
  WHERE id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_reviews_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

-- Auto-update helpful_count
CREATE OR REPLACE FUNCTION update_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reviews SET
    helpful_count = (
      SELECT COUNT(*) FROM helpful_votes
      WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
    )
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_helpful_votes_count
  AFTER INSERT OR DELETE ON helpful_votes
  FOR EACH ROW EXECUTE FUNCTION update_helpful_count();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-----------------------------------------------
-- ROW LEVEL SECURITY
-----------------------------------------------

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpful_votes ENABLE ROW LEVEL SECURITY;

-- Restaurants: public read, admin write
CREATE POLICY "Restaurants are viewable by everyone"
  ON restaurants FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage restaurants"
  ON restaurants FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Profiles: public read, own write
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

-- Reviews: public read, own CRUD
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Review photos: public read
CREATE POLICY "Review photos are viewable by everyone"
  ON review_photos FOR SELECT USING (true);

CREATE POLICY "Users can add photos to own reviews"
  ON review_photos FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM reviews WHERE id = review_id AND user_id = auth.uid())
  );

-- Menus: public read
CREATE POLICY "Menus are viewable by everyone"
  ON menus FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload menus"
  ON menus FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Menu contributions
CREATE POLICY "Contributions are viewable by everyone"
  ON menu_contributions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can suggest corrections"
  ON menu_contributions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorite lists: own + public
CREATE POLICY "Users can view own and public lists"
  ON favorite_lists FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can manage own lists"
  ON favorite_lists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists"
  ON favorite_lists FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists"
  ON favorite_lists FOR DELETE USING (auth.uid() = user_id);

-- Favorite items
CREATE POLICY "Users can view items in accessible lists"
  ON favorite_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM favorite_lists
      WHERE id = list_id AND (user_id = auth.uid() OR is_public = true)
    )
  );

CREATE POLICY "Users can manage items in own lists"
  ON favorite_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM favorite_lists WHERE id = list_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update items in own lists"
  ON favorite_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM favorite_lists WHERE id = list_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete items from own lists"
  ON favorite_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM favorite_lists WHERE id = list_id AND user_id = auth.uid())
  );

-- Helpful votes
CREATE POLICY "Votes are viewable by everyone"
  ON helpful_votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote"
  ON helpful_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own votes"
  ON helpful_votes FOR DELETE USING (auth.uid() = user_id);

-----------------------------------------------
-- NEARBY RESTAURANTS FUNCTION
-----------------------------------------------
CREATE OR REPLACE FUNCTION nearby_restaurants(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 2000,
  result_limit INTEGER DEFAULT 50
)
RETURNS SETOF restaurants AS $$
  SELECT *
  FROM restaurants
  WHERE is_active = true
    AND ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_meters
    )
  ORDER BY location <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  LIMIT result_limit;
$$ LANGUAGE sql STABLE;
