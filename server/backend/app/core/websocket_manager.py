from fastapi import WebSocket
from typing import List, Dict
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.connection_metadata: Dict[WebSocket, Dict] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        
        if client_id not in self.active_connections:
            self.active_connections[client_id] = []
        
        self.active_connections[client_id].append(websocket)
        self.connection_metadata[websocket] = {
            "client_id": client_id,
            "connected_at": str(websocket.client),
            "subscriptions": []
        }
        
        logger.info(f"Client {client_id} connected via WebSocket")

    def disconnect(self, websocket: WebSocket, client_id: str):
        if client_id in self.active_connections:
            self.active_connections[client_id].remove(websocket)
            if not self.active_connections[client_id]:
                del self.active_connections[client_id]
        
        if websocket in self.connection_metadata:
            del self.connection_metadata[websocket]
        
        logger.info(f"Client {client_id} disconnected from WebSocket")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")

    async def send_to_client(self, message: str, client_id: str):
        if client_id in self.active_connections:
            disconnected = []
            for websocket in self.active_connections[client_id]:
                try:
                    await websocket.send_text(message)
                except Exception as e:
                    logger.error(f"Error sending message to client {client_id}: {e}")
                    disconnected.append(websocket)
            
            # Remove disconnected websockets
            for ws in disconnected:
                self.disconnect(ws, client_id)

    async def broadcast(self, message: str):
        """Broadcast message to all connected clients"""
        disconnected_clients = []
        
        for client_id, connections in self.active_connections.items():
            disconnected_ws = []
            for websocket in connections:
                try:
                    await websocket.send_text(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to client {client_id}: {e}")
                    disconnected_ws.append(websocket)
            
            # Remove disconnected websockets
            for ws in disconnected_ws:
                self.disconnect(ws, client_id)
            
            if not connections:
                disconnected_clients.append(client_id)
        
        # Clean up empty client lists
        for client_id in disconnected_clients:
            if client_id in self.active_connections:
                del self.active_connections[client_id]

    async def broadcast_alert(self, alert_data: Dict):
        """Broadcast high-priority alerts to all connected clients"""
        alert_message = json.dumps({
            "type": "critical_alert",
            "priority": "high",
            "data": alert_data,
            "timestamp": alert_data.get("timestamp")
        })
        
        await self.broadcast(alert_message)
        logger.warning(f"Critical alert broadcasted: {alert_data.get('message', 'Unknown alert')}")

    def get_connected_clients(self) -> List[str]:
        """Get list of all connected client IDs"""
        return list(self.active_connections.keys())

    def get_connection_count(self) -> int:
        """Get total number of active connections"""
        return sum(len(connections) for connections in self.active_connections.values())
