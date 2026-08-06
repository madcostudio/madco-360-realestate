-- SITE CONTENT TABLE FOR CMS ANNOUNCEMENTS AND HERO ORDERING
CREATE TABLE IF NOT EXISTS public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admin manage site_content" ON public.site_content FOR ALL USING (public.is_admin());

-- Seed initial default content
INSERT INTO public.site_content (key, value) VALUES
  ('announcement_banner', '{"enabled": true, "text": "⚡ 360° Walkthrough Guarantee — Every listing room-to-room spatial scanned in HD."}'::jsonb),
  ('homepage_featured', '{"featured_slugs": ["luxury-2bhk-penthouse", "modern-3bhk-garden-villa"]}'::jsonb)
ON CONFLICT (key) DO NOTHING;
