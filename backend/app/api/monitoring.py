from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.schemas import *
from app.models.database import Sensor, SensorReading, GeologicalSite, User

router = APIRouter()

@router.post("/sensors", response_model=APIResponse)
async def create_sensor(
    sensor: SensorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new sensor"""
    # Check if site exists and user has access
    site = db.query(GeologicalSite).filter(GeologicalSite.id == sensor.site_id).first()
    
    if not site:
        raise HTTPException(
            status_code=404,
            detail="Geological site not found"
        )
    
    if current_user.role != "admin" and site.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to add sensors to this site"
        )
    
    # Check if sensor_id is unique
    existing_sensor = db.query(Sensor).filter(Sensor.sensor_id == sensor.sensor_id).first()
    if existing_sensor:
        raise HTTPException(
            status_code=400,
            detail="Sensor ID already exists"
        )
    
    db_sensor = Sensor(**sensor.dict())
    db.add(db_sensor)
    db.commit()
    db.refresh(db_sensor)
    
    return APIResponse(
        success=True,
        message="Sensor created successfully",
        data={"sensor_id": db_sensor.id, "sensor_identifier": db_sensor.sensor_id}
    )

@router.get("/sensors", response_model=APIResponse)
async def list_sensors(
    site_id: Optional[int] = None,
    sensor_type: Optional[SensorType] = None,
    is_active: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List sensors with optional filtering"""
    query = db.query(Sensor)
    
    # Filter by site access for non-admin users
    if current_user.role != "admin":
        user_sites = db.query(GeologicalSite.id).filter(GeologicalSite.owner_id == current_user.id).subquery()
        query = query.filter(Sensor.site_id.in_(user_sites))
    
    # Apply filters
    if site_id:
        query = query.filter(Sensor.site_id == site_id)
    if sensor_type:
        query = query.filter(Sensor.sensor_type == sensor_type)
    if is_active is not None:
        query = query.filter(Sensor.is_active == is_active)
    
    sensors = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return APIResponse(
        success=True,
        message="Sensors retrieved successfully",
        data={
            "sensors": [
                {
                    "id": sensor.id,
                    "sensor_id": sensor.sensor_id,
                    "site_id": sensor.site_id,
                    "sensor_type": sensor.sensor_type,
                    "model": sensor.model,
                    "latitude": sensor.latitude,
                    "longitude": sensor.longitude,
                    "installation_date": sensor.installation_date,
                    "last_maintenance": sensor.last_maintenance,
                    "is_active": sensor.is_active,
                    "calibration_data": sensor.calibration_data
                }
                for sensor in sensors
            ],
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "per_page": limit
        }
    )

@router.get("/sensors/{sensor_id}", response_model=APIResponse)
async def get_sensor(
    sensor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific sensor"""
    sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
    
    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    
    # Check permissions
    if current_user.role != "admin":
        site = db.query(GeologicalSite).filter(GeologicalSite.id == sensor.site_id).first()
        if not site or site.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to access this sensor"
            )
    
    return APIResponse(
        success=True,
        message="Sensor retrieved successfully",
        data={
            "id": sensor.id,
            "sensor_id": sensor.sensor_id,
            "site_id": sensor.site_id,
            "sensor_type": sensor.sensor_type,
            "model": sensor.model,
            "latitude": sensor.latitude,
            "longitude": sensor.longitude,
            "installation_date": sensor.installation_date,
            "last_maintenance": sensor.last_maintenance,
            "is_active": sensor.is_active,
            "calibration_data": sensor.calibration_data
        }
    )

@router.put("/sensors/{sensor_id}", response_model=APIResponse)
async def update_sensor(
    sensor_id: int,
    sensor_update: SensorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a sensor"""
    sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
    
    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    
    # Check permissions
    if current_user.role != "admin":
        site = db.query(GeologicalSite).filter(GeologicalSite.id == sensor.site_id).first()
        if not site or site.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to update this sensor"
            )
    
    update_data = sensor_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sensor, field, value)
    
    db.commit()
    db.refresh(sensor)
    
    return APIResponse(
        success=True,
        message="Sensor updated successfully",
        data={"sensor_id": sensor.id}
    )

@router.post("/sensors/{sensor_id}/readings", response_model=APIResponse)
async def add_sensor_reading(
    sensor_id: int,
    reading: SensorReadingBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a new sensor reading"""
    sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
    
    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    
    if not sensor.is_active:
        raise HTTPException(
            status_code=400,
            detail="Cannot add readings to inactive sensor"
        )
    
    # Check permissions
    if current_user.role != "admin":
        site = db.query(GeologicalSite).filter(GeologicalSite.id == sensor.site_id).first()
        if not site or site.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to add readings to this sensor"
            )
    
    db_reading = SensorReading(
        **reading.dict(),
        sensor_id=sensor_id
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    
    return APIResponse(
        success=True,
        message="Sensor reading added successfully",
        data={"reading_id": db_reading.id, "timestamp": db_reading.timestamp}
    )

@router.get("/sensors/{sensor_id}/readings", response_model=APIResponse)
async def get_sensor_readings(
    sensor_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    skip: int = 0,
    limit: int = 1000,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get sensor readings with optional date filtering"""
    sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
    
    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    
    # Check permissions
    if current_user.role != "admin":
        site = db.query(GeologicalSite).filter(GeologicalSite.id == sensor.site_id).first()
        if not site or site.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to access this sensor's readings"
            )
    
    query = db.query(SensorReading).filter(SensorReading.sensor_id == sensor_id)
    
    # Apply date filters
    if start_date:
        query = query.filter(SensorReading.timestamp >= start_date)
    if end_date:
        query = query.filter(SensorReading.timestamp <= end_date)
    
    # Order by timestamp descending (most recent first)
    query = query.order_by(SensorReading.timestamp.desc())
    
    readings = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return APIResponse(
        success=True,
        message="Sensor readings retrieved successfully",
        data={
            "readings": [
                {
                    "id": reading.id,
                    "timestamp": reading.timestamp,
                    "displacement_x": reading.displacement_x,
                    "displacement_y": reading.displacement_y,
                    "displacement_z": reading.displacement_z,
                    "velocity": reading.velocity,
                    "acceleration": reading.acceleration,
                    "temperature": reading.temperature,
                    "humidity": reading.humidity,
                    "rainfall": reading.rainfall,
                    "wind_speed": reading.wind_speed,
                    "pore_pressure": reading.pore_pressure,
                    "peak_particle_velocity": reading.peak_particle_velocity,
                    "frequency": reading.frequency,
                    "magnitude": reading.magnitude,
                    "quality_score": reading.quality_score,
                    "raw_data": reading.raw_data
                }
                for reading in readings
            ],
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "per_page": limit,
            "sensor_info": {
                "sensor_id": sensor.sensor_id,
                "sensor_type": sensor.sensor_type,
                "model": sensor.model
            }
        }
    )

@router.get("/sensors/{sensor_id}/latest", response_model=APIResponse)
async def get_latest_reading(
    sensor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the latest reading from a sensor"""
    sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
    
    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    
    # Check permissions
    if current_user.role != "admin":
        site = db.query(GeologicalSite).filter(GeologicalSite.id == sensor.site_id).first()
        if not site or site.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to access this sensor's readings"
            )
    
    latest_reading = db.query(SensorReading).filter(
        SensorReading.sensor_id == sensor_id
    ).order_by(SensorReading.timestamp.desc()).first()
    
    if not latest_reading:
        return APIResponse(
            success=True,
            message="No readings found for this sensor",
            data=None
        )
    
    return APIResponse(
        success=True,
        message="Latest sensor reading retrieved successfully",
        data={
            "id": latest_reading.id,
            "timestamp": latest_reading.timestamp,
            "displacement_x": latest_reading.displacement_x,
            "displacement_y": latest_reading.displacement_y,
            "displacement_z": latest_reading.displacement_z,
            "velocity": latest_reading.velocity,
            "acceleration": latest_reading.acceleration,
            "temperature": latest_reading.temperature,
            "humidity": latest_reading.humidity,
            "rainfall": latest_reading.rainfall,
            "wind_speed": latest_reading.wind_speed,
            "pore_pressure": latest_reading.pore_pressure,
            "peak_particle_velocity": latest_reading.peak_particle_velocity,
            "frequency": latest_reading.frequency,
            "magnitude": latest_reading.magnitude,
            "quality_score": latest_reading.quality_score,
            "sensor_info": {
                "sensor_id": sensor.sensor_id,
                "sensor_type": sensor.sensor_type,
                "model": sensor.model
            }
        }
    )

@router.get("/live-data", response_model=APIResponse)
async def get_live_monitoring_data(
    site_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get live monitoring data from all active sensors"""
    query = db.query(Sensor).filter(Sensor.is_active == True)
    
    # Filter by site access for non-admin users
    if current_user.role != "admin":
        user_sites = db.query(GeologicalSite.id).filter(GeologicalSite.owner_id == current_user.id).subquery()
        query = query.filter(Sensor.site_id.in_(user_sites))
    
    if site_id:
        query = query.filter(Sensor.site_id == site_id)
    
    sensors = query.all()
    
    live_data = []
    for sensor in sensors:
        latest_reading = db.query(SensorReading).filter(
            SensorReading.sensor_id == sensor.id
        ).order_by(SensorReading.timestamp.desc()).first()
        
        if latest_reading:
            live_data.append({
                "sensor_id": sensor.sensor_id,
                "sensor_type": sensor.sensor_type,
                "site_id": sensor.site_id,
                "timestamp": latest_reading.timestamp,
                "data": {
                    "displacement_x": latest_reading.displacement_x,
                    "displacement_y": latest_reading.displacement_y,
                    "displacement_z": latest_reading.displacement_z,
                    "velocity": latest_reading.velocity,
                    "acceleration": latest_reading.acceleration,
                    "temperature": latest_reading.temperature,
                    "humidity": latest_reading.humidity,
                    "rainfall": latest_reading.rainfall,
                    "pore_pressure": latest_reading.pore_pressure,
                    "peak_particle_velocity": latest_reading.peak_particle_velocity,
                    "frequency": latest_reading.frequency,
                    "magnitude": latest_reading.magnitude
                },
                "quality_score": latest_reading.quality_score
            })
    
    return APIResponse(
        success=True,
        message="Live monitoring data retrieved successfully",
        data={
            "live_data": live_data,
            "timestamp": datetime.utcnow(),
            "total_sensors": len(live_data)
        }
    )
