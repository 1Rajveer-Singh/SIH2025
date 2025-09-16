"""
Local Storage Module
Handles local data storage and management for edge device
"""

import asyncio
import sqlite3
import json
import aiosqlite
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging
import os

class LocalStorage:
    """Manages local SQLite database for edge device data storage"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.storage_config = config.get('storage', {})
        self.db_path = 'edge_data.db'
        self.max_records = self.storage_config.get('max_local_records', 10000)
        self.logger = logging.getLogger(__name__)
        
    async def initialize(self):
        """Initialize database tables"""
        async with aiosqlite.connect(self.db_path) as db:
            # Sensor data table
            await db.execute('''
                CREATE TABLE IF NOT EXISTS sensor_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    device_id TEXT NOT NULL,
                    data_type TEXT NOT NULL,
                    raw_data TEXT NOT NULL,
                    processed_data TEXT,
                    quality_flags TEXT,
                    synced BOOLEAN DEFAULT FALSE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Analysis results table
            await db.execute('''
                CREATE TABLE IF NOT EXISTS analysis_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    threat_level REAL NOT NULL,
                    risk_factors TEXT NOT NULL,
                    recommendations TEXT,
                    alert_generated BOOLEAN DEFAULT FALSE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Alerts table
            await db.execute('''
                CREATE TABLE IF NOT EXISTS alerts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    alert_id TEXT UNIQUE NOT NULL,
                    timestamp TEXT NOT NULL,
                    severity TEXT NOT NULL,
                    message TEXT NOT NULL,
                    data_snapshot TEXT,
                    acknowledged BOOLEAN DEFAULT FALSE,
                    synced BOOLEAN DEFAULT FALSE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Sync status table
            await db.execute('''
                CREATE TABLE IF NOT EXISTS sync_status (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    table_name TEXT NOT NULL,
                    last_sync_timestamp TEXT,
                    records_synced INTEGER DEFAULT 0,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create indexes for performance
            await db.execute('CREATE INDEX IF NOT EXISTS idx_sensor_timestamp ON sensor_data(timestamp)')
            await db.execute('CREATE INDEX IF NOT EXISTS idx_sensor_synced ON sensor_data(synced)')
            await db.execute('CREATE INDEX IF NOT EXISTS idx_analysis_timestamp ON analysis_results(timestamp)')
            await db.execute('CREATE INDEX IF NOT EXISTS idx_alerts_synced ON alerts(synced)')
            
            await db.commit()
            
        self.logger.info("Database initialized successfully")
    
    async def store_data(self, data: Dict[str, Any]) -> bool:
        """Store processed sensor data"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute('''
                    INSERT INTO sensor_data 
                    (timestamp, device_id, data_type, raw_data, processed_data, quality_flags)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    data.get('timestamp'),
                    data.get('device_id'),
                    'sensor_reading',
                    json.dumps(data.get('sensors', {})),
                    json.dumps(data.get('derived_metrics', {})),
                    json.dumps(data.get('quality_flags', {}))
                ))
                
                await db.commit()
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to store data: {e}")
            return False
    
    async def store_analysis_result(self, analysis: Dict[str, Any]) -> bool:
        """Store analysis results"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute('''
                    INSERT INTO analysis_results 
                    (timestamp, threat_level, risk_factors, recommendations)
                    VALUES (?, ?, ?, ?)
                ''', (
                    analysis.get('timestamp'),
                    analysis.get('threat_level', 0.0),
                    json.dumps(analysis.get('risk_factors', {})),
                    json.dumps(analysis.get('recommendations', []))
                ))
                
                await db.commit()
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to store analysis result: {e}")
            return False
    
    async def store_alert(self, alert: Dict[str, Any]) -> bool:
        """Store alert information"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute('''
                    INSERT OR REPLACE INTO alerts 
                    (alert_id, timestamp, severity, message, data_snapshot)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    alert.get('id'),
                    alert.get('timestamp'),
                    alert.get('severity'),
                    alert.get('message'),
                    json.dumps(alert.get('data_snapshot', {}))
                ))
                
                await db.commit()
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to store alert: {e}")
            return False
    
    async def get_recent_data(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent sensor data for analysis"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                async with db.execute('''
                    SELECT timestamp, device_id, raw_data, processed_data, quality_flags
                    FROM sensor_data
                    ORDER BY created_at DESC
                    LIMIT ?
                ''', (limit,)) as cursor:
                    rows = await cursor.fetchall()
                    
                    data_list = []
                    for row in rows:
                        data_point = {
                            'timestamp': row[0],
                            'device_id': row[1],
                            'sensors': json.loads(row[2]) if row[2] else {},
                            'derived_metrics': json.loads(row[3]) if row[3] else {},
                            'quality_flags': json.loads(row[4]) if row[4] else {}
                        }
                        data_list.append(data_point)
                    
                    return data_list
                    
        except Exception as e:
            self.logger.error(f"Failed to get recent data: {e}")
            return []
    
    async def get_unsync_data(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get unsynced data for transmission to central server"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                async with db.execute('''
                    SELECT id, timestamp, device_id, raw_data, processed_data
                    FROM sensor_data
                    WHERE synced = FALSE
                    ORDER BY created_at ASC
                    LIMIT ?
                ''', (limit,)) as cursor:
                    rows = await cursor.fetchall()
                    
                    data_list = []
                    for row in rows:
                        data_point = {
                            'local_id': row[0],
                            'timestamp': row[1],
                            'device_id': row[2],
                            'sensors': json.loads(row[3]) if row[3] else {},
                            'derived_metrics': json.loads(row[4]) if row[4] else {}
                        }
                        data_list.append(data_point)
                    
                    return data_list
                    
        except Exception as e:
            self.logger.error(f"Failed to get unsynced data: {e}")
            return []
    
    async def mark_as_synced(self, data_list: List[Dict[str, Any]]) -> bool:
        """Mark data records as synced"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                local_ids = [item['local_id'] for item in data_list if 'local_id' in item]
                
                if local_ids:
                    placeholders = ','.join('?' * len(local_ids))
                    await db.execute(f'''
                        UPDATE sensor_data 
                        SET synced = TRUE 
                        WHERE id IN ({placeholders})
                    ''', local_ids)
                    
                    await db.commit()
                    self.logger.info(f"Marked {len(local_ids)} records as synced")
                
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to mark data as synced: {e}")
            return False
    
    async def cleanup_old_data(self) -> bool:
        """Clean up old data to maintain storage limits"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                # Keep only the most recent records
                await db.execute('''
                    DELETE FROM sensor_data 
                    WHERE id NOT IN (
                        SELECT id FROM sensor_data 
                        ORDER BY created_at DESC 
                        LIMIT ?
                    )
                ''', (self.max_records,))
                
                # Clean up old analysis results (keep last 1000)
                await db.execute('''
                    DELETE FROM analysis_results 
                    WHERE id NOT IN (
                        SELECT id FROM analysis_results 
                        ORDER BY created_at DESC 
                        LIMIT 1000
                    )
                ''')
                
                # Clean up old alerts (keep last 500)
                await db.execute('''
                    DELETE FROM alerts 
                    WHERE id NOT IN (
                        SELECT id FROM alerts 
                        ORDER BY created_at DESC 
                        LIMIT 500
                    )
                ''')
                
                await db.commit()
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to cleanup old data: {e}")
            return False
    
    async def backup_data(self) -> bool:
        """Create backup of critical data"""
        try:
            backup_path = f"backup_edge_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
            
            # Simple file copy for SQLite backup
            async with aiosqlite.connect(self.db_path) as source:
                async with aiosqlite.connect(backup_path) as backup:
                    await source.backup(backup)
            
            self.logger.info(f"Data backup created: {backup_path}")
            
            # Clean up old backups (keep only last 5)
            backup_files = [f for f in os.listdir('.') if f.startswith('backup_edge_data_')]
            backup_files.sort(reverse=True)
            
            for old_backup in backup_files[5:]:
                try:
                    os.remove(old_backup)
                except Exception:
                    pass
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to backup data: {e}")
            return False
    
    async def get_statistics(self) -> Dict[str, Any]:
        """Get storage statistics"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                stats = {}
                
                # Count total records
                async with db.execute('SELECT COUNT(*) FROM sensor_data') as cursor:
                    stats['total_sensor_records'] = (await cursor.fetchone())[0]
                
                # Count unsynced records
                async with db.execute('SELECT COUNT(*) FROM sensor_data WHERE synced = FALSE') as cursor:
                    stats['unsynced_records'] = (await cursor.fetchone())[0]
                
                # Count alerts
                async with db.execute('SELECT COUNT(*) FROM alerts') as cursor:
                    stats['total_alerts'] = (await cursor.fetchone())[0]
                
                # Get database size
                stats['db_size_mb'] = os.path.getsize(self.db_path) / (1024 * 1024)
                
                return stats
                
        except Exception as e:
            self.logger.error(f"Failed to get statistics: {e}")
            return {}
    
    async def cleanup(self):
        """Cleanup storage resources"""
        try:
            await self.backup_data()
            self.logger.info("Storage cleanup completed")
        except Exception as e:
            self.logger.error(f"Storage cleanup failed: {e}")

# Initialize storage when module is imported
async def init_storage(config: Dict[str, Any]) -> LocalStorage:
    """Initialize and return storage instance"""
    storage = LocalStorage(config)
    await storage.initialize()
    return storage