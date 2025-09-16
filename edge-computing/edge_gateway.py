"""
Edge Gateway Module
Handles communication with central server and other edge devices
"""

import asyncio
import aiohttp
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging

class EdgeGateway:
    """Manages communication between edge device and central system"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.comm_config = config.get('communication', {})
        self.server_url = self.comm_config.get('central_server', 'http://localhost:8000')
        self.device_id = config['edge_device']['id']
        self.retry_attempts = self.comm_config.get('retry_attempts', 3)
        self.logger = logging.getLogger(__name__)
        
    async def sync_data(self, data_batch: List[Dict[str, Any]]) -> bool:
        """Synchronize local data with central server"""
        endpoint = f"{self.server_url}/api/edge/sync-data"
        
        payload = {
            'device_id': self.device_id,
            'timestamp': datetime.utcnow().isoformat(),
            'data_batch': data_batch
        }
        
        for attempt in range(self.retry_attempts):
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.post(
                        endpoint, 
                        json=payload,
                        timeout=aiohttp.ClientTimeout(total=30)
                    ) as response:
                        if response.status == 200:
                            result = await response.json()
                            self.logger.info(f"Successfully synced {len(data_batch)} records")
                            return True
                        else:
                            self.logger.warning(f"Sync failed with status {response.status}")
                            
            except asyncio.TimeoutError:
                self.logger.warning(f"Sync attempt {attempt + 1} timed out")
            except Exception as e:
                self.logger.error(f"Sync attempt {attempt + 1} failed: {e}")
            
            if attempt < self.retry_attempts - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
        
        self.logger.error("All sync attempts failed")
        return False
    
    async def send_emergency_alert(self, alert: Dict[str, Any]) -> bool:
        """Send emergency alert to central server with high priority"""
        endpoint = f"{self.server_url}/api/alerts/emergency"
        
        payload = {
            'device_id': self.device_id,
            'alert': alert,
            'priority': 'emergency'
        }
        
        # Emergency alerts get more retry attempts
        for attempt in range(self.retry_attempts * 2):
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.post(
                        endpoint, 
                        json=payload,
                        timeout=aiohttp.ClientTimeout(total=15)
                    ) as response:
                        if response.status in [200, 201]:
                            self.logger.info(f"Emergency alert sent successfully: {alert['id']}")
                            return True
                        else:
                            self.logger.warning(f"Emergency alert failed with status {response.status}")
                            
            except Exception as e:
                self.logger.error(f"Emergency alert attempt {attempt + 1} failed: {e}")
            
            await asyncio.sleep(1)  # Quick retry for emergencies
        
        self.logger.critical("FAILED TO SEND EMERGENCY ALERT - Manual intervention required")
        return False
    
    async def get_updates(self) -> List[Dict[str, Any]]:
        """Get configuration updates and commands from central server"""
        endpoint = f"{self.server_url}/api/edge/updates/{self.device_id}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    endpoint,
                    timeout=aiohttp.ClientTimeout(total=20)
                ) as response:
                    if response.status == 200:
                        updates = await response.json()
                        if updates:
                            self.logger.info(f"Received {len(updates)} updates from server")
                        return updates.get('updates', [])
                    elif response.status == 204:
                        # No updates available
                        return []
                    else:
                        self.logger.warning(f"Get updates failed with status {response.status}")
                        
        except Exception as e:
            self.logger.error(f"Failed to get updates: {e}")
        
        return []
    
    async def send_heartbeat(self) -> bool:
        """Send heartbeat to indicate device is online"""
        endpoint = f"{self.server_url}/api/edge/heartbeat"
        
        payload = {
            'device_id': self.device_id,
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'online',
            'location': self.config['edge_device']['location']
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    endpoint, 
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    return response.status == 200
                    
        except Exception as e:
            self.logger.error(f"Heartbeat failed: {e}")
            return False
    
    async def register_device(self) -> bool:
        """Register this edge device with central server"""
        endpoint = f"{self.server_url}/api/edge/register"
        
        payload = {
            'device_id': self.device_id,
            'location': self.config['edge_device']['location'],
            'capabilities': {
                'sensors': list(self.config.get('sensors', {}).keys()),
                'processing': True,
                'real_time_analysis': True
            },
            'timestamp': datetime.utcnow().isoformat()
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    endpoint, 
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status in [200, 201]:
                        self.logger.info(f"Device {self.device_id} registered successfully")
                        return True
                    else:
                        self.logger.error(f"Device registration failed with status {response.status}")
                        
        except Exception as e:
            self.logger.error(f"Device registration failed: {e}")
        
        return False
    
    async def send_status_report(self, status_data: Dict[str, Any]) -> bool:
        """Send comprehensive status report"""
        endpoint = f"{self.server_url}/api/edge/status"
        
        payload = {
            'device_id': self.device_id,
            'timestamp': datetime.utcnow().isoformat(),
            'status': status_data
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    endpoint, 
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=20)
                ) as response:
                    return response.status == 200
                    
        except Exception as e:
            self.logger.error(f"Status report failed: {e}")
            return False
    
    async def download_model_update(self, model_version: str) -> Optional[bytes]:
        """Download updated ML model from central server"""
        endpoint = f"{self.server_url}/api/edge/models/{model_version}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    endpoint,
                    timeout=aiohttp.ClientTimeout(total=120)  # Longer timeout for model download
                ) as response:
                    if response.status == 200:
                        model_data = await response.read()
                        self.logger.info(f"Downloaded model version {model_version}")
                        return model_data
                    else:
                        self.logger.warning(f"Model download failed with status {response.status}")
                        
        except Exception as e:
            self.logger.error(f"Model download failed: {e}")
        
        return None
    
    async def get_neighboring_devices(self) -> List[Dict[str, Any]]:
        """Get information about nearby edge devices"""
        endpoint = f"{self.server_url}/api/edge/neighbors/{self.device_id}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    endpoint,
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as response:
                    if response.status == 200:
                        neighbors = await response.json()
                        return neighbors.get('devices', [])
                        
        except Exception as e:
            self.logger.error(f"Failed to get neighboring devices: {e}")
        
        return []
    
    async def peer_to_peer_sync(self, neighbor_device: str, data: Dict[str, Any]) -> bool:
        """Synchronize data with neighboring edge device"""
        # This would implement direct device-to-device communication
        # For now, it's a placeholder for future mesh networking capabilities
        self.logger.info(f"P2P sync with {neighbor_device} (placeholder)")
        return True
    
    async def cleanup(self):
        """Cleanup network resources"""
        # Send offline status
        try:
            await self.send_heartbeat_offline()
        except Exception as e:
            self.logger.error(f"Failed to send offline status: {e}")
    
    async def send_heartbeat_offline(self):
        """Send offline heartbeat before shutdown"""
        endpoint = f"{self.server_url}/api/edge/heartbeat"
        
        payload = {
            'device_id': self.device_id,
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'offline'
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    endpoint, 
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=5)
                ) as response:
                    pass  # Don't care about response when going offline
                    
        except Exception:
            pass  # Ignore errors during shutdown