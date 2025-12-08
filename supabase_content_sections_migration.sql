-- Create content_sections table for WordPress-like page management
CREATE TABLE IF NOT EXISTS public.content_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    body_html TEXT DEFAULT '',
    seo_title TEXT,
    seo_description TEXT,
    published_at TIMESTAMPTZ,
    schedule_at TIMESTAMPTZ,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_sections_slug ON public.content_sections(slug);
CREATE INDEX IF NOT EXISTS idx_content_sections_updated_at ON public.content_sections(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_sections_published_at ON public.content_sections(published_at);

-- Enable Row Level Security
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published pages
CREATE POLICY "Public pages are viewable by everyone"
ON public.content_sections FOR SELECT
USING (published_at IS NOT NULL);

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all pages"
ON public.content_sections FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- Insert some sample pages for testing
INSERT INTO public.content_sections (slug, title, body_html, seo_title, seo_description) VALUES
('about-us', 'About Us', '<h1>About Our Company</h1><p>We are a leading logistics company...</p>', 'About Us - WAHL Logistics', 'Learn more about WAHL Logistics and our services'),
('privacy-policy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>', 'Privacy Policy - WAHL Logistics', 'Read our privacy policy'),
('terms-of-service', 'Terms of Service', '<h1>Terms of Service</h1><p>Please read these terms carefully...</p>', 'Terms of Service - WAHL Logistics', 'Terms and conditions for using our services')
ON CONFLICT (slug) DO NOTHING;

-- Grant permissions
GRANT ALL ON public.content_sections TO authenticated;
GRANT SELECT ON public.content_sections TO anon;
