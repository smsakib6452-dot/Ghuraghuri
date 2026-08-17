-- ============================================================================
--  GHURAGHURI - MySQL SCHEMA (XAMPP)
--  Import via phpMyAdmin (http://localhost/phpmyadmin) or:
--    mysql -u root -p < database/ghuraghuri.sql
--  Run from the project root against the `ghuraghuri` database.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS ghuraghuri
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE ghuraghuri;

-- ---------------------------------------------------------------------------
-- destinations
-- Mirrors the static data/destinations.js dataset so admin edits can be
-- persisted server-side in future releases. Populated by the seed script.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS destinations (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug            VARCHAR(120) NOT NULL,
  name            VARCHAR(190) NOT NULL,
  name_bn         VARCHAR(190) NOT NULL DEFAULT '',
  division        VARCHAR(120) NOT NULL DEFAULT '',
  district        VARCHAR(120) NOT NULL DEFAULT '',
  upazila         VARCHAR(120) NOT NULL DEFAULT '',
  latitude        DECIMAL(9,6) NOT NULL DEFAULT 0,
  longitude       DECIMAL(9,6) NOT NULL DEFAULT 0,
  category        VARCHAR(60)  NOT NULL DEFAULT '',
  categories      JSON         NULL,
  rating          DECIMAL(2,1) NOT NULL DEFAULT 0,
  review_count    INT UNSIGNED NOT NULL DEFAULT 0,
  featured_image  TEXT         NULL,
  status          ENUM('active','hidden','seasonal','developing','remote') NOT NULL DEFAULT 'active',
  featured        TINYINT(1)   NOT NULL DEFAULT 0,
  popularity      ENUM('low','medium','high','very_high') NOT NULL DEFAULT 'medium',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_dest_slug (slug),
  KEY idx_dest_district (district),
  KEY idx_dest_division (division)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- hotels
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hotels (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider        VARCHAR(40)  NOT NULL DEFAULT 'ghuraghuri',
  provider_id     VARCHAR(190) NOT NULL DEFAULT '',
  place_id        VARCHAR(190) NOT NULL DEFAULT '',
  slug            VARCHAR(120) NOT NULL,
  name            VARCHAR(190) NOT NULL,
  name_bn         VARCHAR(190) NOT NULL DEFAULT '',
  address         TEXT         NULL,
  district        VARCHAR(120) NOT NULL DEFAULT '',
  division        VARCHAR(120) NOT NULL DEFAULT '',
  latitude        DECIMAL(9,6) NOT NULL DEFAULT 0,
  longitude       DECIMAL(9,6) NOT NULL DEFAULT 0,
  rating          DECIMAL(2,1) NOT NULL DEFAULT 0,
  review_count    INT UNSIGNED NOT NULL DEFAULT 0,
  price           INT UNSIGNED NULL,
  currency        CHAR(3)      NOT NULL DEFAULT 'BDT',
  featured_image  TEXT         NULL,
  amenities       JSON         NULL,
  status          ENUM('active','hidden') NOT NULL DEFAULT 'active',
  featured        TINYINT(1)   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hotel_provider_id (provider, provider_id),
  UNIQUE KEY uq_hotel_slug (slug),
  KEY idx_hotel_district (district),
  KEY idx_hotel_coords (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- restaurants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS restaurants (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider        VARCHAR(40)  NOT NULL DEFAULT 'ghuraghuri',
  provider_id     VARCHAR(190) NOT NULL DEFAULT '',
  place_id        VARCHAR(190) NOT NULL DEFAULT '',
  slug            VARCHAR(120) NOT NULL,
  name            VARCHAR(190) NOT NULL,
  name_bn         VARCHAR(190) NOT NULL DEFAULT '',
  address         TEXT         NULL,
  district        VARCHAR(120) NOT NULL DEFAULT '',
  division        VARCHAR(120) NOT NULL DEFAULT '',
  latitude        DECIMAL(9,6) NOT NULL DEFAULT 0,
  longitude       DECIMAL(9,6) NOT NULL DEFAULT 0,
  rating          DECIMAL(2,1) NOT NULL DEFAULT 0,
  review_count    INT UNSIGNED NOT NULL DEFAULT 0,
  price_level     TINYINT UNSIGNED NULL,
  cuisine         JSON         NULL,
  featured_image  TEXT         NULL,
  status          ENUM('active','hidden') NOT NULL DEFAULT 'active',
  featured        TINYINT(1)   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_rest_provider_id (provider, provider_id),
  UNIQUE KEY uq_rest_slug (slug),
  KEY idx_rest_district (district),
  KEY idx_rest_coords (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- transport_providers
-- Config flags for transport integrations (no secrets stored here).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transport_providers (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(60)  NOT NULL,
  code        VARCHAR(40)  NOT NULL,
  types       JSON         NULL,            -- e.g. ["bus","train"]
  enabled     TINYINT(1)   NOT NULL DEFAULT 0,
  status      VARCHAR(40)  NOT NULL DEFAULT 'not_configured',
  PRIMARY KEY (id),
  UNIQUE KEY uq_tp_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- transport_stations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transport_stations (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(190) NOT NULL,
  name_bn     VARCHAR(190) NOT NULL DEFAULT '',
  city        VARCHAR(120) NOT NULL DEFAULT '',
  type        VARCHAR(40)  NOT NULL DEFAULT 'bus',  -- bus|train|flight|ferry
  latitude    DECIMAL(9,6) NOT NULL DEFAULT 0,
  longitude   DECIMAL(9,6) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ts_name_type (name, type),
  KEY idx_ts_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- transport_routes
-- Static / administrative route metadata (not live inventory).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transport_routes (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  from_city       VARCHAR(120) NOT NULL,
  to_city         VARCHAR(120) NOT NULL,
  transport_type  VARCHAR(40)  NOT NULL,
  distance_km     DECIMAL(8,1) NOT NULL DEFAULT 0,
  typical_minutes INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tr_pair (from_city, to_city, transport_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- provider_mappings
-- Deduplication key: same establishment from multiple providers.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS provider_mappings (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type   VARCHAR(40)  NOT NULL,       -- hotel|restaurant
  canonical_id  INT UNSIGNED NOT NULL,
  provider      VARCHAR(40)  NOT NULL,
  provider_id   VARCHAR(190) NOT NULL,
  place_id      VARCHAR(190) NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  UNIQUE KEY uq_pm (entity_type, provider, provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- places
-- Normalised "point of interest" records (hotel/restaurant/attraction), used
-- for feature/hide metadata and deduplication.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS places (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  place_id    VARCHAR(190) NOT NULL,
  entity_type VARCHAR(40)  NOT NULL,          -- hotel|restaurant|attraction
  name        VARCHAR(190) NOT NULL,
  latitude    DECIMAL(9,6) NOT NULL DEFAULT 0,
  longitude   DECIMAL(9,6) NOT NULL DEFAULT 0,
  featured    TINYINT(1)   NOT NULL DEFAULT 0,
  status      ENUM('active','hidden') NOT NULL DEFAULT 'active',
  PRIMARY KEY (id),
  UNIQUE KEY uq_places (entity_type, place_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- api_cache
-- Server-side response cache for upstream calls (also used by FileCache
-- fallback when MySQL is off).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_cache (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cache_key   VARCHAR(190) NOT NULL,
  value       MEDIUMTEXT   NULL,
  expires_at  DATETIME     NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cache_key (cache_key),
  KEY idx_cache_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;