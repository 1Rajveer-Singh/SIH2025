-- Sample data for Rockfall Prediction System
-- This script inserts test data for development and testing

-- Insert sample users
INSERT INTO users (id, username, email, password_hash, role, full_name, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'admin', 'admin@rockfall.system', '$2b$12$LQv3c1yqBwYb5XKkqZ.Gx.o8VzqSzqZ7gZKxWQnXqWrG2F8Hx.K7e', 'admin', 'System Administrator', '+1-555-0101'),
('22222222-2222-2222-2222-222222222222', 'field.worker', 'field.worker@rockfall.system', '$2b$12$LQv3c1yqBwYb5XKkqZ.Gx.o8VzqSzqZ7gZKxWQnXqWrG2F8Hx.K7e', 'field_worker', 'John Field Worker', '+1-555-0102'),
('33333333-3333-3333-3333-333333333333', 'analyst', 'analyst@rockfall.system', '$2b$12$LQv3c1yqBwYb5XKkqZ.Gx.o8VzqSzqZ7gZKxWQnXqWrG2F8Hx.K7e', 'analyst', 'Dr. Sarah Analyst', '+1-555-0103'),
('44444444-4444-4444-4444-444444444444', 'viewer', 'viewer@rockfall.system', '$2b$12$LQv3c1yqBwYb5XKkqZ.Gx.o8VzqSzqZ7gZKxWQnXqWrG2F8Hx.K7e', 'viewer', 'Mike Viewer', '+1-555-0104');

-- Insert sample geological sites
INSERT INTO geological_sites (id, name, description, location, address, elevation, area_coverage, site_type, status, risk_level, installation_date, last_inspection, created_by) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mountain Ridge Alpha', 'High-risk rockfall area along mountain highway', ST_SetSRID(ST_MakePoint(-105.2705, 40.0150), 4326), 'Rocky Mountain National Park, CO, USA', 3048.00, 50000.00, 'mountain_slope', 'active', 'high', '2023-01-15', '2024-01-19 14:30:00+00', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Cliff Side Beta', 'Coastal cliff monitoring site', ST_SetSRID(ST_MakePoint(-105.7821, 39.5501), 4326), 'Boulder County, CO, USA', 1650.00, 25000.00, 'cliff_face', 'active', 'medium', '2023-03-20', '2024-01-18 09:15:00+00', '11111111-1111-1111-1111-111111111111'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Quarry Gamma', 'Former quarry site with unstable slopes', ST_SetSRID(ST_MakePoint(-92.6390, 38.2904), 4326), 'Missouri Quarry District, MO, USA', 250.00, 75000.00, 'quarry', 'maintenance', 'low', '2023-06-10', '2024-01-15 11:45:00+00', '11111111-1111-1111-1111-111111111111'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Canyon Delta', 'Critical rockfall zone in national park', ST_SetSRID(ST_MakePoint(-112.1401, 36.0544), 4326), 'Grand Canyon National Park, AZ, USA', 2134.00, 100000.00, 'canyon_wall', 'active', 'critical', '2023-02-28', '2024-01-20 08:00:00+00', '11111111-1111-1111-1111-111111111111'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Valley Epsilon', 'Valley floor monitoring for debris flow', ST_SetSRID(ST_MakePoint(-119.5383, 37.8651), 4326), 'Yosemite National Park, CA, USA', 1200.00, 30000.00, 'valley_floor', 'active', 'medium', '2023-04-12', '2024-01-17 16:20:00+00', '11111111-1111-1111-1111-111111111111');

-- Insert sample sensors
INSERT INTO sensors (id, site_id, sensor_type, model, serial_number, location, installation_date, calibration_date, status, sampling_rate, configuration) VALUES
-- Mountain Ridge Alpha sensors
('a0000001-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'seismic', 'GeoScope-3000', 'GS3000-001', ST_SetSRID(ST_MakePoint(-105.2705, 40.0150), 4326), '2023-01-15', '2024-01-01', 'active', 100, '{"sensitivity": "high", "frequency_range": "0.1-50Hz"}'),
('a0000002-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tilt', 'TiltMaster-200', 'TM200-001', ST_SetSRID(ST_MakePoint(-105.2706, 40.0151), 4326), '2023-01-15', '2024-01-01', 'active', 300, '{"resolution": "0.001deg", "range": "±5deg"}'),
('a0000003-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'strain', 'StrainGuard-500', 'SG500-001', ST_SetSRID(ST_MakePoint(-105.2707, 40.0152), 4326), '2023-01-15', '2024-01-01', 'active', 600, '{"gauge_factor": "2.1", "bridge_resistance": "350ohm"}'),
('a0000004-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'weather', 'WeatherPro-X1', 'WPX1-001', ST_SetSRID(ST_MakePoint(-105.2708, 40.0153), 4326), '2023-01-15', '2024-01-01', 'active', 900, '{"sensors": ["temp", "humidity", "pressure", "wind"]}'),

-- Cliff Side Beta sensors  
('b0000001-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'seismic', 'GeoScope-3000', 'GS3000-002', ST_SetSRID(ST_MakePoint(-105.7821, 39.5501), 4326), '2023-03-20', '2024-01-01', 'active', 100, '{"sensitivity": "medium", "frequency_range": "0.1-50Hz"}'),
('b0000002-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'camera', 'RockCam-HD', 'RCHD-001', ST_SetSRID(ST_MakePoint(-105.7822, 39.5502), 4326), '2023-03-20', '2024-01-01', 'active', 3600, '{"resolution": "1920x1080", "night_vision": true}'),
('b0000003-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'laser', 'LaserScan-Pro', 'LSP-001', ST_SetSRID(ST_MakePoint(-105.7823, 39.5503), 4326), '2023-03-20', '2024-01-01', 'active', 1800, '{"range": "1000m", "accuracy": "1mm"}'),

-- Canyon Delta sensors (high density for critical site)
('d0000001-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'seismic', 'GeoScope-3000', 'GS3000-003', ST_SetSRID(ST_MakePoint(-112.1401, 36.0544), 4326), '2023-02-28', '2024-01-01', 'active', 50, '{"sensitivity": "very_high", "frequency_range": "0.05-100Hz"}'),
('d0000002-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'seismic', 'GeoScope-3000', 'GS3000-004', ST_SetSRID(ST_MakePoint(-112.1402, 36.0545), 4326), '2023-02-28', '2024-01-01', 'active', 50, '{"sensitivity": "very_high", "frequency_range": "0.05-100Hz"}'),
('d0000003-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'tilt', 'TiltMaster-200', 'TM200-002', ST_SetSRID(ST_MakePoint(-112.1403, 36.0546), 4326), '2023-02-28', '2024-01-01', 'active', 180, '{"resolution": "0.0001deg", "range": "±2deg"}'),
('d0000004-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'strain', 'StrainGuard-500', 'SG500-002', ST_SetSRID(ST_MakePoint(-112.1404, 36.0547), 4326), '2023-02-28', '2024-01-01', 'active', 300, '{"gauge_factor": "2.1", "bridge_resistance": "350ohm"}'),
('d0000005-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'weather', 'WeatherPro-X1', 'WPX1-002', ST_SetSRID(ST_MakePoint(-112.1405, 36.0548), 4326), '2023-02-28', '2024-01-01', 'active', 600, '{"sensors": ["temp", "humidity", "pressure", "wind"]}');

-- Insert sample sensor data (recent data)
INSERT INTO sensor_data (sensor_id, timestamp, value, unit, quality_score) VALUES
-- Seismic data
('a0000001-1111-1111-1111-111111111111', '2024-01-20 12:00:00+00', 0.0012, 'g', 0.98),
('a0000001-1111-1111-1111-111111111111', '2024-01-20 12:01:40+00', 0.0015, 'g', 0.97),
('a0000001-1111-1111-1111-111111111111', '2024-01-20 12:03:20+00', 0.0018, 'g', 0.99),
('a0000001-1111-1111-1111-111111111111', '2024-01-20 12:05:00+00', 0.0025, 'g', 0.96),
('a0000001-1111-1111-1111-111111111111', '2024-01-20 12:06:40+00', 0.0032, 'g', 0.95),

-- Tilt data
('a0000002-1111-1111-1111-111111111111', '2024-01-20 12:00:00+00', 0.125, 'deg', 0.99),
('a0000002-1111-1111-1111-111111111111', '2024-01-20 12:05:00+00', 0.128, 'deg', 0.98),
('a0000002-1111-1111-1111-111111111111', '2024-01-20 12:10:00+00', 0.132, 'deg', 0.99),
('a0000002-1111-1111-1111-111111111111', '2024-01-20 12:15:00+00', 0.135, 'deg', 0.97),

-- Critical site data showing increasing activity
('d0000001-4444-4444-4444-444444444444', '2024-01-20 11:55:00+00', 0.0045, 'g', 0.99),
('d0000001-4444-4444-4444-444444444444', '2024-01-20 11:55:50+00', 0.0052, 'g', 0.98),
('d0000001-4444-4444-4444-444444444444', '2024-01-20 11:56:40+00', 0.0068, 'g', 0.97),
('d0000001-4444-4444-4444-444444444444', '2024-01-20 11:57:30+00', 0.0085, 'g', 0.96),
('d0000001-4444-4444-4444-444444444444', '2024-01-20 11:58:20+00', 0.0112, 'g', 0.95);

-- Insert sample alerts
INSERT INTO alerts (id, site_id, severity, title, message, alert_type, is_active, created_at) VALUES
('alert001-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'critical', 'Critical Seismic Activity Detected', 'Seismic sensor readings have exceeded critical thresholds. Immediate evacuation recommended for areas below the monitored slope.', 'seismic_threshold', TRUE, '2024-01-20 11:58:30+00'),
('alert002-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'high', 'Tilt Sensor Anomaly', 'Significant change in slope angle detected. Monitoring closely for potential instability.', 'tilt_anomaly', TRUE, '2024-01-20 12:15:30+00'),
('alert003-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'medium', 'Weather Warning', 'Heavy precipitation forecast may increase rockfall risk. Enhanced monitoring activated.', 'weather_warning', TRUE, '2024-01-20 08:00:00+00'),
('alert004-4444-4444-4444-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'low', 'Maintenance Due', 'Scheduled maintenance window approaching for laser scanner equipment.', 'maintenance_reminder', FALSE, '2024-01-19 10:00:00+00');

-- Insert sample predictions
INSERT INTO predictions (id, site_id, model_version, prediction_type, confidence, probability, predicted_volume, time_horizon, input_features, model_output, validation_score, created_by, created_at) VALUES
('pred0001-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'v2.1.0', 'rockfall_risk', 'high', 0.8750, 150.50, 24, '{"seismic_activity": 0.0112, "tilt_change": 0.025, "weather_score": 0.7}', '{"risk_factors": ["seismic", "geological"], "recommendations": ["evacuation", "monitoring"]}', 0.92, '33333333-3333-3333-3333-333333333333', '2024-01-20 12:00:00+00'),
('pred0002-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'v2.1.0', 'rockfall_risk', 'medium', 0.6250, 85.25, 48, '{"seismic_activity": 0.0032, "tilt_change": 0.015, "weather_score": 0.5}', '{"risk_factors": ["tilt"], "recommendations": ["enhanced_monitoring"]}', 0.88, '33333333-3333-3333-3333-333333333333', '2024-01-20 12:30:00+00'),
('pred0003-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'v2.1.0', 'volume_estimate', 'medium', 0.4500, 25.75, 72, '{"historical_events": 3, "slope_angle": 45, "material_type": "limestone"}', '{"volume_range": "20-35", "confidence_interval": "0.35-0.65"}', 0.85, '33333333-3333-3333-3333-333333333333', '2024-01-20 09:15:00+00');

-- Insert sample environmental data
INSERT INTO environmental_data (site_id, timestamp, temperature, humidity, precipitation, wind_speed, wind_direction, atmospheric_pressure, source) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-01-20 12:00:00+00', -5.2, 65.0, 0.0, 12.5, 270, 1013.25, 'weather_station'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-01-20 11:00:00+00', -4.8, 68.0, 0.2, 15.2, 275, 1012.85, 'weather_station'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-01-20 12:00:00+00', 12.8, 55.0, 2.5, 8.7, 180, 1015.20, 'weather_station'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '2024-01-20 12:00:00+00', 18.5, 35.0, 0.0, 5.2, 90, 1018.75, 'weather_station'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-01-20 12:00:00+00', 8.2, 72.0, 5.8, 20.3, 225, 1010.50, 'weather_station');

-- Insert sample geological events
INSERT INTO geological_events (id, site_id, event_type, magnitude, volume, location, start_time, end_time, damage_assessment, verified_by) VALUES
('event001-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'rockfall', 3.2, 125.50, ST_SetSRID(ST_MakePoint(-112.1401, 36.0544), 4326), '2024-01-15 14:25:00+00', '2024-01-15 14:27:00+00', 'Minor trail damage, no casualties. Trail closure implemented.', '22222222-2222-2222-2222-222222222222'),
('event002-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'rockfall', 2.1, 45.25, ST_SetSRID(ST_MakePoint(-105.2705, 40.0150), 4326), '2024-01-10 09:15:00+00', '2024-01-10 09:16:30+00', 'Small debris on access road, cleared within 2 hours.', '22222222-2222-2222-2222-222222222222');

-- Insert sample maintenance logs
INSERT INTO maintenance_logs (id, site_id, sensor_id, maintenance_type, description, technician_name, start_time, end_time, cost, performed_by) VALUES
('maint001-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000001-1111-1111-1111-111111111111', 'calibration', 'Annual calibration of seismic sensor', 'Mike Tech', '2024-01-01 09:00:00+00', '2024-01-01 11:30:00+00', 250.00, '22222222-2222-2222-2222-222222222222'),
('maint002-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b0000002-2222-2222-2222-222222222222', 'repair', 'Camera lens cleaning and housing seal replacement', 'Sarah Tech', '2024-01-05 13:00:00+00', '2024-01-05 15:45:00+00', 180.00, '22222222-2222-2222-2222-222222222222');

-- Insert notification preferences
INSERT INTO notification_preferences (user_id, email_notifications, push_notifications, sms_notifications, alert_threshold, site_notifications) VALUES
('11111111-1111-1111-1111-111111111111', TRUE, TRUE, TRUE, 'low', '{"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "cccccccc-cccc-cccc-cccc-cccccccccccc", "dddddddd-dddd-dddd-dddd-dddddddddddd", "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"}'),
('22222222-2222-2222-2222-222222222222', TRUE, TRUE, FALSE, 'medium', '{"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "dddddddd-dddd-dddd-dddd-dddddddddddd"}'),
('33333333-3333-3333-3333-333333333333', TRUE, FALSE, FALSE, 'high', '{"dddddddd-dddd-dddd-dddd-dddddddddddd"}'),
('44444444-4444-4444-4444-444444444444', FALSE, TRUE, FALSE, 'critical', '{}');

-- Update sequences to avoid conflicts
SELECT setval('users_id_seq', 100, false);
SELECT setval('geological_sites_id_seq', 100, false);
SELECT setval('sensors_id_seq', 100, false);
