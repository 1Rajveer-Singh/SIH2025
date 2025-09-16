from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
import asyncio
import random

router = APIRouter(prefix="/api/devices", tags=["devices"])

# Device Management Models
class DeviceField(BaseModel):
    name: str
    unit: Optional[str] = None
    formula: Optional[str] = None
    current_value: Optional[Any] = None
    last_update: Optional[str] = None
    threshold: Optional[Dict[str, float]] = None

class DeviceMetrics(BaseModel):
    uptime: float
    data_quality: float
    last_data_received: str
    total_readings: int
    error_rate: float
    signal_strength: Optional[float] = None

class DeviceStatus(BaseModel):
    id: str
    name: str
    type: str
    location: str
    status: str  # online, offline, warning, error, maintenance
    enabled: bool
    last_update: str
    fields: List[DeviceField]
    output_format: List[str]
    metrics: DeviceMetrics
    api_endpoint: Optional[str] = None

class DeviceAction(BaseModel):
    action: str  # restart, configure, calibrate, enable, disable
    parameters: Optional[Dict[str, Any]] = None

class DeviceCategory(BaseModel):
    id: str
    name: str
    description: str
    devices: List[DeviceStatus]

# Mock device data store (in production, this would be a database)
DEVICE_DATA = {
    "ssr-001": {
        "id": "ssr-001",
        "name": "Slope Stability Radar (SSR)",
        "type": "radar",
        "location": "North Face - Sector A",
        "status": "online",
        "enabled": True,
        "last_update": "2 minutes ago",
        "fields": [
            {
                "name": "Line-of-Sight Displacement",
                "unit": "mm",
                "current_value": 2.3,
                "threshold": {"max": 10, "critical": 20}
            },
            {
                "name": "Velocity",
                "unit": "mm/day",
                "current_value": 0.8,
                "formula": "Velocity = ΔDisplacement / ΔTime",
                "threshold": {"max": 5, "critical": 15}
            }
        ],
        "output_format": [".csv", ".json"],
        "metrics": {
            "uptime": 98.5,
            "data_quality": 96.2,
            "last_data_received": "2 minutes ago",
            "total_readings": 15420,
            "error_rate": 1.8,
            "signal_strength": 92
        },
        "api_endpoint": "/api/devices/ssr-001"
    },
    "piezo-001": {
        "id": "piezo-001",
        "name": "Piezometer",
        "type": "piezometer",
        "location": "Borehole B-12",
        "status": "online",
        "enabled": True,
        "last_update": "5 minutes ago",
        "fields": [
            {
                "name": "Pore Pressure",
                "unit": "kPa",
                "current_value": 45.7,
                "threshold": {"max": 100, "critical": 150}
            }
        ],
        "output_format": [".csv", ".json"],
        "metrics": {
            "uptime": 99.1,
            "data_quality": 94.8,
            "last_data_received": "5 minutes ago",
            "total_readings": 8760,
            "error_rate": 0.9,
            "signal_strength": 88
        },
        "api_endpoint": "/api/devices/piezo-001"
    },
    "lidar-001": {
        "id": "lidar-001",
        "name": "Terrestrial Laser Scanner (LiDAR)",
        "type": "lidar",
        "location": "Station 1 - Overview",
        "status": "warning",
        "enabled": True,
        "last_update": "15 minutes ago",
        "fields": [
            {
                "name": "Point Cloud",
                "unit": "points",
                "current_value": "2.1M",
            },
            {
                "name": "Slope Angle",
                "unit": "degrees",
                "current_value": 67.3,
                "formula": "θ = arctan(√((Δx)² + (Δy)²) / Δz)"
            }
        ],
        "output_format": [".las", ".laz", ".tiff"],
        "metrics": {
            "uptime": 89.3,
            "data_quality": 91.5,
            "last_data_received": "15 minutes ago",
            "total_readings": 2340,
            "error_rate": 5.2,
            "signal_strength": 76
        },
        "api_endpoint": "/api/devices/lidar-001"
    }
}

def generate_mock_reading(device_id: str) -> Dict[str, Any]:
    """Generate mock sensor reading for a device"""
    base_value = 50
    timestamp = datetime.now().isoformat()
    
    if device_id == "ssr-001":
        return {
            "timestamp": timestamp,
            "displacement": round(random.uniform(1.5, 3.0), 2),
            "velocity": round(random.uniform(0.5, 1.2), 2),
            "coordinates": {"x": 125.4, "y": 67.8, "z": 342.1}
        }
    elif device_id == "piezo-001":
        return {
            "timestamp": timestamp,
            "pore_pressure": round(random.uniform(40, 50), 1),
            "depth": 12.5
        }
    elif device_id == "lidar-001":
        return {
            "timestamp": timestamp,
            "point_count": random.randint(2000000, 2200000),
            "intensity": round(random.uniform(0.8, 0.9), 2),
            "slope_angle": round(random.uniform(65, 70), 1)
        }
    else:
        return {
            "timestamp": timestamp,
            "value": round(random.uniform(base_value - 10, base_value + 10), 2)
        }

@router.get("/")
async def get_all_devices() -> List[DeviceStatus]:
    """Get all devices with their current status"""
    devices = []
    for device_data in DEVICE_DATA.values():
        # Update some fields with current timestamp
        device_data["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        devices.append(DeviceStatus(**device_data))
    return devices

@router.get("/categories")
async def get_device_categories() -> List[DeviceCategory]:
    """Get devices organized by categories"""
    categories = [
        {
            "id": "slope-stability",
            "name": "Slope Stability & Water Monitoring",
            "description": "Devices monitoring slope movement and water pressure",
            "devices": [
                DEVICE_DATA["ssr-001"],
                DEVICE_DATA["piezo-001"],
                DEVICE_DATA["lidar-001"]
            ]
        }
    ]
    
    # Convert to Pydantic models
    result = []
    for cat in categories:
        devices = [DeviceStatus(**device) for device in cat["devices"]]
        result.append(DeviceCategory(
            id=cat["id"],
            name=cat["name"],
            description=cat["description"],
            devices=devices
        ))
    
    return result

@router.get("/{device_id}")
async def get_device_status(device_id: str) -> DeviceStatus:
    """Get specific device status and data"""
    if device_id not in DEVICE_DATA:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device_data = DEVICE_DATA[device_id].copy()
    device_data["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return DeviceStatus(**device_data)

@router.get("/{device_id}/health")
async def check_device_health(device_id: str) -> Dict[str, Any]:
    """Check device API health and connectivity"""
    if device_id not in DEVICE_DATA:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device = DEVICE_DATA[device_id]
    
    # Simulate health check
    await asyncio.sleep(0.5)  # Simulate network delay
    
    is_healthy = device["status"] in ["online", "warning"]
    response_time = random.uniform(50, 200) if is_healthy else None
    
    return {
        "device_id": device_id,
        "healthy": is_healthy,
        "status": device["status"],
        "response_time_ms": response_time,
        "last_check": datetime.now().isoformat(),
        "connectivity": "good" if is_healthy else "poor",
        "data_flow": "active" if is_healthy else "interrupted"
    }

@router.get("/{device_id}/data")
async def get_device_data(device_id: str, limit: int = 24) -> Dict[str, Any]:
    """Get historical data for a device"""
    if device_id not in DEVICE_DATA:
        raise HTTPException(status_code=404, detail="Device not found")
    
    # Generate mock historical data
    data_points = []
    now = datetime.now()
    
    for i in range(limit):
        timestamp = now - timedelta(hours=i)
        reading = generate_mock_reading(device_id)
        reading["timestamp"] = timestamp.isoformat()
        data_points.append(reading)
    
    return {
        "device_id": device_id,
        "data_points": list(reversed(data_points)),
        "total_count": len(data_points),
        "time_range": f"Last {limit} hours"
    }

@router.post("/{device_id}/restart")
async def restart_device(device_id: str) -> Dict[str, str]:
    """Restart a device"""
    if device_id not in DEVICE_DATA:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device = DEVICE_DATA[device_id]
    if device["status"] == "offline":
        raise HTTPException(status_code=400, detail="Cannot restart offline device")
    
    # Simulate restart process
    await asyncio.sleep(2)
    
    # Update device status
    device["status"] = "online"
    device["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return {
        "message": f"Device {device_id} restarted successfully",
        "status": "online",
        "timestamp": datetime.now().isoformat()
    }

@router.post("/{device_id}/configure")
async def configure_device(device_id: str, action: DeviceAction) -> Dict[str, str]:
    """Configure device settings"""
    if device_id not in DEVICE_DATA:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device = DEVICE_DATA[device_id]
    if device["status"] == "offline":
        raise HTTPException(status_code=400, detail="Cannot configure offline device")
    
    # Simulate configuration process
    await asyncio.sleep(1)
    
    device["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return {
        "message": f"Device {device_id} configured successfully",
        "action": action.action,
        "timestamp": datetime.now().isoformat()
    }

@router.post("/{device_id}/enable")
async def enable_device(device_id: str) -> Dict[str, str]:
    """Enable a device"""
    if device_id not in DEVICE_DATA:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device = DEVICE_DATA[device_id]
    device["enabled"] = True
    device["status"] = "online"
    device["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return {
        "message": f"Device {device_id} enabled successfully",
        "enabled": True,
        "timestamp": datetime.now().isoformat()
    }

@router.post("/{device_id}/disable")
async def disable_device(device_id: str) -> Dict[str, str]:
    """Disable a device"""
    if device_id not in DEVICE_DATA:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device = DEVICE_DATA[device_id]
    device["enabled"] = False
    device["status"] = "offline"
    device["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return {
        "message": f"Device {device_id} disabled successfully",
        "enabled": False,
        "timestamp": datetime.now().isoformat()
    }

@router.get("/{device_id}/metrics")
async def get_device_metrics(device_id: str, hours: int = 24) -> Dict[str, Any]:
    """Get device performance metrics"""
    if device_id not in DEVICE_DATA:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device = DEVICE_DATA[device_id]
    
    # Generate mock metrics history
    metrics_history = []
    now = datetime.now()
    
    for i in range(hours):
        timestamp = now - timedelta(hours=i)
        metrics = {
            "timestamp": timestamp.isoformat(),
            "uptime": max(0, device["metrics"]["uptime"] + random.uniform(-2, 2)),
            "data_quality": max(0, device["metrics"]["data_quality"] + random.uniform(-3, 3)),
            "error_rate": max(0, device["metrics"]["error_rate"] + random.uniform(-1, 1)),
            "signal_strength": device["metrics"].get("signal_strength", 0) + random.uniform(-5, 5) if device["metrics"].get("signal_strength") else None
        }
        metrics_history.append(metrics)
    
    return {
        "device_id": device_id,
        "current_metrics": device["metrics"],
        "metrics_history": list(reversed(metrics_history)),
        "time_range": f"Last {hours} hours"
    }

@router.post("/{device_id}/calibrate")
async def calibrate_device(device_id: str) -> Dict[str, str]:
    """Calibrate a device"""
    if device_id not in DEVICE_DATA:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device = DEVICE_DATA[device_id]
    if device["status"] == "offline":
        raise HTTPException(status_code=400, detail="Cannot calibrate offline device")
    
    # Simulate calibration process
    await asyncio.sleep(3)
    
    # Improve device metrics after calibration
    device["metrics"]["data_quality"] = min(100, device["metrics"]["data_quality"] + 2)
    device["metrics"]["error_rate"] = max(0, device["metrics"]["error_rate"] - 1)
    device["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return {
        "message": f"Device {device_id} calibrated successfully",
        "improved_quality": True,
        "timestamp": datetime.now().isoformat()
    }

@router.get("/summary/stats")
async def get_device_summary() -> Dict[str, Any]:
    """Get overall device statistics"""
    total_devices = len(DEVICE_DATA)
    online_devices = sum(1 for d in DEVICE_DATA.values() if d["status"] == "online")
    warning_devices = sum(1 for d in DEVICE_DATA.values() if d["status"] == "warning")
    error_devices = sum(1 for d in DEVICE_DATA.values() if d["status"] == "error")
    offline_devices = sum(1 for d in DEVICE_DATA.values() if d["status"] == "offline")
    
    avg_uptime = sum(d["metrics"]["uptime"] for d in DEVICE_DATA.values()) / total_devices
    avg_quality = sum(d["metrics"]["data_quality"] for d in DEVICE_DATA.values()) / total_devices
    
    return {
        "total_devices": total_devices,
        "online_devices": online_devices,
        "warning_devices": warning_devices,
        "error_devices": error_devices,
        "offline_devices": offline_devices,
        "health_percentage": (online_devices / total_devices) * 100,
        "average_uptime": round(avg_uptime, 1),
        "average_quality": round(avg_quality, 1),
        "last_updated": datetime.now().isoformat()
    }