-- Seed initial content for WAHL

INSERT INTO wahl_site_settings (id, site_name, phone, email, location)
VALUES (REPLACE(UUID(),'-',''), 'WAHL', '+966 12 345 6789', 'info@wahl.sa', 'Dammam, Saudi Arabia');

INSERT INTO wahl_hero_slides (id, image_url, title, subtitle, sort_order, active)
VALUES
  (REPLACE(UUID(),'-',''), 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Cargo%20container%20ship%20at%20sea%2C%20sunset%20lighting%2C%20stacked%20containers&image_size=landscape_16_9', 'Cargo Services In Our Country', 'Modern logistics solutions', 0, 1),
  (REPLACE(UUID(),'-',''), 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Port%20cranes%20loading%20containers%2C%20industrial%20logistics%20blue%20hour&image_size=landscape_16_9', 'Cargo Services In Our Country', 'Efficient port operations', 1, 1);

INSERT INTO wahl_clients (id, name, logo_url, sort_order, active)
VALUES
  (REPLACE(UUID(),'-',''), 'Client A', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Minimal%20modern%20corporate%20logo%20monogram%20blue%20white%20palette&image_size=square_hd', 0, 1),
  (REPLACE(UUID(),'-',''), 'Client B', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Minimal%20professional%20corporate%20logo%20wordmark%20navy%20gradient&image_size=square_hd', 1, 1);

INSERT INTO wahl_carriers (id, name, service_types, is_active)
VALUES
  (REPLACE(UUID(),'-',''), 'ExpressShip', JSON_ARRAY('Express','Standard','Overnight'), 1),
  (REPLACE(UUID(),'-',''), 'GlobalLogistics', JSON_ARRAY('International','Freight','Customs'), 1),
  (REPLACE(UUID(),'-',''), 'QuickCarrier', JSON_ARRAY('Same-Day','Next-Day','Ground'), 1);
