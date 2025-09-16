from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.schemas import *
from app.models.database import Prediction, GeologicalSite, User

router = APIRouter()

@router.post("/predictions", response_model=APIResponse)
async def create_prediction(
    prediction: PredictionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new prediction"""
    # Check if site exists and user has access
    site = db.query(GeologicalSite).filter(GeologicalSite.id == prediction.site_id).first()
    
    if not site:
        raise HTTPException(
            status_code=404,
            detail="Geological site not found"
        )
    
    if current_user.role != "admin" and site.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create predictions for this site"
        )
    
    db_prediction = Prediction(**prediction.dict())
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    
    return APIResponse(
        success=True,
        message="Prediction created successfully",
        data={"prediction_id": db_prediction.id, "risk_level": db_prediction.risk_level}
    )

@router.get("/predictions", response_model=APIResponse)
async def list_predictions(
    site_id: Optional[int] = None,
    risk_level: Optional[RiskLevel] = None,
    model_version: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List predictions with optional filtering"""
    query = db.query(Prediction)
    
    # Filter by user access for non-admin users
    if current_user.role != "admin":
        user_sites = db.query(GeologicalSite.id).filter(GeologicalSite.owner_id == current_user.id).subquery()
        query = query.filter(Prediction.site_id.in_(user_sites))
    
    # Apply filters
    if site_id:
        query = query.filter(Prediction.site_id == site_id)
    if risk_level:
        query = query.filter(Prediction.risk_level == risk_level)
    if model_version:
        query = query.filter(Prediction.model_version == model_version)
    
    # Order by prediction timestamp descending (most recent first)
    query = query.order_by(Prediction.prediction_timestamp.desc())
    
    predictions = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return APIResponse(
        success=True,
        message="Predictions retrieved successfully",
        data={
            "predictions": [
                {
                    "id": prediction.id,
                    "site_id": prediction.site_id,
                    "model_version": prediction.model_version,
                    "prediction_timestamp": prediction.prediction_timestamp,
                    "prediction_horizon": prediction.prediction_horizon,
                    "risk_level": prediction.risk_level,
                    "risk_score": prediction.risk_score,
                    "probability_of_failure": prediction.probability_of_failure,
                    "estimated_volume": prediction.estimated_volume,
                    "confidence_interval": prediction.confidence_interval,
                    "primary_triggers": prediction.primary_triggers,
                    "factor_weights": prediction.factor_weights,
                    "model_accuracy": prediction.model_accuracy,
                    "features_used": prediction.features_used,
                    "training_data_size": prediction.training_data_size
                }
                for prediction in predictions
            ],
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "per_page": limit
        }
    )

@router.get("/predictions/{prediction_id}", response_model=APIResponse)
async def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific prediction"""
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    
    if not prediction:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )
    
    # Check permissions
    if current_user.role != "admin":
        site = db.query(GeologicalSite).filter(GeologicalSite.id == prediction.site_id).first()
        if not site or site.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to access this prediction"
            )
    
    return APIResponse(
        success=True,
        message="Prediction retrieved successfully",
        data={
            "id": prediction.id,
            "site_id": prediction.site_id,
            "model_version": prediction.model_version,
            "prediction_timestamp": prediction.prediction_timestamp,
            "prediction_horizon": prediction.prediction_horizon,
            "risk_level": prediction.risk_level,
            "risk_score": prediction.risk_score,
            "probability_of_failure": prediction.probability_of_failure,
            "estimated_volume": prediction.estimated_volume,
            "confidence_interval": prediction.confidence_interval,
            "primary_triggers": prediction.primary_triggers,
            "factor_weights": prediction.factor_weights,
            "model_accuracy": prediction.model_accuracy,
            "features_used": prediction.features_used,
            "training_data_size": prediction.training_data_size
        }
    )

@router.get("/predictions/latest/{site_id}", response_model=APIResponse)
async def get_latest_prediction(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the latest prediction for a site"""
    # Check if site exists and user has access
    site = db.query(GeologicalSite).filter(GeologicalSite.id == site_id).first()
    
    if not site:
        raise HTTPException(
            status_code=404,
            detail="Geological site not found"
        )
    
    if current_user.role != "admin" and site.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to access predictions for this site"
        )
    
    latest_prediction = db.query(Prediction).filter(
        Prediction.site_id == site_id
    ).order_by(Prediction.prediction_timestamp.desc()).first()
    
    if not latest_prediction:
        return APIResponse(
            success=True,
            message="No predictions found for this site",
            data=None
        )
    
    return APIResponse(
        success=True,
        message="Latest prediction retrieved successfully",
        data={
            "id": latest_prediction.id,
            "site_id": latest_prediction.site_id,
            "model_version": latest_prediction.model_version,
            "prediction_timestamp": latest_prediction.prediction_timestamp,
            "prediction_horizon": latest_prediction.prediction_horizon,
            "risk_level": latest_prediction.risk_level,
            "risk_score": latest_prediction.risk_score,
            "probability_of_failure": latest_prediction.probability_of_failure,
            "estimated_volume": latest_prediction.estimated_volume,
            "confidence_interval": latest_prediction.confidence_interval,
            "primary_triggers": latest_prediction.primary_triggers,
            "factor_weights": latest_prediction.factor_weights,
            "model_accuracy": latest_prediction.model_accuracy
        }
    )

@router.post("/predictions/generate/{site_id}", response_model=APIResponse)
async def generate_prediction(
    site_id: int,
    prediction_horizon: int = 24,  # hours
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate a new prediction for a site using AI models"""
    # Check if site exists and user has access
    site = db.query(GeologicalSite).filter(GeologicalSite.id == site_id).first()
    
    if not site:
        raise HTTPException(
            status_code=404,
            detail="Geological site not found"
        )
    
    if current_user.role != "admin" and site.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to generate predictions for this site"
        )
    
    # Here you would integrate with your AI model
    # For now, we'll create a mock prediction
    from random import random, choice
    import json
    
    # Mock AI prediction generation
    risk_score = random()
    risk_levels = ["low", "medium", "high", "critical"]
    
    if risk_score < 0.3:
        risk_level = "low"
    elif risk_score < 0.6:
        risk_level = "medium"
    elif risk_score < 0.8:
        risk_level = "high"
    else:
        risk_level = "critical"
    
    # Create prediction
    db_prediction = Prediction(
        site_id=site_id,
        model_version="v1.0.0",
        prediction_horizon=prediction_horizon,
        risk_level=risk_level,
        risk_score=risk_score,
        probability_of_failure=risk_score * 0.8,
        estimated_volume=random() * 1000,  # cubic meters
        confidence_interval={"lower": max(0, risk_score - 0.1), "upper": min(1, risk_score + 0.1)},
        primary_triggers=["rainfall", "seismic_activity", "pore_pressure"],
        factor_weights={
            "geological": 0.4,
            "environmental": 0.35,
            "seismic": 0.25
        },
        model_accuracy=0.85,
        features_used=[
            "rock_strength", "fracture_spacing", "pore_pressure",
            "rainfall", "temperature", "displacement_rate"
        ],
        training_data_size=10000
    )
    
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    
    # Generate alert if risk is high or critical
    if risk_level in ["high", "critical"]:
        from app.models.database import Alert
        
        alert_severity = "high" if risk_level == "high" else "critical"
        alert_message = f"High risk of rockfall detected at {site.name}. Risk score: {risk_score:.2f}"
        
        if risk_level == "critical":
            alert_message = f"CRITICAL ALERT: Imminent rockfall risk at {site.name}. Immediate action required!"
        
        db_alert = Alert(
            user_id=current_user.id,
            site_id=site_id,
            alert_type="early_warning",
            severity=alert_severity,
            title=f"Rockfall Risk Alert - {site.name}",
            message=alert_message,
            triggered_by={"prediction_id": db_prediction.id, "model_version": "v1.0.0"},
            recommended_actions=[
                "Increase monitoring frequency",
                "Restrict access to affected area",
                "Consider evacuation if critical"
            ],
            estimated_impact={
                "affected_area_m2": random() * 10000,
                "estimated_volume_m3": db_prediction.estimated_volume,
                "potential_casualties": "low" if risk_level == "high" else "medium"
            }
        )
        
        db.add(db_alert)
        db.commit()
    
    return APIResponse(
        success=True,
        message="Prediction generated successfully",
        data={
            "prediction_id": db_prediction.id,
            "risk_level": db_prediction.risk_level,
            "risk_score": db_prediction.risk_score,
            "probability_of_failure": db_prediction.probability_of_failure,
            "prediction_horizon": db_prediction.prediction_horizon,
            "alert_generated": risk_level in ["high", "critical"]
        }
    )

@router.get("/predictions/risk-trends/{site_id}", response_model=APIResponse)
async def get_risk_trends(
    site_id: int,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get risk trends for a site over time"""
    from datetime import timedelta
    
    # Check if site exists and user has access
    site = db.query(GeologicalSite).filter(GeologicalSite.id == site_id).first()
    
    if not site:
        raise HTTPException(
            status_code=404,
            detail="Geological site not found"
        )
    
    if current_user.role != "admin" and site.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to access risk trends for this site"
        )
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    predictions = db.query(Prediction).filter(
        Prediction.site_id == site_id,
        Prediction.prediction_timestamp >= start_date
    ).order_by(Prediction.prediction_timestamp.asc()).all()
    
    if not predictions:
        return APIResponse(
            success=True,
            message="No predictions found for the specified period",
            data={"trends": [], "summary": {}}
        )
    
    # Calculate trends
    trend_data = []
    for prediction in predictions:
        trend_data.append({
            "timestamp": prediction.prediction_timestamp,
            "risk_score": prediction.risk_score,
            "risk_level": prediction.risk_level,
            "probability_of_failure": prediction.probability_of_failure,
            "primary_triggers": prediction.primary_triggers
        })
    
    # Calculate summary statistics
    risk_scores = [p.risk_score for p in predictions]
    avg_risk = sum(risk_scores) / len(risk_scores)
    max_risk = max(risk_scores)
    min_risk = min(risk_scores)
    
    risk_level_counts = {}
    for prediction in predictions:
        level = prediction.risk_level
        risk_level_counts[level] = risk_level_counts.get(level, 0) + 1
    
    return APIResponse(
        success=True,
        message="Risk trends retrieved successfully",
        data={
            "trends": trend_data,
            "summary": {
                "period_days": days,
                "total_predictions": len(predictions),
                "average_risk_score": round(avg_risk, 3),
                "maximum_risk_score": round(max_risk, 3),
                "minimum_risk_score": round(min_risk, 3),
                "risk_level_distribution": risk_level_counts,
                "trend_direction": "increasing" if risk_scores[-1] > risk_scores[0] else "decreasing"
            }
        }
    )
