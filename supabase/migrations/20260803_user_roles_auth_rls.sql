-- USER ROLES, AUTH & ROW LEVEL SECURITY (RLS) POLICIES
-- Madco Estates Real Estate Platform

-- 1. Create Role Enums and Update Profiles Table
CREATE TYPE user_role AS ENUM ('buyer', 'owner', 'admin');

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role user_role DEFAULT 'buyer'::user_role,
  is_owner boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Automatic Profile Creation Trigger on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, avatar_url, role, is_owner)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    new.phone,
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'buyer'::user_role),
    COALESCE((new.raw_user_meta_data->>'is_owner')::boolean, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  visitor_name text,
  visitor_phone text,
  visitor_email text,
  message text NOT NULL,
  status text CHECK (status IN ('new', 'contacted', 'closed')) DEFAULT 'new',
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Favourites Table
CREATE TABLE IF NOT EXISTS public.favourites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- 4. Saved Searches Table
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  filters jsonb DEFAULT '{}'::jsonb,
  email_alerts boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Mad.co Capture Bookings Table
CREATE TABLE IF NOT EXISTS public.capture_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_title text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  preferred_date date NOT NULL,
  contact_phone text NOT NULL,
  status text CHECK (status IN ('requested', 'scheduled', 'completed', 'cancelled')) DEFAULT 'requested',
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. Moderation Logs Table
CREATE TABLE IF NOT EXISTS public.moderation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES public.profiles(id),
  action text NOT NULL,
  target_id uuid NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Add Owner FK to Properties Table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capture_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions to check role in RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- PROPERTIES POLICIES
-- Published listings: readable by everyone (including anon)
CREATE POLICY "Published listings are readable by everyone"
  ON public.properties FOR SELECT
  USING (status = 'published' OR owner_id = auth.uid() OR public.is_admin());

-- Draft/pending listings: readable/writable only by their owner + admins
CREATE POLICY "Owners and admins can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners and admins can update own properties"
  ON public.properties FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Owners and admins can delete own properties"
  ON public.properties FOR DELETE
  USING (owner_id = auth.uid() OR public.is_admin());

-- TOURS POLICIES
CREATE POLICY "Tours readable if property is published or user is owner/admin"
  ON public.tours FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = tours.property_id
      AND (p.status = 'published' OR p.owner_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Owners and admins can manage tours"
  ON public.tours FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = tours.property_id
      AND (p.owner_id = auth.uid() OR public.is_admin())
    )
  );

-- ENQUIRIES POLICIES
-- Readable by the enquirer, the listing owner, and admins
CREATE POLICY "Enquiries readable by enquirer, listing owner, and admin"
  ON public.enquiries FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = enquiries.property_id AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone (including visitors) can insert enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

-- FAVOURITES & SAVED SEARCHES POLICIES
-- Owner-only (authenticated user managing own bookmarks)
CREATE POLICY "Users can manage own favourites"
  ON public.favourites FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage own saved searches"
  ON public.saved_searches FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- CAPTURE BOOKINGS POLICIES
CREATE POLICY "Users can view own capture bookings or admin can view all"
  ON public.capture_bookings FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create capture bookings"
  ON public.capture_bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- MODERATION LOGS POLICIES
CREATE POLICY "Only admins can view moderation logs"
  ON public.moderation_logs FOR SELECT
  USING (public.is_admin());

-- STORAGE BUCKETS CONFIGURATION & POLICIES
-- Insert storage buckets if not existing
INSERT INTO storage.buckets (id, name, public) VALUES ('property-media', 'property-media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('tour-panoramas', 'tour-panoramas', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('capture-uploads', 'capture-uploads', false) ON CONFLICT (id) DO NOTHING;

-- Storage RLS: property-media & tour-panoramas public read
CREATE POLICY "Property Media Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'property-media');
CREATE POLICY "Tour Panoramas Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'tour-panoramas');
CREATE POLICY "Capture Uploads Admin Only" ON storage.objects FOR SELECT USING (bucket_id = 'capture-uploads' AND public.is_admin());
