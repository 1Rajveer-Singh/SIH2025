import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import json
import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

class DataSource(ABC):
    """Abstract base class for different data sources"""
    
    @abstractmethod
    def fetch_data(self, start_time: datetime, end_time: datetime) -> pd.DataFrame:
        pass
    
    @abstractmethod
    def validate_data(self, data: pd.DataFrame) -> bool:
        pass
    
    @abstractmethod
    def normalize_data(self, data: pd.DataFrame) -> pd.DataFrame:
        pass

class GeologicalDataSource(DataSource):
    """Handles geological and geotechnical data"""
    
    def __init__(self, db_connection):
        self.db = db_connection
        
    def fetch_data(self, start_time: datetime, end_time: datetime) -> pd.DataFrame:
        """Fetch geological properties data"""
        # Implementation would query geological properties from database
        query = """
        SELECT 
            rp.id,
            rp.site_id,
            rp.rock_type,
            rp.uniaxial_compressive_strength,
            rp.tensile_strength,
            rp.shear_strength,
            rp.cohesion,
            rp.friction_angle,
            rp.fracture_spacing,
            rp.fracture_orientation,
            rp.block_volume,
            rp.kinematic_feasibility,
            rp.saturated_shear_strength,
            rp.porosity,
            rp.permeability,
            rp.created_at
        FROM rock_properties rp
        WHERE rp.created_at BETWEEN %s AND %s
        """
        return pd.read_sql(query, self.db, params=[start_time, end_time])
    
    def validate_data(self, data: pd.DataFrame) -> bool:
        """Validate geological data quality"""
        required_columns = ['uniaxial_compressive_strength', 'shear_strength', 'friction_angle']
        
        # Check for required columns
        missing_columns = [col for col in required_columns if col not in data.columns]
        if missing_columns:
            logger.warning(f"Missing required geological columns: {missing_columns}")
            return False
        
        # Check for reasonable value ranges
        if data['uniaxial_compressive_strength'].max() > 500:  # MPa
            logger.warning("Unrealistic UCS values detected")
            return False
            
        if data['friction_angle'].max() > 60:  # degrees
            logger.warning("Unrealistic friction angle values detected")
            return False
        
        return True
    
    def normalize_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Normalize geological data"""
        normalized = data.copy()
        
        # Normalize strength values to 0-1 scale
        strength_columns = ['uniaxial_compressive_strength', 'tensile_strength', 'shear_strength']
        for col in strength_columns:
            if col in normalized.columns:
                max_val = normalized[col].max()
                if max_val > 0:
                    normalized[f'{col}_normalized'] = normalized[col] / max_val
        
        # Convert boolean kinematic feasibility to numeric
        if 'kinematic_feasibility' in normalized.columns:
            normalized['kinematic_feasibility_score'] = normalized['kinematic_feasibility'].astype(int)
        
        return normalized

class SensorDataSource(DataSource):
    """Handles real-time sensor data"""
    
    def __init__(self, db_connection):
        self.db = db_connection
        
    def fetch_data(self, start_time: datetime, end_time: datetime) -> pd.DataFrame:
        """Fetch sensor readings"""
        query = """
        SELECT 
            sr.id,
            sr.sensor_id,
            s.sensor_type,
            s.site_id,
            sr.timestamp,
            sr.displacement_x,
            sr.displacement_y,
            sr.displacement_z,
            sr.velocity,
            sr.acceleration,
            sr.temperature,
            sr.humidity,
            sr.rainfall,
            sr.pore_pressure,
            sr.peak_particle_velocity,
            sr.frequency,
            sr.magnitude,
            sr.quality_score
        FROM sensor_readings sr
        JOIN sensors s ON sr.sensor_id = s.id
        WHERE sr.timestamp BETWEEN %s AND %s
        AND s.is_active = true
        ORDER BY sr.timestamp
        """
        return pd.read_sql(query, self.db, params=[start_time, end_time])
    
    def validate_data(self, data: pd.DataFrame) -> bool:
        """Validate sensor data quality"""
        if data.empty:
            logger.warning("No sensor data available")
            return False
        
        # Check for minimum quality score
        if 'quality_score' in data.columns:
            low_quality_data = data[data['quality_score'] < 0.5]
            if len(low_quality_data) > len(data) * 0.3:  # More than 30% low quality
                logger.warning("High proportion of low-quality sensor data")
                return False
        
        # Check for unrealistic displacement values
        if 'displacement_x' in data.columns:
            max_displacement = data[['displacement_x', 'displacement_y', 'displacement_z']].abs().max().max()
            if max_displacement > 1000:  # mm
                logger.warning("Unrealistic displacement values detected")
                return False
        
        return True
    
    def normalize_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Normalize sensor data"""
        normalized = data.copy()
        
        # Calculate total displacement magnitude
        if all(col in normalized.columns for col in ['displacement_x', 'displacement_y', 'displacement_z']):
            normalized['displacement_magnitude'] = np.sqrt(
                normalized['displacement_x']**2 + 
                normalized['displacement_y']**2 + 
                normalized['displacement_z']**2
            )
        
        # Normalize velocity and acceleration
        for col in ['velocity', 'acceleration']:
            if col in normalized.columns:
                normalized[f'{col}_normalized'] = (
                    (normalized[col] - normalized[col].min()) / 
                    (normalized[col].max() - normalized[col].min())
                ).fillna(0)
        
        # Add time-based features
        if 'timestamp' in normalized.columns:
            normalized['hour'] = pd.to_datetime(normalized['timestamp']).dt.hour
            normalized['day_of_week'] = pd.to_datetime(normalized['timestamp']).dt.dayofweek
        
        return normalized

class EnvironmentalDataSource(DataSource):
    """Handles environmental data (weather, seismic)"""
    
    def __init__(self, weather_api_key: str, seismic_api_key: str):
        self.weather_api_key = weather_api_key
        self.seismic_api_key = seismic_api_key
        
    def fetch_data(self, start_time: datetime, end_time: datetime) -> pd.DataFrame:
        """Fetch environmental data from external APIs"""
        # This would integrate with weather and seismic APIs
        # For demonstration, creating mock data
        
        time_range = pd.date_range(start_time, end_time, freq='H')
        data = {
            'timestamp': time_range,
            'temperature': np.random.normal(20, 5, len(time_range)),
            'humidity': np.random.uniform(30, 90, len(time_range)),
            'rainfall': np.random.exponential(2, len(time_range)),
            'wind_speed': np.random.gamma(2, 3, len(time_range)),
            'seismic_magnitude': np.random.exponential(0.5, len(time_range)),
            'seismic_frequency': np.random.normal(5, 2, len(time_range))
        }
        
        return pd.DataFrame(data)
    
    def validate_data(self, data: pd.DataFrame) -> bool:
        """Validate environmental data"""
        # Check for reasonable ranges
        if 'temperature' in data.columns:
            if data['temperature'].min() < -50 or data['temperature'].max() > 60:
                logger.warning("Unrealistic temperature values")
                return False
        
        if 'humidity' in data.columns:
            if data['humidity'].min() < 0 or data['humidity'].max() > 100:
                logger.warning("Invalid humidity values")
                return False
        
        return True
    
    def normalize_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Normalize environmental data"""
        normalized = data.copy()
        
        # Normalize weather parameters
        for col in ['temperature', 'humidity', 'wind_speed']:
            if col in normalized.columns:
                normalized[f'{col}_normalized'] = (
                    (normalized[col] - normalized[col].min()) / 
                    (normalized[col].max() - normalized[col].min())
                ).fillna(0)
        
        # Create rainfall intensity categories
        if 'rainfall' in normalized.columns:
            normalized['rainfall_intensity'] = pd.cut(
                normalized['rainfall'], 
                bins=[0, 2, 10, 25, float('inf')], 
                labels=['light', 'moderate', 'heavy', 'extreme']
            )
        
        return normalized

class DataFusionEngine:
    """Main data fusion engine that combines multiple data sources"""
    
    def __init__(self):
        self.data_sources: Dict[str, DataSource] = {}
        self.fusion_weights = {
            'geological': 0.4,
            'sensor': 0.35,
            'environmental': 0.25
        }
        
    def register_data_source(self, name: str, source: DataSource):
        """Register a data source"""
        self.data_sources[name] = source
        logger.info(f"Registered data source: {name}")
    
    def set_fusion_weights(self, weights: Dict[str, float]):
        """Set weights for different data sources"""
        if abs(sum(weights.values()) - 1.0) > 0.01:
            raise ValueError("Fusion weights must sum to 1.0")
        self.fusion_weights = weights
    
    def fetch_all_data(self, site_id: int, start_time: datetime, end_time: datetime) -> Dict[str, pd.DataFrame]:
        """Fetch data from all registered sources"""
        all_data = {}
        
        for name, source in self.data_sources.items():
            try:
                data = source.fetch_data(start_time, end_time)
                
                # Filter by site_id if applicable
                if 'site_id' in data.columns:
                    data = data[data['site_id'] == site_id]
                
                if source.validate_data(data):
                    normalized_data = source.normalize_data(data)
                    all_data[name] = normalized_data
                    logger.info(f"Successfully fetched and processed {name} data: {len(data)} records")
                else:
                    logger.warning(f"Data validation failed for source: {name}")
                    
            except Exception as e:
                logger.error(f"Error fetching data from {name}: {str(e)}")
        
        return all_data
    
    def create_feature_matrix(self, data_dict: Dict[str, pd.DataFrame]) -> pd.DataFrame:
        """Create a unified feature matrix from multiple data sources"""
        features = []
        
        # Extract geological features
        if 'geological' in data_dict:
            geo_data = data_dict['geological']
            if not geo_data.empty:
                geo_features = {
                    'rock_strength_avg': geo_data['uniaxial_compressive_strength'].mean(),
                    'shear_strength_avg': geo_data['shear_strength'].mean(),
                    'friction_angle_avg': geo_data['friction_angle'].mean(),
                    'fracture_spacing_avg': geo_data['fracture_spacing'].mean(),
                    'block_volume_avg': geo_data['block_volume'].mean(),
                    'kinematic_feasibility_ratio': geo_data['kinematic_feasibility'].sum() / len(geo_data),
                    'porosity_avg': geo_data['porosity'].mean(),
                    'permeability_avg': geo_data['permeability'].mean()
                }
                features.append(geo_features)
        
        # Extract sensor features
        if 'sensor' in data_dict:
            sensor_data = data_dict['sensor']
            if not sensor_data.empty:
                sensor_features = {
                    'displacement_magnitude_max': sensor_data.get('displacement_magnitude', pd.Series([0])).max(),
                    'displacement_magnitude_avg': sensor_data.get('displacement_magnitude', pd.Series([0])).mean(),
                    'velocity_max': sensor_data['velocity'].max() if 'velocity' in sensor_data.columns else 0,
                    'velocity_avg': sensor_data['velocity'].mean() if 'velocity' in sensor_data.columns else 0,
                    'acceleration_max': sensor_data['acceleration'].max() if 'acceleration' in sensor_data.columns else 0,
                    'pore_pressure_max': sensor_data['pore_pressure'].max() if 'pore_pressure' in sensor_data.columns else 0,
                    'pore_pressure_avg': sensor_data['pore_pressure'].mean() if 'pore_pressure' in sensor_data.columns else 0,
                    'ppv_max': sensor_data['peak_particle_velocity'].max() if 'peak_particle_velocity' in sensor_data.columns else 0,
                    'quality_score_avg': sensor_data['quality_score'].mean() if 'quality_score' in sensor_data.columns else 1.0
                }
                features.append(sensor_features)
        
        # Extract environmental features
        if 'environmental' in data_dict:
            env_data = data_dict['environmental']
            if not env_data.empty:
                env_features = {
                    'temperature_avg': env_data['temperature'].mean(),
                    'temperature_range': env_data['temperature'].max() - env_data['temperature'].min(),
                    'humidity_avg': env_data['humidity'].mean(),
                    'rainfall_total': env_data['rainfall'].sum(),
                    'rainfall_max_intensity': env_data['rainfall'].max(),
                    'wind_speed_max': env_data['wind_speed'].max(),
                    'seismic_magnitude_max': env_data['seismic_magnitude'].max(),
                    'seismic_frequency_avg': env_data['seismic_frequency'].mean()
                }
                features.append(env_features)
        
        # Combine all features
        if features:
            combined_features = {}
            for feature_dict in features:
                combined_features.update(feature_dict)
            
            return pd.DataFrame([combined_features])
        else:
            logger.warning("No valid features could be extracted")
            return pd.DataFrame()
    
    def calculate_risk_indicators(self, feature_matrix: pd.DataFrame) -> Dict[str, float]:
        """Calculate risk indicators from fused data"""
        if feature_matrix.empty:
            return {'overall_risk': 0.0, 'confidence': 0.0}
        
        indicators = {}
        
        # Geological risk indicators
        geo_risk = 0.0
        if 'rock_strength_avg' in feature_matrix.columns:
            # Lower strength = higher risk
            strength_risk = 1.0 - (feature_matrix['rock_strength_avg'].iloc[0] / 300.0)  # Normalize by typical max strength
            geo_risk += strength_risk * 0.3
        
        if 'kinematic_feasibility_ratio' in feature_matrix.columns:
            # Higher feasibility = higher risk
            kinematic_risk = feature_matrix['kinematic_feasibility_ratio'].iloc[0]
            geo_risk += kinematic_risk * 0.4
        
        if 'fracture_spacing_avg' in feature_matrix.columns:
            # Smaller spacing = higher risk
            spacing_risk = 1.0 - (feature_matrix['fracture_spacing_avg'].iloc[0] / 10.0)  # Normalize by typical max spacing
            geo_risk += spacing_risk * 0.3
        
        indicators['geological_risk'] = min(geo_risk, 1.0)
        
        # Environmental risk indicators
        env_risk = 0.0
        if 'rainfall_total' in feature_matrix.columns:
            # Higher rainfall = higher risk
            rainfall_risk = min(feature_matrix['rainfall_total'].iloc[0] / 50.0, 1.0)  # Normalize by critical rainfall
            env_risk += rainfall_risk * 0.5
        
        if 'pore_pressure_max' in feature_matrix.columns:
            # Higher pore pressure = higher risk
            pressure_risk = min(feature_matrix['pore_pressure_max'].iloc[0] / 200.0, 1.0)  # Normalize by critical pressure
            env_risk += pressure_risk * 0.3
        
        if 'seismic_magnitude_max' in feature_matrix.columns:
            # Higher seismic activity = higher risk
            seismic_risk = min(feature_matrix['seismic_magnitude_max'].iloc[0] / 5.0, 1.0)
            env_risk += seismic_risk * 0.2
        
        indicators['environmental_risk'] = min(env_risk, 1.0)
        
        # Sensor-based risk indicators
        sensor_risk = 0.0
        if 'displacement_magnitude_max' in feature_matrix.columns:
            # Higher displacement = higher risk
            displacement_risk = min(feature_matrix['displacement_magnitude_max'].iloc[0] / 50.0, 1.0)  # mm
            sensor_risk += displacement_risk * 0.4
        
        if 'velocity_max' in feature_matrix.columns:
            # Higher velocity = higher risk
            velocity_risk = min(feature_matrix['velocity_max'].iloc[0] / 10.0, 1.0)  # mm/day
            sensor_risk += velocity_risk * 0.3
        
        if 'acceleration_max' in feature_matrix.columns:
            # Higher acceleration = higher risk
            accel_risk = min(feature_matrix['acceleration_max'].iloc[0] / 1.0, 1.0)  # g
            sensor_risk += accel_risk * 0.3
        
        indicators['sensor_risk'] = min(sensor_risk, 1.0)
        
        # Calculate overall weighted risk
        overall_risk = (
            indicators.get('geological_risk', 0) * self.fusion_weights['geological'] +
            indicators.get('environmental_risk', 0) * self.fusion_weights['environmental'] +
            indicators.get('sensor_risk', 0) * self.fusion_weights['sensor']
        )
        
        indicators['overall_risk'] = overall_risk
        
        # Calculate confidence based on data availability and quality
        data_completeness = len([k for k, v in indicators.items() if v > 0 and k != 'overall_risk']) / 3.0
        quality_score = feature_matrix.get('quality_score_avg', pd.Series([0.8])).iloc[0]
        indicators['confidence'] = min(data_completeness * quality_score, 1.0)
        
        return indicators
    
    def process_site_data(self, site_id: int, hours_back: int = 24) -> Dict[str, Any]:
        """Process and fuse all data for a specific site"""
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=hours_back)
        
        logger.info(f"Processing data for site {site_id} from {start_time} to {end_time}")
        
        # Fetch all data
        all_data = self.fetch_all_data(site_id, start_time, end_time)
        
        if not all_data:
            logger.warning(f"No data available for site {site_id}")
            return {'error': 'No data available'}
        
        # Create feature matrix
        feature_matrix = self.create_feature_matrix(all_data)
        
        if feature_matrix.empty:
            logger.warning(f"Could not create feature matrix for site {site_id}")
            return {'error': 'Feature extraction failed'}
        
        # Calculate risk indicators
        risk_indicators = self.calculate_risk_indicators(feature_matrix)
        
        return {
            'site_id': site_id,
            'timestamp': end_time,
            'time_window_hours': hours_back,
            'data_sources_used': list(all_data.keys()),
            'features': feature_matrix.to_dict('records')[0],
            'risk_indicators': risk_indicators,
            'fusion_weights': self.fusion_weights
        }
