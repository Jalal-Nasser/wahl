-- Create WAHL content tables in MySQL (Plesk)
CREATE TABLE IF NOT EXISTS wahl_site_settings (
  id CHAR(36) PRIMARY KEY,
  site_name VARCHAR(255) DEFAULT 'WAHL',
  phone VARCHAR(100),
  email VARCHAR(255),
  location VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wahl_hero_slides (
  id CHAR(36) PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  sort_order INT DEFAULT 0,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wahl_clients (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Triggers to auto-generate UUIDs when inserting without id (MySQL 8.0+)
DELIMITER $$
CREATE TRIGGER wahl_site_settings_uuid BEFORE INSERT ON wahl_site_settings FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = (SELECT REPLACE(UUID(), '-', ''));
  END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER wahl_hero_slides_uuid BEFORE INSERT ON wahl_hero_slides FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = (SELECT REPLACE(UUID(), '-', ''));
  END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER wahl_clients_uuid BEFORE INSERT ON wahl_clients FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = (SELECT REPLACE(UUID(), '-', ''));
  END IF;
END$$
DELIMITER ;
