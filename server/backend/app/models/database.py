from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="user")  # admin, user, field_worker
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    geological_sites = relationship("GeologicalSite", back_populates="owner")
    alerts = relationship("Alert", back_populates="user")

class GeologicalSite(Base):
    __tablename__ = "geological_sites"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(Geometry('POINT'))
    latitude = Column(Float)
    longitude = Column(Float)
    elevation = Column(Float)
    site_type = Column(String)  # mine, road_cut, natural_slope
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    owner = relationship("User", back_populates="geological_sites")
    rock_properties = relationship("RockProperty", back_populates="site")
    sensors = relationship("Sensor", back_populates="site")
    predictions = relationship("Prediction", back_populates="site")

class RockProperty(Base):
    __tablename__ = "rock_properties"
    
    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("geological_sites.id"))
    
    # Geomechanical Properties
    rock_type = Column(String)
    uniaxial_compressive_strength = Column(Float)  # MPa
    tensile_strength = Column(Float)  # MPa
    shear_strength = Column(Float)  # MPa
    cohesion = Column(Float)  # MPa
    friction_angle = Column(Float)  # degrees
    
    # Discontinuity Properties
    fracture_spacing = Column(Float)  # meters
    fracture_orientation = Column(JSON)  # {"dip": 45, "dip_direction": 120}
    fracture_persistence = Column(Float)  # percentage
    roughness_coefficient = Column(Float)
    aperture = Column(Float)  # mm
    
    # Block Properties
    block_volume = Column(Float)  # cubic meters
    kinematic_feasibility = Column(Boolean)
    
    # Saturated Properties
    saturated_shear_strength = Column(Float)  # MPa
    porosity = Column(Float)  # percentage
    permeability = Column(Float)  # m/s
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    site = relationship("GeologicalSite", back_populates="rock_properties")

class Sensor(Base):
    __tablename__ = "sensors"
    
    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("geological_sites.id"))
    sensor_id = Column(String, unique=True, nullable=False)
    sensor_type = Column(String)  # ssr, lidar, piezometer, seismograph, weather
    model = Column(String)
    location = Column(Geometry('POINT'))
    installation_date = Column(DateTime(timezone=True))
    last_maintenance = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    calibration_data = Column(JSON)
    
    # Relationships
    site = relationship("GeologicalSite", back_populates="sensors")
    readings = relationship("SensorReading", back_populates="sensor")

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Common readings
    displacement_x = Column(Float)  # mm
    displacement_y = Column(Float)  # mm
    displacement_z = Column(Float)  # mm
    velocity = Column(Float)  # mm/day
    acceleration = Column(Float)  # g
    
    # Environmental readings
    temperature = Column(Float)  # Celsius
    humidity = Column(Float)  # percentage
    rainfall = Column(Float)  # mm
    wind_speed = Column(Float)  # m/s
    pore_pressure = Column(Float)  # kPa
    
    # Seismic readings
    peak_particle_velocity = Column(Float)  # mm/s
    frequency = Column(Float)  # Hz
    magnitude = Column(Float)
    
    # Raw data and metadata
    raw_data = Column(JSON)
    quality_score = Column(Float)  # 0-1
    
    # Relationships
    sensor = relationship("Sensor", back_populates="readings")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("geological_sites.id"))
    model_version = Column(String)
    prediction_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    prediction_horizon = Column(Integer)  # hours
    
    # Prediction results
    risk_level = Column(String)  # low, medium, high, critical
    risk_score = Column(Float)  # 0-1
    probability_of_failure = Column(Float)  # 0-1
    estimated_volume = Column(Float)  # cubic meters
    confidence_interval = Column(JSON)  # {"lower": 0.1, "upper": 0.9}
    
    # Contributing factors
    primary_triggers = Column(JSON)  # ["rainfall", "seismic_activity"]
    factor_weights = Column(JSON)  # {"geological": 0.4, "environmental": 0.6}
    
    # Model metadata
    model_accuracy = Column(Float)
    features_used = Column(JSON)
    training_data_size = Column(Integer)
    
    # Relationships
    site = relationship("GeologicalSite", back_populates="predictions")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    site_id = Column(Integer, ForeignKey("geological_sites.id"))
    alert_type = Column(String)  # immediate, early_warning, maintenance
    severity = Column(String)  # low, medium, high, critical
    
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    
    # Alert metadata
    triggered_by = Column(JSON)  # sensor readings, model predictions
    recommended_actions = Column(JSON)  # ["evacuate_area", "increase_monitoring"]
    affected_area = Column(Geometry('POLYGON'))
    estimated_impact = Column(JSON)
    
    # Status tracking
    is_active = Column(Boolean, default=True)
    acknowledged_at = Column(DateTime(timezone=True))
    resolved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Notification tracking
    email_sent = Column(Boolean, default=False)
    sms_sent = Column(Boolean, default=False)
    push_sent = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="alerts")

class DataUpload(Base):
    __tablename__ = "data_uploads"
    
    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("geological_sites.id"))
    filename = Column(String, nullable=False)
    file_type = Column(String)  # lidar, thermal, geological_survey
    file_size = Column(Integer)  # bytes
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    processed = Column(Boolean, default=False)
    processing_status = Column(String)  # pending, processing, completed, failed
    file_metadata = Column(JSON)
    file_path = Column(String)
    
class SystemHealth(Base):
    __tablename__ = "system_health"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # System metrics
    active_sensors = Column(Integer)
    active_connections = Column(Integer)
    cpu_usage = Column(Float)  # percentage
    memory_usage = Column(Float)  # percentage
    disk_usage = Column(Float)  # percentage
    
    # Model performance
    prediction_accuracy = Column(Float)
    average_response_time = Column(Float)  # milliseconds
    alerts_generated = Column(Integer)
    false_positive_rate = Column(Float)
    
    # Data quality
    data_completeness = Column(Float)  # percentage
    sensor_uptime = Column(Float)  # percentage
    
    status = Column(String, default="healthy")  # healthy, warning, critical
