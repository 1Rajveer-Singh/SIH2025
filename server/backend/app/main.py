from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import asyncio
import json
import random
from typing import List, Dict, Any
from datetime import datetime

from app.api import auth, geological, monitoring, alerts, predictions
from app.api.ultra_advanced import router as ultra_advanced_router
from app.api.devices import router as devices_router
from app.core.database import engine, Base
from app.core.websocket_manager import ConnectionManager
from app.core.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Rockfall Prediction System API",
    description="AI-based rockfall prediction and alert system with advanced geological analysis",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
manager = ConnectionManager()

# Security
security = HTTPBearer()

# API Routes
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(geological.router, prefix="/api/geological", tags=["geological"])
app.include_router(monitoring.router, prefix="/api/monitoring", tags=["monitoring"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(ultra_advanced_router, prefix="/api/ultra-advanced", tags=["ultra-advanced"])
app.include_router(devices_router, tags=["devices"])

@app.get("/")
async def root():
    return {
        "message": "Rockfall Prediction System API",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.utcnow()
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "database": "connected",
        "ai_models": "loaded"
    }

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "subscribe_alerts":
                # Subscribe to real-time alerts
                await manager.send_personal_message(
                    json.dumps({
                        "type": "subscription_confirmed",
                        "message": "Subscribed to real-time alerts"
                    }),
                    websocket
                )
            elif message.get("type") == "subscribe_devices":
                # Subscribe to device status updates
                await manager.send_personal_message(
                    json.dumps({
                        "type": "device_subscription_confirmed",
                        "message": "Subscribed to device status updates"
                    }),
                    websocket
                )
            elif message.get("type") == "get_live_data":
                # Send live monitoring data
                live_data = await get_live_monitoring_data()
                await manager.send_personal_message(
                    json.dumps({
                        "type": "live_data",
                        "data": live_data
                    }),
                    websocket
                )
            elif message.get("type") == "get_device_status":
                # Send current device statuses
                from app.api.devices import DEVICE_DATA
                await manager.send_personal_message(
                    json.dumps({
                        "type": "device_status",
                        "devices": DEVICE_DATA,
                        "timestamp": datetime.now().isoformat()
                    }),
                    websocket
                )
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)

async def get_live_monitoring_data():
    # Simulate live data - replace with actual sensor data
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "slope_stability": {
            "displacement_rate": 0.02,  # mm/day
            "safety_factor": 1.8,
            "risk_level": "low"
        },
        "environmental": {
            "pore_pressure": 150.5,  # kPa
            "rainfall": 12.3,  # mm
            "temperature": 18.5  # °C
        },
        "seismic": {
            "peak_acceleration": 0.01,  # g
            "frequency": 2.3  # Hz
        }
    }

# Background task for device status updates
async def broadcast_device_updates():
    """Broadcast real-time device status updates to connected clients"""
    while True:
        try:
            from app.api.devices import DEVICE_DATA
            
            # Simulate device data changes
            for device_id, device in DEVICE_DATA.items():
                # Randomly update some metrics
                if random.random() < 0.1:  # 10% chance to update each device
                    # Update uptime (slight fluctuation)
                    current_uptime = device["metrics"]["uptime"]
                    device["metrics"]["uptime"] = max(0, min(100, current_uptime + random.uniform(-0.5, 0.5)))
                    
                    # Update data quality
                    current_quality = device["metrics"]["data_quality"]
                    device["metrics"]["data_quality"] = max(0, min(100, current_quality + random.uniform(-1, 1)))
                    
                    # Update signal strength if available
                    if device["metrics"].get("signal_strength"):
                        current_signal = device["metrics"]["signal_strength"]
                        device["metrics"]["signal_strength"] = max(0, min(100, current_signal + random.uniform(-2, 2)))
                    
                    # Update last update timestamp
                    device["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    
                    # Occasionally change status
                    if random.random() < 0.02:  # 2% chance
                        statuses = ["online", "warning", "error"]
                        if device["status"] != "offline":
                            device["status"] = random.choice(statuses)
            
            # Broadcast to all connected clients
            update_message = {
                "type": "device_update",
                "devices": DEVICE_DATA,
                "timestamp": datetime.now().isoformat()
            }
            
            await manager.broadcast(json.dumps(update_message))
            
        except Exception as e:
            print(f"Error in device broadcast: {e}")
        
        # Wait 30 seconds before next update
        await asyncio.sleep(30)

@app.on_event("startup")
async def startup_event():
    print("🚀 Rockfall Prediction System API starting up...")
    print(f"📊 Database: {settings.DATABASE_URL}")
    print(f"🔗 WebSocket connections ready")
    print(f"🤖 AI models loading...")
    print(f"📡 Starting device monitoring background task...")
    
    # Start background tasks
    asyncio.create_task(broadcast_device_updates())
    asyncio.create_task(broadcast_alerts())

@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 Rockfall Prediction System API shutting down...")

# Background task for broadcasting alerts
async def broadcast_alerts():
    while True:
        # Check for new alerts from AI model
        alerts = await check_for_new_alerts()
        if alerts:
            for alert in alerts:
                await manager.broadcast(json.dumps({
                    "type": "alert",
                    "data": alert
                }))
        await asyncio.sleep(5)  # Check every 5 seconds

async def check_for_new_alerts():
    # Simulate alert checking - replace with actual alert logic
    return []

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
