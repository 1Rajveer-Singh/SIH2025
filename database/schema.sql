-- Database setup for Rockfall Prediction System
-- This script creates the main database structure with PostGIS support

-- Create database (run as postgres superuser)
-- CREATE DATABASE rockfall_prediction;
-- \c rockfall_prediction;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'field_worker', 'analyst', 'viewer');
CREATE TYPE site_status AS ENUM ('active', 'inactive', 'maintenance', 'decommissioned');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE sensor_type AS ENUM ('seismic', 'tilt', 'strain', 'weather', 'camera', 'laser');
CREATE TYPE prediction_confidence AS ENUM ('low', 'medium', 'high', 'very_high');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    full_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Geological sites table
CREATE TABLE geological_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    elevation DECIMAL(10, 2),
    area_coverage DECIMAL(15, 2), -- in square meters
    site_type VARCHAR(50),
    status site_status NOT NULL DEFAULT 'active',
    risk_level alert_severity DEFAULT 'low',
    installation_date DATE,
    last_inspection TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sensors table
CREATE TABLE sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES geological_sites(id) ON DELETE CASCADE,
    sensor_type sensor_type NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    location GEOMETRY(POINT, 4326),
    installation_date DATE,
    calibration_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    sampling_rate INTEGER, -- in seconds
    configuration JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sensor data table (partitioned by date for performance)
CREATE TABLE sensor_data (
    id UUID DEFAULT uuid_generate_v4(),
    sensor_id UUID NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    value DECIMAL(15, 6) NOT NULL,
    unit VARCHAR(20),
    quality_score DECIMAL(3, 2) DEFAULT 1.0, -- 0.0 to 1.0
    raw_data JSONB,
    processed_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create partitions for sensor data (monthly partitions)
CREATE TABLE sensor_data_2024_01 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE sensor_data_2024_02 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE sensor_data_2024_03 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
CREATE TABLE sensor_data_2024_04 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
CREATE TABLE sensor_data_2024_05 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
CREATE TABLE sensor_data_2024_06 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
CREATE TABLE sensor_data_2024_07 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
CREATE TABLE sensor_data_2024_08 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
CREATE TABLE sensor_data_2024_09 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
CREATE TABLE sensor_data_2024_10 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
CREATE TABLE sensor_data_2024_11 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
CREATE TABLE sensor_data_2024_12 PARTITION OF sensor_data
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES geological_sites(id) ON DELETE CASCADE,
    severity alert_severity NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Predictions table
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES geological_sites(id) ON DELETE CASCADE,
    model_version VARCHAR(50),
    prediction_type VARCHAR(50), -- 'rockfall_risk', 'volume_estimate', etc.
    confidence prediction_confidence NOT NULL,
    probability DECIMAL(5, 4), -- 0.0000 to 1.0000
    predicted_volume DECIMAL(15, 2), -- in cubic meters
    time_horizon INTEGER, -- prediction horizon in hours
    input_features JSONB,
    model_output JSONB,
    validation_score DECIMAL(5, 4),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Environmental data table
CREATE TABLE environmental_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES geological_sites(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    temperature DECIMAL(5, 2), -- Celsius
    humidity DECIMAL(5, 2), -- Percentage
    precipitation DECIMAL(8, 2), -- mm
    wind_speed DECIMAL(6, 2), -- m/s
    wind_direction INTEGER, -- degrees
    atmospheric_pressure DECIMAL(8, 2), -- hPa
    source VARCHAR(50), -- 'weather_station', 'api', 'manual'
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Geological events table
CREATE TABLE geological_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES geological_sites(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'rockfall', 'landslide', 'earthquake', etc.
    magnitude DECIMAL(8, 4),
    volume DECIMAL(15, 2), -- cubic meters
    location GEOMETRY(POINT, 4326),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    damage_assessment TEXT,
    images TEXT[], -- Array of image URLs
    verified_by UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance logs table
CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES geological_sites(id) ON DELETE CASCADE,
    sensor_id UUID REFERENCES sensors(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(50) NOT NULL, -- 'calibration', 'repair', 'replacement', etc.
    description TEXT,
    technician_name VARCHAR(100),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    cost DECIMAL(10, 2),
    parts_used TEXT[],
    notes TEXT,
    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table for authentication
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    device_info JSONB,
    ip_address INET,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notification preferences table
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    alert_threshold alert_severity DEFAULT 'medium',
    site_notifications UUID[] DEFAULT '{}', -- Array of site IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_geological_sites_location ON geological_sites USING GIST (location);
CREATE INDEX idx_geological_sites_status ON geological_sites (status);
CREATE INDEX idx_sensors_site_id ON sensors (site_id);
CREATE INDEX idx_sensors_type ON sensors (sensor_type);
CREATE INDEX idx_sensor_data_sensor_timestamp ON sensor_data (sensor_id, timestamp DESC);
CREATE INDEX idx_sensor_data_timestamp ON sensor_data (timestamp DESC);
CREATE INDEX idx_alerts_site_id ON alerts (site_id);
CREATE INDEX idx_alerts_severity ON alerts (severity);
CREATE INDEX idx_alerts_active ON alerts (is_active) WHERE is_active = TRUE;
CREATE INDEX idx_predictions_site_id ON predictions (site_id);
CREATE INDEX idx_predictions_created_at ON predictions (created_at DESC);
CREATE INDEX idx_environmental_data_site_timestamp ON environmental_data (site_id, timestamp DESC);
CREATE INDEX idx_geological_events_site_id ON geological_events (site_id);
CREATE INDEX idx_geological_events_type ON geological_events (event_type);
CREATE INDEX idx_user_sessions_user_id ON user_sessions (user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions (token_hash);

-- Create functions for automated updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_geological_sites_updated_at BEFORE UPDATE ON geological_sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sensors_updated_at BEFORE UPDATE ON sensors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_geological_events_updated_at BEFORE UPDATE ON geological_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to automatically create monthly partitions
CREATE OR REPLACE FUNCTION create_monthly_partition(table_name text, start_date date)
RETURNS void AS $$
DECLARE
    partition_name text;
    end_date date;
BEGIN
    partition_name := table_name || '_' || to_char(start_date, 'YYYY_MM');
    end_date := start_date + interval '1 month';
    
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF %I
                    FOR VALUES FROM (%L) TO (%L)',
                   partition_name, table_name, start_date, end_date);
END;
$$ LANGUAGE plpgsql;

-- Create views for common queries
CREATE VIEW active_sites_summary AS
SELECT 
    gs.id,
    gs.name,
    gs.location,
    gs.status,
    gs.risk_level,
    COUNT(s.id) as sensor_count,
    COUNT(CASE WHEN a.is_active THEN 1 END) as active_alerts,
    MAX(sd.timestamp) as latest_data_timestamp
FROM geological_sites gs
LEFT JOIN sensors s ON gs.id = s.site_id AND s.status = 'active'
LEFT JOIN alerts a ON gs.id = a.site_id
LEFT JOIN sensor_data sd ON s.id = sd.sensor_id
WHERE gs.status = 'active'
GROUP BY gs.id, gs.name, gs.location, gs.status, gs.risk_level;

CREATE VIEW critical_alerts_view AS
SELECT 
    a.id,
    a.title,
    a.message,
    a.severity,
    a.created_at,
    gs.name as site_name,
    gs.location,
    u.username as acknowledged_by_user
FROM alerts a
JOIN geological_sites gs ON a.site_id = gs.id
LEFT JOIN users u ON a.acknowledged_by = u.id
WHERE a.is_active = TRUE AND a.severity IN ('high', 'critical')
ORDER BY a.created_at DESC;

-- Grant permissions (adjust as needed for your deployment)
-- GRANT USAGE ON SCHEMA public TO rockfall_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rockfall_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO rockfall_app_user;
