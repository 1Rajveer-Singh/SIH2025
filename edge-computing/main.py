"""
Edge Computing Main Module
Handles local data processing and real-time analysis for rockfall prediction
"""

import asyncio
import logging
import yaml
from datetime import datetime
from typing import Dict, List, Any
from data_processor import DataProcessor
from real_time_analyzer import RealTimeAnalyzer
from edge_gateway import EdgeGateway
from local_storage import LocalStorage

class EdgeComputingSystem:
    """Main edge computing system coordinator"""
    
    def __init__(self, config_path: str = "config.yaml"):
        self.config = self.load_config(config_path)
        self.logger = self.setup_logging()
        
        # Initialize components
        self.data_processor = DataProcessor(self.config)
        self.analyzer = RealTimeAnalyzer(self.config)
        self.gateway = EdgeGateway(self.config)
        self.storage = LocalStorage(self.config)
        
        self.running = False
        
    def load_config(self, config_path: str) -> Dict[str, Any]:
        """Load configuration from YAML file"""
        try:
            with open(config_path, 'r') as file:
                return yaml.safe_load(file)
        except FileNotFoundError:
            self.logger.warning(f"Config file {config_path} not found, using defaults")
            return self.get_default_config()
    
    def get_default_config(self) -> Dict[str, Any]:
        """Return default configuration"""
        return {
            'edge_device': {
                'id': 'edge-001',
                'location': 'Site-A',
                'sampling_rate': 1.0  # Hz
            },
            'sensors': {
                'accelerometer': {'enabled': True, 'threshold': 0.5},
                'tiltmeter': {'enabled': True, 'threshold': 0.1},
                'weather': {'enabled': True, 'update_interval': 300}
            },
            'communication': {
                'central_server': 'http://localhost:8000',
                'sync_interval': 60,
                'retry_attempts': 3
            },
            'storage': {
                'max_local_records': 10000,
                'backup_interval': 3600
            }
        }
    
    def setup_logging(self) -> logging.Logger:
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('edge_computing.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    async def start(self):
        """Start the edge computing system"""
        self.logger.info("Starting Edge Computing System...")
        self.running = True
        
        # Start all components
        await asyncio.gather(
            self.data_processing_loop(),
            self.analysis_loop(),
            self.communication_loop(),
            self.storage_management_loop()
        )
    
    async def data_processing_loop(self):
        """Main data processing loop"""
        while self.running:
            try:
                # Process incoming sensor data
                raw_data = await self.data_processor.collect_sensor_data()
                processed_data = await self.data_processor.process_data(raw_data)
                
                # Store locally
                await self.storage.store_data(processed_data)
                
                # Send to analyzer
                await self.analyzer.analyze_data(processed_data)
                
            except Exception as e:
                self.logger.error(f"Data processing error: {e}")
            
            await asyncio.sleep(1.0 / self.config['edge_device']['sampling_rate'])
    
    async def analysis_loop(self):
        """Real-time analysis loop"""
        while self.running:
            try:
                # Get recent data for analysis
                recent_data = await self.storage.get_recent_data(limit=100)
                
                # Perform threat analysis
                threat_level = await self.analyzer.assess_threat_level(recent_data)
                
                if threat_level > 0.7:  # High threat
                    alert = await self.analyzer.generate_alert(threat_level, recent_data)
                    await self.gateway.send_emergency_alert(alert)
                    
            except Exception as e:
                self.logger.error(f"Analysis error: {e}")
            
            await asyncio.sleep(5)  # Analysis every 5 seconds
    
    async def communication_loop(self):
        """Communication with central server"""
        while self.running:
            try:
                # Sync data with central server
                pending_data = await self.storage.get_unsync_data()
                if pending_data:
                    await self.gateway.sync_data(pending_data)
                    await self.storage.mark_as_synced(pending_data)
                
                # Get updates from central server
                updates = await self.gateway.get_updates()
                if updates:
                    await self.process_updates(updates)
                    
            except Exception as e:
                self.logger.error(f"Communication error: {e}")
            
            await asyncio.sleep(self.config['communication']['sync_interval'])
    
    async def storage_management_loop(self):
        """Manage local storage"""
        while self.running:
            try:
                # Cleanup old data
                await self.storage.cleanup_old_data()
                
                # Backup critical data
                await self.storage.backup_data()
                
            except Exception as e:
                self.logger.error(f"Storage management error: {e}")
            
            await asyncio.sleep(self.config['storage']['backup_interval'])
    
    async def process_updates(self, updates: List[Dict[str, Any]]):
        """Process updates from central server"""
        for update in updates:
            if update['type'] == 'config_update':
                self.config.update(update['data'])
                self.logger.info("Configuration updated from central server")
            elif update['type'] == 'threshold_update':
                await self.analyzer.update_thresholds(update['data'])
                self.logger.info("Analysis thresholds updated")
    
    async def stop(self):
        """Stop the edge computing system"""
        self.logger.info("Stopping Edge Computing System...")
        self.running = False
        
        # Cleanup components
        await self.data_processor.cleanup()
        await self.analyzer.cleanup()
        await self.gateway.cleanup()
        await self.storage.cleanup()

async def main():
    """Main entry point"""
    system = EdgeComputingSystem()
    
    try:
        await system.start()
    except KeyboardInterrupt:
        await system.stop()
        print("Edge Computing System stopped.")

if __name__ == "__main__":
    asyncio.run(main())