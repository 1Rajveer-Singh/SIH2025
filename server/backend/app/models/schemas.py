from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class SensorType(str, Enum):
    SSR = "ssr"
    LIDAR = "lidar"
    PIEZOMETER = "piezometer"
    SEISMOGRAPH = "seismograph"
    WEATHER = "weather"
    THERMAL = "thermal"

class AlertType(str, Enum):
    IMMEDIATE = "immediate"
    EARLY_WARNING = "early_warning"
    MAINTENANCE = "maintenance"

# User Models
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

# Geological Site Models
class GeologicalSiteBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    elevation: Optional[float] = None
    site_type: str
    description: Optional[str] = None

class GeologicalSiteCreate(GeologicalSiteBase):
    pass

class GeologicalSiteUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    elevation: Optional[float] = None
    site_type: Optional[str] = None
    description: Optional[str] = None

class GeologicalSite(GeologicalSiteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner_id: int

    class Config:
        from_attributes = True

# Rock Property Models
class RockPropertyBase(BaseModel):
    rock_type: str
    uniaxial_compressive_strength: Optional[float] = None
    tensile_strength: Optional[float] = None
    shear_strength: Optional[float] = None
    cohesion: Optional[float] = None
    friction_angle: Optional[float] = None
    fracture_spacing: Optional[float] = None
    fracture_orientation: Optional[Dict[str, float]] = None
    fracture_persistence: Optional[float] = None
    roughness_coefficient: Optional[float] = None
    aperture: Optional[float] = None
    block_volume: Optional[float] = None
    kinematic_feasibility: Optional[bool] = None
    saturated_shear_strength: Optional[float] = None
    porosity: Optional[float] = None
    permeability: Optional[float] = None

class RockPropertyCreate(RockPropertyBase):
    site_id: int

class RockPropertyUpdate(BaseModel):
    rock_type: Optional[str] = None
    uniaxial_compressive_strength: Optional[float] = None
    tensile_strength: Optional[float] = None
    shear_strength: Optional[float] = None
    cohesion: Optional[float] = None
    friction_angle: Optional[float] = None
    fracture_spacing: Optional[float] = None
    fracture_orientation: Optional[Dict[str, float]] = None
    fracture_persistence: Optional[float] = None
    roughness_coefficient: Optional[float] = None
    aperture: Optional[float] = None
    block_volume: Optional[float] = None
    kinematic_feasibility: Optional[bool] = None
    saturated_shear_strength: Optional[float] = None
    porosity: Optional[float] = None
    permeability: Optional[float] = None

class RockProperty(RockPropertyBase):
    id: int
    site_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Sensor Models
class SensorBase(BaseModel):
    sensor_id: str
    sensor_type: SensorType
    model: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    installation_date: Optional[datetime] = None
    last_maintenance: Optional[datetime] = None
    calibration_data: Optional[Dict[str, Any]] = None

class SensorCreate(SensorBase):
    site_id: int

class SensorUpdate(BaseModel):
    sensor_type: Optional[SensorType] = None
    model: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    last_maintenance: Optional[datetime] = None
    is_active: Optional[bool] = None
    calibration_data: Optional[Dict[str, Any]] = None

class Sensor(SensorBase):
    id: int
    site_id: int
    is_active: bool

    class Config:
        from_attributes = True

# Sensor Reading Models
class SensorReadingBase(BaseModel):
    displacement_x: Optional[float] = None
    displacement_y: Optional[float] = None
    displacement_z: Optional[float] = None
    velocity: Optional[float] = None
    acceleration: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    wind_speed: Optional[float] = None
    pore_pressure: Optional[float] = None
    peak_particle_velocity: Optional[float] = None
    frequency: Optional[float] = None
    magnitude: Optional[float] = None
    raw_data: Optional[Dict[str, Any]] = None
    quality_score: Optional[float] = None

class SensorReadingCreate(SensorReadingBase):
    sensor_id: int

class SensorReading(SensorReadingBase):
    id: int
    sensor_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Prediction Models
class PredictionBase(BaseModel):
    model_version: str
    prediction_horizon: int
    risk_level: RiskLevel
    risk_score: float = Field(..., ge=0, le=1)
    probability_of_failure: float = Field(..., ge=0, le=1)
    estimated_volume: Optional[float] = None
    confidence_interval: Optional[Dict[str, float]] = None
    primary_triggers: Optional[List[str]] = None
    factor_weights: Optional[Dict[str, float]] = None
    model_accuracy: Optional[float] = None
    features_used: Optional[List[str]] = None
    training_data_size: Optional[int] = None

class PredictionCreate(PredictionBase):
    site_id: int

class Prediction(PredictionBase):
    id: int
    site_id: int
    prediction_timestamp: datetime

    class Config:
        from_attributes = True

# Alert Models
class AlertBase(BaseModel):
    alert_type: AlertType
    severity: RiskLevel
    title: str
    message: str
    triggered_by: Optional[Dict[str, Any]] = None
    recommended_actions: Optional[List[str]] = None
    estimated_impact: Optional[Dict[str, Any]] = None

class AlertCreate(AlertBase):
    user_id: int
    site_id: int

class AlertUpdate(BaseModel):
    is_active: Optional[bool] = None
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

class Alert(AlertBase):
    id: int
    user_id: int
    site_id: int
    is_active: bool
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    email_sent: bool
    sms_sent: bool
    push_sent: bool

    class Config:
        from_attributes = True

# Data Upload Models
class DataUploadBase(BaseModel):
    filename: str
    file_type: str
    file_size: int
    metadata: Optional[Dict[str, Any]] = None

class DataUploadCreate(DataUploadBase):
    site_id: int
    file_path: str

class DataUpload(DataUploadBase):
    id: int
    site_id: int
    upload_date: datetime
    processed: bool
    processing_status: str
    file_path: str

    class Config:
        from_attributes = True

# System Health Models
class SystemHealthBase(BaseModel):
    active_sensors: int
    active_connections: int
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    prediction_accuracy: Optional[float] = None
    average_response_time: Optional[float] = None
    alerts_generated: Optional[int] = None
    false_positive_rate: Optional[float] = None
    data_completeness: Optional[float] = None
    sensor_uptime: Optional[float] = None
    status: str = "healthy"

class SystemHealth(SystemHealthBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Authentication Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# API Response Models
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int

# Ultra-Advanced Rockfall Risk Models
class SlopeFaceReading(BaseModel):
    timestamp: datetime
    coordinates: Dict[str, float]  # x, y, z
    displacement: float  # mm
    velocity: float  # mm/day
    strain: Optional[float] = None
    slope_angle: Optional[float] = None
    extensometer_id: Optional[str] = None
    lidar_intensity: Optional[float] = None
    point_cloud: Optional[List[Dict[str, float]]] = None

class HydrogeologicalReading(BaseModel):
    timestamp: datetime
    pore_pressure: float  # kPa
    depth: float
    rainfall: float  # mm/hour
    cumulative_rainfall: Optional[float] = None
    effective_stress: Optional[float] = None
    piezometer_id: Optional[str] = None

class GeologicalStructuralReading(BaseModel):
    timestamp: datetime
    discontinuity_orientation: Optional[str] = None
    spacing: Optional[float] = None
    persistence: Optional[float] = None
    roughness: Optional[float] = None
    borehole_log: Optional[Dict[str, Any]] = None
    drone_image_url: Optional[str] = None
    factor_of_safety: Optional[float] = None
    kinematic_feasibility: Optional[bool] = None

class OperationalReading(BaseModel):
    timestamp: datetime
    ppv: Optional[float] = None  # Peak Particle Velocity
    vibration_frequency: Optional[float] = None
    blast_location: Optional[str] = None
    explosive_volume: Optional[float] = None
    scaled_distance: Optional[float] = None
    mine_event_type: Optional[str] = None

# Utility models for formulas
class FormulaResult(BaseModel):
    formula: str
    value: float
    units: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
