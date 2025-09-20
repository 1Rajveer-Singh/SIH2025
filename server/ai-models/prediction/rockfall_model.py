import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, mean_squared_error, r2_score
import joblib
import json
from typing import Dict, List, Tuple, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class RockfallPredictionModel:
    """Advanced machine learning model for rockfall prediction"""
    
    def __init__(self):
        self.risk_classifier = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'
        )
        
        self.probability_regressor = GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        
        self.volume_regressor = GradientBoostingRegressor(
            n_estimators=150,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        
        self.feature_scaler = StandardScaler()
        self.feature_names = None
        self.is_trained = False
        self.model_version = "1.0.0"
        self.training_metadata = {}
        
    def prepare_features(self, data: Dict[str, Any]) -> np.ndarray:
        """Prepare features from fused data"""
        if isinstance(data, dict) and 'features' in data:
            features_dict = data['features']
        else:
            features_dict = data
            
        # Define expected features in order
        expected_features = [
            # Geological features
            'rock_strength_avg', 'shear_strength_avg', 'friction_angle_avg',
            'fracture_spacing_avg', 'block_volume_avg', 'kinematic_feasibility_ratio',
            'porosity_avg', 'permeability_avg',
            
            # Sensor features
            'displacement_magnitude_max', 'displacement_magnitude_avg',
            'velocity_max', 'velocity_avg', 'acceleration_max',
            'pore_pressure_max', 'pore_pressure_avg', 'ppv_max',
            
            # Environmental features
            'temperature_avg', 'temperature_range', 'humidity_avg',
            'rainfall_total', 'rainfall_max_intensity', 'wind_speed_max',
            'seismic_magnitude_max', 'seismic_frequency_avg'
        ]
        
        # Extract features, filling missing with default values
        feature_values = []
        for feature in expected_features:
            if feature in features_dict and features_dict[feature] is not None:
                feature_values.append(float(features_dict[feature]))
            else:
                # Use default values for missing features
                default_values = {
                    'rock_strength_avg': 100.0, 'shear_strength_avg': 50.0,
                    'friction_angle_avg': 30.0, 'fracture_spacing_avg': 2.0,
                    'block_volume_avg': 1.0, 'kinematic_feasibility_ratio': 0.5,
                    'porosity_avg': 0.1, 'permeability_avg': 1e-6,
                    'displacement_magnitude_max': 0.0, 'displacement_magnitude_avg': 0.0,
                    'velocity_max': 0.0, 'velocity_avg': 0.0, 'acceleration_max': 0.0,
                    'pore_pressure_max': 100.0, 'pore_pressure_avg': 80.0, 'ppv_max': 0.0,
                    'temperature_avg': 20.0, 'temperature_range': 10.0, 'humidity_avg': 50.0,
                    'rainfall_total': 0.0, 'rainfall_max_intensity': 0.0, 'wind_speed_max': 5.0,
                    'seismic_magnitude_max': 0.0, 'seismic_frequency_avg': 1.0
                }
                feature_values.append(default_values.get(feature, 0.0))
        
        self.feature_names = expected_features
        return np.array(feature_values).reshape(1, -1)
    
    def create_synthetic_training_data(self, n_samples: int = 10000) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """Create synthetic training data for demonstration"""
        np.random.seed(42)
        
        # Generate features
        n_features = 25
        X = np.random.rand(n_samples, n_features)
        
        # Feature scaling to realistic ranges
        feature_ranges = {
            # Geological features (indices 0-7)
            0: (50, 300),    # rock_strength_avg
            1: (20, 150),    # shear_strength_avg
            2: (15, 45),     # friction_angle_avg
            3: (0.1, 10),    # fracture_spacing_avg
            4: (0.1, 50),    # block_volume_avg
            5: (0, 1),       # kinematic_feasibility_ratio
            6: (0.01, 0.3),  # porosity_avg
            7: (1e-8, 1e-4), # permeability_avg
            
            # Sensor features (indices 8-15)
            8: (0, 100),     # displacement_magnitude_max
            9: (0, 50),      # displacement_magnitude_avg
            10: (0, 20),     # velocity_max
            11: (0, 10),     # velocity_avg
            12: (0, 2),      # acceleration_max
            13: (50, 300),   # pore_pressure_max
            14: (40, 250),   # pore_pressure_avg
            15: (0, 50),     # ppv_max
            
            # Environmental features (indices 16-24)
            16: (-10, 40),   # temperature_avg
            17: (5, 30),     # temperature_range
            18: (20, 90),    # humidity_avg
            19: (0, 100),    # rainfall_total
            20: (0, 50),     # rainfall_max_intensity
            21: (0, 30),     # wind_speed_max
            22: (0, 6),      # seismic_magnitude_max
            23: (0.1, 20),   # seismic_frequency_avg
            24: (0.5, 1.0)   # quality_score (additional feature)
        }
        
        for i, (min_val, max_val) in feature_ranges.items():
            if i < X.shape[1]:
                X[:, i] = X[:, i] * (max_val - min_val) + min_val
        
        # Generate risk levels based on complex rules
        risk_scores = np.zeros(n_samples)
        
        for i in range(n_samples):
            # Geological risk contribution
            geo_risk = 0.0
            if X[i, 0] < 100:  # Low rock strength
                geo_risk += 0.3
            if X[i, 5] > 0.7:  # High kinematic feasibility
                geo_risk += 0.2
            if X[i, 3] < 1.0:  # Small fracture spacing
                geo_risk += 0.2
            
            # Environmental risk contribution
            env_risk = 0.0
            if X[i, 19] > 50:  # High rainfall
                env_risk += 0.3
            if X[i, 13] > 200:  # High pore pressure
                env_risk += 0.25
            if X[i, 22] > 3:  # High seismic activity
                env_risk += 0.2
            
            # Sensor risk contribution
            sensor_risk = 0.0
            if X[i, 8] > 50:  # High displacement
                sensor_risk += 0.4
            if X[i, 10] > 10:  # High velocity
                sensor_risk += 0.3
            if X[i, 12] > 1:  # High acceleration
                sensor_risk += 0.3
            
            # Combine risks with weights
            total_risk = geo_risk * 0.4 + env_risk * 0.35 + sensor_risk * 0.25
            
            # Add some noise
            total_risk += np.random.normal(0, 0.1)
            risk_scores[i] = np.clip(total_risk, 0, 1)
        
        # Create risk categories
        risk_categories = np.zeros(n_samples, dtype=int)
        risk_categories[risk_scores < 0.3] = 0  # Low
        risk_categories[(risk_scores >= 0.3) & (risk_scores < 0.6)] = 1  # Medium
        risk_categories[(risk_scores >= 0.6) & (risk_scores < 0.8)] = 2  # High
        risk_categories[risk_scores >= 0.8] = 3  # Critical
        
        # Generate failure probabilities (correlated with risk scores)
        failure_probs = risk_scores * 0.8 + np.random.normal(0, 0.05, n_samples)
        failure_probs = np.clip(failure_probs, 0, 1)
        
        # Generate volumes (higher risk typically means larger volumes)
        volumes = risk_scores * 500 + np.random.exponential(100, n_samples)
        volumes = np.clip(volumes, 1, 2000)
        
        return X, risk_categories, failure_probs, volumes
    
    def train(self, training_data: Optional[Tuple] = None) -> Dict[str, Any]:
        """Train the rockfall prediction models"""
        logger.info("Starting model training...")
        
        if training_data is None:
            logger.info("No training data provided, generating synthetic data...")
            X, y_risk, y_prob, y_volume = self.create_synthetic_training_data()
        else:
            X, y_risk, y_prob, y_volume = training_data
        
        # Split data
        X_train, X_test, y_risk_train, y_risk_test = train_test_split(
            X, y_risk, test_size=0.2, random_state=42, stratify=y_risk
        )
        
        _, _, y_prob_train, y_prob_test = train_test_split(
            X, y_prob, test_size=0.2, random_state=42
        )
        
        _, _, y_vol_train, y_vol_test = train_test_split(
            X, y_volume, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.feature_scaler.fit_transform(X_train)
        X_test_scaled = self.feature_scaler.transform(X_test)
        
        # Train risk classifier
        logger.info("Training risk level classifier...")
        self.risk_classifier.fit(X_train_scaled, y_risk_train)
        risk_pred = self.risk_classifier.predict(X_test_scaled)
        risk_accuracy = np.mean(risk_pred == y_risk_test)
        
        # Train probability regressor
        logger.info("Training failure probability regressor...")
        self.probability_regressor.fit(X_train_scaled, y_prob_train)
        prob_pred = self.probability_regressor.predict(X_test_scaled)
        prob_mse = mean_squared_error(y_prob_test, prob_pred)
        prob_r2 = r2_score(y_prob_test, prob_pred)
        
        # Train volume regressor
        logger.info("Training volume regressor...")
        self.volume_regressor.fit(X_train_scaled, y_vol_train)
        vol_pred = self.volume_regressor.predict(X_test_scaled)
        vol_mse = mean_squared_error(y_vol_test, vol_pred)
        vol_r2 = r2_score(y_vol_test, vol_pred)
        
        self.is_trained = True
        
        # Store training metadata
        self.training_metadata = {
            'training_samples': len(X_train),
            'test_samples': len(X_test),
            'features_count': X.shape[1],
            'risk_accuracy': risk_accuracy,
            'probability_mse': prob_mse,
            'probability_r2': prob_r2,
            'volume_mse': vol_mse,
            'volume_r2': vol_r2,
            'training_date': datetime.utcnow().isoformat(),
            'model_version': self.model_version
        }
        
        logger.info(f"Model training completed:")
        logger.info(f"  Risk accuracy: {risk_accuracy:.3f}")
        logger.info(f"  Probability R²: {prob_r2:.3f}")
        logger.info(f"  Volume R²: {vol_r2:.3f}")
        
        return self.training_metadata
    
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Make predictions for rockfall risk"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Prepare features
        features = self.prepare_features(data)
        features_scaled = self.feature_scaler.transform(features)
        
        # Make predictions
        risk_level_idx = self.risk_classifier.predict(features_scaled)[0]
        risk_probabilities = self.risk_classifier.predict_proba(features_scaled)[0]
        failure_probability = self.probability_regressor.predict(features_scaled)[0]
        estimated_volume = self.volume_regressor.predict(features_scaled)[0]
        
        # Convert risk level index to label
        risk_levels = ['low', 'medium', 'high', 'critical']
        risk_level = risk_levels[risk_level_idx]
        
        # Calculate confidence based on prediction probabilities
        confidence = np.max(risk_probabilities)
        
        # Determine primary triggers based on feature importance
        feature_importance = self.risk_classifier.feature_importances_
        top_features_idx = np.argsort(feature_importance)[-3:]  # Top 3 features
        
        trigger_mapping = {
            'rock_strength_avg': 'geological_weakness',
            'shear_strength_avg': 'shear_failure',
            'kinematic_feasibility_ratio': 'block_instability',
            'rainfall_total': 'rainfall',
            'pore_pressure_max': 'pore_pressure',
            'seismic_magnitude_max': 'seismic_activity',
            'displacement_magnitude_max': 'slope_movement',
            'velocity_max': 'accelerating_movement'
        }
        
        primary_triggers = []
        if self.feature_names:
            for idx in top_features_idx:
                if idx < len(self.feature_names):
                    feature_name = self.feature_names[idx]
                    trigger = trigger_mapping.get(feature_name, feature_name)
                    primary_triggers.append(trigger)
        
        # Calculate risk score as weighted average
        risk_score = np.sum(risk_probabilities * np.array([0.1, 0.3, 0.7, 0.9]))
        
        prediction_result = {
            'risk_level': risk_level,
            'risk_score': float(risk_score),
            'probability_of_failure': float(np.clip(failure_probability, 0, 1)),
            'estimated_volume': float(max(0, estimated_volume)),
            'confidence': float(confidence),
            'confidence_interval': {
                'lower': float(max(0, risk_score - 0.1)),
                'upper': float(min(1, risk_score + 0.1))
            },
            'primary_triggers': primary_triggers,
            'model_version': self.model_version,
            'prediction_timestamp': datetime.utcnow().isoformat(),
            'feature_importance': {
                name: float(importance) 
                for name, importance in zip(self.feature_names or [], feature_importance)
            } if self.feature_names else {}
        }
        
        return prediction_result
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from the trained model"""
        if not self.is_trained:
            raise ValueError("Model must be trained to get feature importance")
        
        importance = self.risk_classifier.feature_importances_
        if self.feature_names:
            return {name: float(imp) for name, imp in zip(self.feature_names, importance)}
        else:
            return {f"feature_{i}": float(imp) for i, imp in enumerate(importance)}
    
    def save_model(self, filepath: str):
        """Save the trained model to disk"""
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        model_data = {
            'risk_classifier': self.risk_classifier,
            'probability_regressor': self.probability_regressor,
            'volume_regressor': self.volume_regressor,
            'feature_scaler': self.feature_scaler,
            'feature_names': self.feature_names,
            'model_version': self.model_version,
            'training_metadata': self.training_metadata,
            'is_trained': self.is_trained
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str):
        """Load a trained model from disk"""
        try:
            model_data = joblib.load(filepath)
            
            self.risk_classifier = model_data['risk_classifier']
            self.probability_regressor = model_data['probability_regressor']
            self.volume_regressor = model_data['volume_regressor']
            self.feature_scaler = model_data['feature_scaler']
            self.feature_names = model_data['feature_names']
            self.model_version = model_data['model_version']
            self.training_metadata = model_data['training_metadata']
            self.is_trained = model_data['is_trained']
            
            logger.info(f"Model loaded from {filepath}")
            logger.info(f"Model version: {self.model_version}")
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise
    
    def validate_model(self, validation_data: Optional[Tuple] = None) -> Dict[str, Any]:
        """Validate the model performance"""
        if not self.is_trained:
            raise ValueError("Model must be trained before validation")
        
        if validation_data is None:
            # Generate validation data
            X_val, y_risk_val, y_prob_val, y_vol_val = self.create_synthetic_training_data(1000)
        else:
            X_val, y_risk_val, y_prob_val, y_vol_val = validation_data
        
        X_val_scaled = self.feature_scaler.transform(X_val)
        
        # Validate risk classifier
        risk_pred = self.risk_classifier.predict(X_val_scaled)
        risk_accuracy = np.mean(risk_pred == y_risk_val)
        
        # Validate probability regressor
        prob_pred = self.probability_regressor.predict(X_val_scaled)
        prob_mse = mean_squared_error(y_prob_val, prob_pred)
        prob_r2 = r2_score(y_prob_val, prob_pred)
        
        # Validate volume regressor
        vol_pred = self.volume_regressor.predict(X_val_scaled)
        vol_mse = mean_squared_error(y_vol_val, vol_pred)
        vol_r2 = r2_score(y_vol_val, vol_pred)
        
        validation_results = {
            'validation_samples': len(X_val),
            'risk_accuracy': risk_accuracy,
            'probability_mse': prob_mse,
            'probability_r2': prob_r2,
            'volume_mse': vol_mse,
            'volume_r2': vol_r2,
            'validation_date': datetime.utcnow().isoformat()
        }
        
        logger.info("Model validation completed:")
        logger.info(f"  Risk accuracy: {risk_accuracy:.3f}")
        logger.info(f"  Probability R²: {prob_r2:.3f}")
        logger.info(f"  Volume R²: {vol_r2:.3f}")
        
        return validation_results
