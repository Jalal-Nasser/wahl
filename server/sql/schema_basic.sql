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

-- App core tables for Plesk-based auth and shipments
CREATE TABLE IF NOT EXISTS wahl_users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'shipper',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wahl_carriers (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  service_types JSON,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wahl_addresses (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  label VARCHAR(100) NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wahl_shipments (
  id CHAR(36) PRIMARY KEY,
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  user_id CHAR(36) NOT NULL,
  carrier_id CHAR(36),
  sender_address JSON NOT NULL,
  recipient_address JSON NOT NULL,
  dimensions VARCHAR(50),
  service_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wahl_tracking_events (
  id CHAR(36) PRIMARY KEY,
  shipment_id CHAR(36) NOT NULL,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  event_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wahl_shipments_user_id ON wahl_shipments(user_id);
CREATE INDEX IF NOT EXISTS idx_wahl_shipments_tracking_number ON wahl_shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_wahl_shipments_status ON wahl_shipments(status);
CREATE INDEX IF NOT EXISTS idx_wahl_tracking_events_shipment_id ON wahl_tracking_events(shipment_id);

-- User settings for profile customization
CREATE TABLE IF NOT EXISTS wahl_user_settings (
  user_id CHAR(36) PRIMARY KEY,
  bio TEXT,
  avatar_url TEXT,
  theme VARCHAR(20) DEFAULT 'system',
  notifications_json JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Content management: sections and versions
CREATE TABLE IF NOT EXISTS wahl_content_sections (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  body_html MEDIUMTEXT,
  seo_title VARCHAR(255),
  seo_description VARCHAR(512),
  published_at TIMESTAMP NULL,
  schedule_at TIMESTAMP NULL,
  version INT DEFAULT 0,
  updated_by CHAR(36),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wahl_content_versions (
  id CHAR(36) PRIMARY KEY,
  section_id CHAR(36) NOT NULL,
  version INT NOT NULL,
  body_html MEDIUMTEXT,
  updated_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wahl_content_versions_section ON wahl_content_versions(section_id);

-- Audit logs
CREATE TABLE IF NOT EXISTS wahl_audit_logs (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  action VARCHAR(64) NOT NULL,
  target VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
