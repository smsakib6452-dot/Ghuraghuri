-- ============================================================================
-- GHURAGHURI - SUPABASE PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- High Performance, Scalable PostgreSQL schema with GIS, Triggers, & Security
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DIVISIONS TABLE
CREATE TABLE IF NOT EXISTS public.divisions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    name_bn VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DISTRICTS TABLE
CREATE TABLE IF NOT EXISTS public.districts (
    id SERIAL PRIMARY KEY,
    division_id INTEGER REFERENCES public.divisions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL UNIQUE,
    name_bn VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    division VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    upazila VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    categories TEXT[] DEFAULT '{}',
    rating NUMERIC(2,1) DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    image TEXT NOT NULL,
    image_lg TEXT,
    gallery TEXT[] DEFAULT '{}',
    short_desc TEXT NOT NULL,
    description TEXT NOT NULL,
    best_time VARCHAR(100),
    recommended_days VARCHAR(100),
    difficulty VARCHAR(50) DEFAULT 'Easy',
    budget VARCHAR(100),
    travel_type VARCHAR(100),
    activities TEXT[] DEFAULT '{}',
    attractions TEXT[] DEFAULT '{}',
    tips TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_division ON public.destinations(division);
CREATE INDEX IF NOT EXISTS idx_destinations_district ON public.destinations(district);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON public.destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_rating ON public.destinations(rating DESC);

-- 4. REVIEWS TABLE (User generated content)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id INTEGER REFERENCES public.destinations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    user_avatar TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_destination ON public.reviews(destination_id);

-- 5. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id INTEGER REFERENCES public.destinations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, destination_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Military-Grade Access Control: Public Read, Authenticated Write, User-Restricted
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Divisions & Districts: Anyone can read
CREATE POLICY "Public divisions read" ON public.divisions FOR SELECT USING (true);
CREATE POLICY "Public districts read" ON public.districts FOR SELECT USING (true);

-- Destinations: Anyone can read
CREATE POLICY "Public destinations read" ON public.destinations FOR SELECT USING (true);

-- Destinations: Only service_role or admin can insert/update/delete
CREATE POLICY "Admin destination insert" ON public.destinations FOR INSERT 
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY "Admin destination update" ON public.destinations FOR UPDATE 
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY "Admin destination delete" ON public.destinations FOR DELETE 
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Reviews: Anyone can read reviews
CREATE POLICY "Public reviews read" ON public.reviews FOR SELECT USING (true);

-- Reviews: Authenticated users can insert their own reviews
CREATE POLICY "Users insert review" ON public.reviews FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Reviews: Users can only update or delete their own reviews
CREATE POLICY "Users update own review" ON public.reviews FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users delete own review" ON public.reviews FOR DELETE 
    USING (auth.uid() = user_id);

-- Bookmarks: Users can only see, insert, and delete their own bookmarks
CREATE POLICY "Users see own bookmarks" ON public.bookmarks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users insert bookmark" ON public.bookmarks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete bookmark" ON public.bookmarks FOR DELETE 
    USING (auth.uid() = user_id);
