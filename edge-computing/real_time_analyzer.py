"""
Real-time Analyzer Module
Performs immediate threat detection and risk assessment
"""

import asyncio
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import json

class RealTimeAnalyzer:
    """Real-time threat analysis and alert generation"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.thresholds = self.load_thresholds()
        self.alert_history = []
        self.baseline_data = None
        
    def load_thresholds(self) -> Dict[str, float]:
        """Load threat detection thresholds"""
        return {
            'instability_threshold': 0.5,
            'acceleration_threshold': 0.3,
            'tilt_threshold': 0.1,
            'environmental_threshold': 0.7,
            'combined_risk_threshold': 0.6,
            'emergency_threshold': 0.8
        }
    
    async def analyze_data(self, data: Dict[str, Any]):
        """Analyze incoming data for threats"""
        analysis_result = {
            'timestamp': datetime.utcnow().isoformat(),
            'data_id': data.get('timestamp'),
            'threat_level': 0.0,
            'risk_factors': {},
            'recommendations': []
        }
        
        # Analyze individual sensors
        sensors = data.get('sensors', {})
        derived = data.get('derived_metrics', {})
        
        # Accelerometer analysis
        if 'accelerometer' in sensors:
            accel_risk = await self.analyze_accelerometer(sensors['accelerometer'])
            analysis_result['risk_factors']['acceleration'] = accel_risk
        
        # Tiltmeter analysis
        if 'tiltmeter' in sensors:
            tilt_risk = await self.analyze_tiltmeter(sensors['tiltmeter'])
            analysis_result['risk_factors']['tilt'] = tilt_risk
        
        # Environmental analysis
        if 'weather' in sensors:
            env_risk = await self.analyze_environmental(sensors['weather'])
            analysis_result['risk_factors']['environmental'] = env_risk
        
        # Derived metrics analysis
        if derived:
            derived_risk = await self.analyze_derived_metrics(derived)
            analysis_result['risk_factors']['derived'] = derived_risk
        
        # Calculate overall threat level
        analysis_result['threat_level'] = await self.calculate_threat_level(
            analysis_result['risk_factors']
        )
        
        # Generate recommendations
        analysis_result['recommendations'] = await self.generate_recommendations(
            analysis_result['threat_level'], 
            analysis_result['risk_factors']
        )
        
        return analysis_result
    
    async def analyze_accelerometer(self, accel_data: Dict[str, float]) -> Dict[str, Any]:
        """Analyze accelerometer data for movement anomalies"""
        magnitude = accel_data.get('magnitude', 9.81)
        frequency = accel_data.get('frequency', 0)
        
        # Deviation from normal gravity
        gravity_deviation = abs(magnitude - 9.81) / 9.81
        
        # High frequency vibrations indicate instability
        frequency_risk = min(1.0, frequency / 5.0)  # Normalize to 0-1
        
        risk_score = (gravity_deviation * 0.6 + frequency_risk * 0.4)
        
        return {
            'risk_score': min(1.0, risk_score),
            'gravity_deviation': gravity_deviation,
            'frequency_risk': frequency_risk,
            'alert_level': 'high' if risk_score > self.thresholds['acceleration_threshold'] else 'normal'
        }
    
    async def analyze_tiltmeter(self, tilt_data: Dict[str, float]) -> Dict[str, Any]:
        """Analyze tiltmeter data for slope movement"""
        x_tilt = abs(tilt_data.get('x_tilt', 0))
        y_tilt = abs(tilt_data.get('y_tilt', 0))
        
        max_tilt = max(x_tilt, y_tilt)
        total_tilt = np.sqrt(x_tilt**2 + y_tilt**2)
        
        # Risk increases exponentially with tilt
        risk_score = min(1.0, total_tilt / self.thresholds['tilt_threshold'])
        
        return {
            'risk_score': risk_score,
            'max_tilt': max_tilt,
            'total_tilt': total_tilt,
            'alert_level': 'high' if risk_score > 0.7 else 'normal'
        }
    
    async def analyze_environmental(self, weather_data: Dict[str, float]) -> Dict[str, Any]:
        """Analyze environmental conditions"""
        rainfall = weather_data.get('rainfall', 0)
        wind_speed = weather_data.get('wind_speed', 0)
        temperature = weather_data.get('temperature', 20)
        
        # Heavy rain increases rockfall risk
        rain_risk = min(1.0, rainfall / 5.0)  # Risk factor for rainfall > 5mm
        
        # Strong winds can trigger rockfall
        wind_risk = min(1.0, max(0, wind_speed - 10) / 10.0)  # Risk for wind > 10 m/s
        
        # Temperature fluctuations (freeze-thaw cycles)
        temp_risk = 0.5 if -2 <= temperature <= 2 else 0.0  # Freeze-thaw zone
        
        risk_score = (rain_risk * 0.5 + wind_risk * 0.3 + temp_risk * 0.2)
        
        return {
            'risk_score': risk_score,
            'rain_risk': rain_risk,
            'wind_risk': wind_risk,
            'temperature_risk': temp_risk,
            'alert_level': 'high' if risk_score > self.thresholds['environmental_threshold'] else 'normal'
        }
    
    async def analyze_derived_metrics(self, derived_data: Dict[str, float]) -> Dict[str, Any]:
        """Analyze calculated derived metrics"""
        instability = derived_data.get('instability_index', 0)
        env_risk = derived_data.get('environmental_risk', 0)
        
        # Combined risk assessment
        combined_risk = (instability * 0.7 + env_risk * 0.3)
        
        return {
            'risk_score': combined_risk,
            'instability_index': instability,
            'environmental_component': env_risk,
            'alert_level': 'high' if combined_risk > self.thresholds['combined_risk_threshold'] else 'normal'
        }
    
    async def calculate_threat_level(self, risk_factors: Dict[str, Any]) -> float:
        """Calculate overall threat level from all risk factors"""
        if not risk_factors:
            return 0.0
        
        # Weight different risk factors
        weights = {
            'acceleration': 0.25,
            'tilt': 0.30,
            'environmental': 0.20,
            'derived': 0.25
        }
        
        total_risk = 0.0
        total_weight = 0.0
        
        for factor, data in risk_factors.items():
            if factor in weights and 'risk_score' in data:
                total_risk += data['risk_score'] * weights[factor]
                total_weight += weights[factor]
        
        return total_risk / total_weight if total_weight > 0 else 0.0
    
    async def generate_recommendations(self, threat_level: float, risk_factors: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations based on threat level"""
        recommendations = []
        
        if threat_level > self.thresholds['emergency_threshold']:
            recommendations.extend([
                "IMMEDIATE EVACUATION RECOMMENDED",
                "Alert emergency services",
                "Activate emergency protocols",
                "Continuous monitoring required"
            ])
        elif threat_level > self.thresholds['combined_risk_threshold']:
            recommendations.extend([
                "Increase monitoring frequency",
                "Restrict access to high-risk areas",
                "Prepare evacuation procedures",
                "Contact geological team"
            ])
        elif threat_level > 0.3:
            recommendations.extend([
                "Enhanced monitoring recommended",
                "Review recent geological changes",
                "Check sensor calibration"
            ])
        
        # Specific recommendations based on risk factors
        for factor, data in risk_factors.items():
            if data.get('alert_level') == 'high':
                if factor == 'acceleration':
                    recommendations.append("High vibration detected - check for equipment interference")
                elif factor == 'tilt':
                    recommendations.append("Significant slope movement detected")
                elif factor == 'environmental':
                    recommendations.append("Adverse weather conditions - increased rockfall risk")
        
        return recommendations
    
    async def assess_threat_level(self, data_history: List[Dict[str, Any]]) -> float:
        """Assess threat level from historical data trends"""
        if not data_history:
            return 0.0
        
        # Analyze trends in the data
        recent_threats = []
        for data_point in data_history[-10:]:  # Last 10 readings
            analysis = await self.analyze_data(data_point)
            recent_threats.append(analysis['threat_level'])
        
        # Calculate trend
        if len(recent_threats) >= 3:
            trend = np.polyfit(range(len(recent_threats)), recent_threats, 1)[0]
            current_level = recent_threats[-1]
            
            # Increase threat if trend is increasing
            if trend > 0.01:  # Increasing trend
                return min(1.0, current_level + trend * 5)
            else:
                return current_level
        
        return recent_threats[-1] if recent_threats else 0.0
    
    async def generate_alert(self, threat_level: float, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate alert message for high threat situations"""
        alert = {
            'id': f"alert_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            'timestamp': datetime.utcnow().isoformat(),
            'threat_level': threat_level,
            'severity': self.get_severity_level(threat_level),
            'site_id': self.config['edge_device']['location'],
            'message': self.generate_alert_message(threat_level, data),
            'data_snapshot': data,
            'recommended_actions': await self.generate_recommendations(threat_level, {})
        }
        
        self.alert_history.append(alert)
        return alert
    
    def get_severity_level(self, threat_level: float) -> str:
        """Convert threat level to severity category"""
        if threat_level >= 0.8:
            return 'critical'
        elif threat_level >= 0.6:
            return 'high'
        elif threat_level >= 0.3:
            return 'medium'
        else:
            return 'low'
    
    def generate_alert_message(self, threat_level: float, data: Dict[str, Any]) -> str:
        """Generate human-readable alert message"""
        severity = self.get_severity_level(threat_level)
        location = self.config['edge_device']['location']
        
        if severity == 'critical':
            return f"CRITICAL ROCKFALL RISK detected at {location}. Immediate evacuation recommended."
        elif severity == 'high':
            return f"HIGH ROCKFALL RISK detected at {location}. Enhanced monitoring and restricted access advised."
        elif severity == 'medium':
            return f"ELEVATED ROCKFALL RISK detected at {location}. Increased vigilance recommended."
        else:
            return f"Normal monitoring alert from {location}."
    
    async def update_thresholds(self, new_thresholds: Dict[str, float]):
        """Update analysis thresholds from central server"""
        self.thresholds.update(new_thresholds)
    
    async def cleanup(self):
        """Cleanup resources"""
        pass