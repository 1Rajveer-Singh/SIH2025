"""
Data Processor Module
Handles sensor data collection and preprocessing
"""

import asyncio
import numpy as np
from datetime import datetime
from typing import Dict, List, Any, Optional
import json

class DataProcessor:
    """Processes raw sensor data into standardized format"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.sensor_config = config.get('sensors', {})
        self.calibration_data = {}
        
    async def collect_sensor_data(self) -> Dict[str, Any]:
        """Collect data from all enabled sensors"""
        data = {
            'timestamp': datetime.utcnow().isoformat(),
            'device_id': self.config['edge_device']['id'],
            'sensors': {}
        }
        
        # Accelerometer data
        if self.sensor_config.get('accelerometer', {}).get('enabled', False):
            data['sensors']['accelerometer'] = await self.read_accelerometer()
        
        # Tiltmeter data
        if self.sensor_config.get('tiltmeter', {}).get('enabled', False):
            data['sensors']['tiltmeter'] = await self.read_tiltmeter()
        
        # Weather data
        if self.sensor_config.get('weather', {}).get('enabled', False):
            data['sensors']['weather'] = await self.read_weather()
        
        return data
    
    async def read_accelerometer(self) -> Dict[str, float]:
        """Read accelerometer data (simulated)"""
        # In real implementation, this would interface with actual sensors
        return {
            'x_axis': np.random.normal(0, 0.1),
            'y_axis': np.random.normal(0, 0.1),
            'z_axis': np.random.normal(9.81, 0.2),
            'magnitude': np.random.normal(9.81, 0.2),
            'frequency': np.random.uniform(0.1, 10.0)
        }
    
    async def read_tiltmeter(self) -> Dict[str, float]:
        """Read tiltmeter data (simulated)"""
        return {
            'x_tilt': np.random.normal(0, 0.05),
            'y_tilt': np.random.normal(0, 0.05),
            'temperature': np.random.uniform(15, 25)
        }
    
    async def read_weather(self) -> Dict[str, float]:
        """Read weather station data (simulated)"""
        return {
            'temperature': np.random.uniform(10, 30),
            'humidity': np.random.uniform(30, 90),
            'pressure': np.random.uniform(980, 1020),
            'rainfall': max(0, np.random.normal(0, 2)),
            'wind_speed': np.random.uniform(0, 15),
            'wind_direction': np.random.uniform(0, 360)
        }
    
    async def process_data(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process and validate raw sensor data"""
        processed_data = raw_data.copy()
        
        # Apply calibration
        processed_data = await self.apply_calibration(processed_data)
        
        # Validate data quality
        processed_data = await self.validate_data(processed_data)
        
        # Calculate derived metrics
        processed_data = await self.calculate_derived_metrics(processed_data)
        
        return processed_data
    
    async def apply_calibration(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Apply sensor calibration corrections"""
        calibrated_data = data.copy()
        
        # Apply accelerometer calibration
        if 'accelerometer' in data.get('sensors', {}):
            accel_data = calibrated_data['sensors']['accelerometer']
            # Apply bias correction and scaling
            accel_data['x_axis'] = accel_data['x_axis'] * 1.0 + 0.0  # scale + bias
            accel_data['y_axis'] = accel_data['y_axis'] * 1.0 + 0.0
            accel_data['z_axis'] = accel_data['z_axis'] * 1.0 + 0.0
        
        return calibrated_data
    
    async def validate_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate sensor data for anomalies"""
        validated_data = data.copy()
        validated_data['quality_flags'] = {}
        
        sensors = data.get('sensors', {})
        
        # Validate accelerometer
        if 'accelerometer' in sensors:
            accel = sensors['accelerometer']
            magnitude = np.sqrt(accel['x_axis']**2 + accel['y_axis']**2 + accel['z_axis']**2)
            validated_data['quality_flags']['accelerometer'] = {
                'valid': 8 < magnitude < 12,  # Reasonable gravity range
                'magnitude_check': magnitude
            }
        
        # Validate tiltmeter
        if 'tiltmeter' in sensors:
            tilt = sensors['tiltmeter']
            max_tilt = max(abs(tilt['x_tilt']), abs(tilt['y_tilt']))
            validated_data['quality_flags']['tiltmeter'] = {
                'valid': max_tilt < 1.0,  # Reasonable tilt range
                'max_tilt': max_tilt
            }
        
        return validated_data
    
    async def calculate_derived_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate derived metrics from sensor data"""
        enhanced_data = data.copy()
        enhanced_data['derived_metrics'] = {}
        
        sensors = data.get('sensors', {})
        
        # Calculate movement metrics
        if 'accelerometer' in sensors and 'tiltmeter' in sensors:
            accel = sensors['accelerometer']
            tilt = sensors['tiltmeter']
            
            # Overall instability index
            accel_magnitude = accel['magnitude']
            tilt_magnitude = np.sqrt(tilt['x_tilt']**2 + tilt['y_tilt']**2)
            
            instability_index = (
                (accel_magnitude - 9.81) / 9.81 * 0.6 +  # Acceleration component
                tilt_magnitude * 0.4  # Tilt component
            )
            
            enhanced_data['derived_metrics']['instability_index'] = max(0, instability_index)
        
        # Environmental risk factor
        if 'weather' in sensors:
            weather = sensors['weather']
            rain_factor = min(1.0, weather['rainfall'] / 10.0)  # Normalize to 0-1
            wind_factor = min(1.0, weather['wind_speed'] / 20.0)  # Normalize to 0-1
            
            environmental_risk = (rain_factor * 0.7 + wind_factor * 0.3)
            enhanced_data['derived_metrics']['environmental_risk'] = environmental_risk
        
        return enhanced_data
    
    async def cleanup(self):
        """Cleanup resources"""
        pass