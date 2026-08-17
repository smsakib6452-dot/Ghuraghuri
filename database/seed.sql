-- ============================================================================
--  GHURAGHURI - SEED DATA (optional)
--  Idempotent: safe to re-run. Loads demo transport providers/stations and a
--  few sample admin routes. Run AFTER ghuraghuri.sql.
-- ============================================================================
USE ghuraghuri;

INSERT INTO transport_providers (name, code, types, enabled, status) VALUES
  ('Bangladesh Road Transport', 'brtc',   JSON_ARRAY('bus'),    0, 'not_configured'),
  ('Bangladesh Railway',        'rail',   JSON_ARRAY('train'),  0, 'not_configured'),
  ('Biman Bangladesh Airlines', 'biman',  JSON_ARRAY('flight'), 0, 'not_configured'),
  ('BIWTA Launch Services',     'biwta',  JSON_ARRAY('ferry'),  0, 'not_configured'),
  ('Car Rental Network',        'car',    JSON_ARRAY('car','taxi'), 0, 'not_configured')
  ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO transport_stations (name, city, type, latitude, longitude) VALUES
  ('Kamalapur Railway Station', 'Dhaka', 'train', 23.7312, 90.4264),
  ('Kamlapur Bus Terminal (Saydabad)', 'Dhaka', 'bus', 23.7381, 90.4370),
  ('Shahjalal International Airport', 'Dhaka', 'flight', 23.8425, 90.3986),
  ('Cox''s Bazar Railway Station', 'Cox''s Bazar', 'train', 21.4401, 92.0148),
  ('Cox''s Bazar Bus Terminal', 'Cox''s Bazar', 'bus', 21.4262, 92.0006),
  ('Cox''s Bazar Airport', 'Cox''s Bazar', 'flight', 21.4522, 91.9639),
  ('Sylhet Railway Station', 'Sylhet', 'train', 24.8976, 91.8680),
  ('Osmani International Airport', 'Sylhet', 'flight', 24.9633, 91.8669),
  ('Rajshahi Railway Station', 'Rajshahi', 'train', 24.3745, 88.6042),
  ('Khulna Railway Station', 'Khulna', 'train', 22.8158, 89.5682)
  ON DUPLICATE KEY UPDATE city = VALUES(city);

INSERT INTO transport_routes (from_city, to_city, transport_type, distance_km, typical_minutes) VALUES
  ('Dhaka', 'Cox''s Bazar', 'bus', 390, 480),
  ('Dhaka', 'Cox''s Bazar', 'train', 400, 620),
  ('Dhaka', 'Cox''s Bazar', 'flight', 330, 60),
  ('Dhaka', 'Sylhet', 'bus', 250, 300),
  ('Dhaka', 'Sylhet', 'train', 280, 420),
  ('Dhaka', 'Sylhet', 'flight', 200, 45),
  ('Dhaka', 'Rajshahi', 'train', 250, 330),
  ('Dhaka', 'Khulna', 'bus', 260, 320)
  ON DUPLICATE KEY UPDATE distance_km = VALUES(distance_km);