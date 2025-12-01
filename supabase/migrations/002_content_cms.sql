-- Site settings
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'WAHL',
    phone TEXT,
    email TEXT,
    location TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero slides
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients logos
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON site_settings TO anon;
GRANT SELECT ON hero_slides TO anon;
GRANT SELECT ON clients TO anon;
GRANT ALL ON site_settings TO authenticated;
GRANT ALL ON hero_slides TO authenticated;
GRANT ALL ON clients TO authenticated;

CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public can read clients" ON clients FOR SELECT USING (true);

CREATE POLICY "Only admins can modify settings" ON site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    );

CREATE POLICY "Only admins can modify slides" ON hero_slides
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    );

CREATE POLICY "Only admins can modify clients" ON clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    );

INSERT INTO site_settings (site_name, phone, email, location)
VALUES ('WAHL', '+966 12 345 6789', 'info@wahl.sa', 'Dammam, Saudi Arabia')
ON CONFLICT DO NOTHING;

INSERT INTO hero_slides (image_url, title, subtitle, sort_order, active) VALUES
('https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Cargo%20container%20ship%20at%20sea%2C%20sunset%20lighting%2C%20stacked%20containers%2C%20professional%20maritime%20logistics&image_size=landscape_16_9','Cargo Services In Our Country','Modern logistics solutions',0,true),
('https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Port%20cranes%20loading%20containers%2C%20industrial%20logistics%2C%20blue%20hour%20lighting&image_size=landscape_16_9','Cargo Services In Our Country','Efficient port operations',1,true);

INSERT INTO clients (name, logo_url, sort_order, active) VALUES
('Client A','https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Minimal%20modern%20corporate%20logo%20monogram%20blue%20white%20palette&image_size=square_hd',0,true),
('Client B','https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Minimal%20professional%20corporate%20logo%20wordmark%20navy%20gradient&image_size=square_hd',1,true);
