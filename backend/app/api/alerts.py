from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.schemas import *
from app.models.database import Alert, GeologicalSite, User

router = APIRouter()

@router.post("/alerts", response_model=APIResponse)
async def create_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new alert"""
    # Check if site exists and user has access
    site = db.query(GeologicalSite).filter(GeologicalSite.id == alert.site_id).first()
    
    if not site:
        raise HTTPException(
            status_code=404,
            detail="Geological site not found"
        )
    
    if current_user.role != "admin" and site.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create alerts for this site"
        )
    
    db_alert = Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    
    return APIResponse(
        success=True,
        message="Alert created successfully",
        data={"alert_id": db_alert.id, "severity": db_alert.severity}
    )

@router.get("/alerts", response_model=APIResponse)
async def list_alerts(
    site_id: Optional[int] = None,
    severity: Optional[RiskLevel] = None,
    alert_type: Optional[AlertType] = None,
    is_active: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List alerts with optional filtering"""
    query = db.query(Alert)
    
    # Filter by user access for non-admin users
    if current_user.role != "admin":
        user_sites = db.query(GeologicalSite.id).filter(GeologicalSite.owner_id == current_user.id).subquery()
        query = query.filter(Alert.site_id.in_(user_sites))
    
    # Apply filters
    if site_id:
        query = query.filter(Alert.site_id == site_id)
    if severity:
        query = query.filter(Alert.severity == severity)
    if alert_type:
        query = query.filter(Alert.alert_type == alert_type)
    if is_active is not None:
        query = query.filter(Alert.is_active == is_active)
    
    # Order by creation date descending (most recent first)
    query = query.order_by(Alert.created_at.desc())
    
    alerts = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return APIResponse(
        success=True,
        message="Alerts retrieved successfully",
        data={
            "alerts": [
                {
                    "id": alert.id,
                    "site_id": alert.site_id,
                    "user_id": alert.user_id,
                    "alert_type": alert.alert_type,
                    "severity": alert.severity,
                    "title": alert.title,
                    "message": alert.message,
                    "triggered_by": alert.triggered_by,
                    "recommended_actions": alert.recommended_actions,
                    "estimated_impact": alert.estimated_impact,
                    "is_active": alert.is_active,
                    "acknowledged_at": alert.acknowledged_at,
                    "resolved_at": alert.resolved_at,
                    "created_at": alert.created_at,
                    "email_sent": alert.email_sent,
                    "sms_sent": alert.sms_sent,
                    "push_sent": alert.push_sent
                }
                for alert in alerts
            ],
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "per_page": limit
        }
    )

@router.get("/alerts/{alert_id}", response_model=APIResponse)
async def get_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific alert"""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    
    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )
    
    # Check permissions
    if current_user.role != "admin":
        site = db.query(GeologicalSite).filter(GeologicalSite.id == alert.site_id).first()
        if not site or site.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to access this alert"
            )
    
    return APIResponse(
        success=True,
        message="Alert retrieved successfully",
        data={
            "id": alert.id,
            "site_id": alert.site_id,
            "user_id": alert.user_id,
            "alert_type": alert.alert_type,
            "severity": alert.severity,
            "title": alert.title,
            "message": alert.message,
            "triggered_by": alert.triggered_by,
            "recommended_actions": alert.recommended_actions,
            "estimated_impact": alert.estimated_impact,
            "is_active": alert.is_active,
            "acknowledged_at": alert.acknowledged_at,
            "resolved_at": alert.resolved_at,
            "created_at": alert.created_at,
            "email_sent": alert.email_sent,
            "sms_sent": alert.sms_sent,
            "push_sent": alert.push_sent
        }
    )

@router.put("/alerts/{alert_id}/acknowledge", response_model=APIResponse)
async def acknowledge_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Acknowledge an alert"""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    
    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )
    
    # Check permissions
    if current_user.role != "admin":
        site = db.query(GeologicalSite).filter(GeologicalSite.id == alert.site_id).first()
        if not site or site.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to acknowledge this alert"
            )
    
    if alert.acknowledged_at:
        raise HTTPException(
            status_code=400,
            detail="Alert has already been acknowledged"
        )
    
    alert.acknowledged_at = datetime.utcnow()
    db.commit()
    
    return APIResponse(
        success=True,
        message="Alert acknowledged successfully",
        data={"alert_id": alert.id, "acknowledged_at": alert.acknowledged_at}
    )

@router.put("/alerts/{alert_id}/resolve", response_model=APIResponse)
async def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Resolve an alert"""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    
    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )
    
    # Check permissions
    if current_user.role != "admin":
        site = db.query(GeologicalSite).filter(GeologicalSite.id == alert.site_id).first()
        if not site or site.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to resolve this alert"
            )
    
    if alert.resolved_at:
        raise HTTPException(
            status_code=400,
            detail="Alert has already been resolved"
        )
    
    alert.resolved_at = datetime.utcnow()
    alert.is_active = False
    
    # Auto-acknowledge if not already acknowledged
    if not alert.acknowledged_at:
        alert.acknowledged_at = datetime.utcnow()
    
    db.commit()
    
    return APIResponse(
        success=True,
        message="Alert resolved successfully",
        data={"alert_id": alert.id, "resolved_at": alert.resolved_at}
    )

@router.get("/alerts/active", response_model=APIResponse)
async def get_active_alerts(
    site_id: Optional[int] = None,
    severity: Optional[RiskLevel] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all active alerts"""
    query = db.query(Alert).filter(Alert.is_active == True)
    
    # Filter by user access for non-admin users
    if current_user.role != "admin":
        user_sites = db.query(GeologicalSite.id).filter(GeologicalSite.owner_id == current_user.id).subquery()
        query = query.filter(Alert.site_id.in_(user_sites))
    
    # Apply filters
    if site_id:
        query = query.filter(Alert.site_id == site_id)
    if severity:
        query = query.filter(Alert.severity == severity)
    
    # Order by severity (critical first) and creation date
    severity_order = {
        'critical': 1,
        'high': 2,
        'medium': 3,
        'low': 4
    }
    
    alerts = query.order_by(Alert.created_at.desc()).all()
    
    # Sort by severity priority
    alerts.sort(key=lambda x: severity_order.get(x.severity, 5))
    
    return APIResponse(
        success=True,
        message="Active alerts retrieved successfully",
        data={
            "alerts": [
                {
                    "id": alert.id,
                    "site_id": alert.site_id,
                    "alert_type": alert.alert_type,
                    "severity": alert.severity,
                    "title": alert.title,
                    "message": alert.message,
                    "recommended_actions": alert.recommended_actions,
                    "created_at": alert.created_at,
                    "acknowledged_at": alert.acknowledged_at
                }
                for alert in alerts
            ],
            "total": len(alerts),
            "critical_count": len([a for a in alerts if a.severity == "critical"]),
            "high_count": len([a for a in alerts if a.severity == "high"]),
            "medium_count": len([a for a in alerts if a.severity == "medium"]),
            "low_count": len([a for a in alerts if a.severity == "low"])
        }
    )

@router.get("/alerts/stats", response_model=APIResponse)
async def get_alert_statistics(
    site_id: Optional[int] = None,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get alert statistics for the specified period"""
    from datetime import timedelta
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    query = db.query(Alert).filter(Alert.created_at >= start_date)
    
    # Filter by user access for non-admin users
    if current_user.role != "admin":
        user_sites = db.query(GeologicalSite.id).filter(GeologicalSite.owner_id == current_user.id).subquery()
        query = query.filter(Alert.site_id.in_(user_sites))
    
    if site_id:
        query = query.filter(Alert.site_id == site_id)
    
    alerts = query.all()
    
    # Calculate statistics
    total_alerts = len(alerts)
    active_alerts = len([a for a in alerts if a.is_active])
    resolved_alerts = len([a for a in alerts if a.resolved_at])
    acknowledged_alerts = len([a for a in alerts if a.acknowledged_at])
    
    severity_counts = {
        "critical": len([a for a in alerts if a.severity == "critical"]),
        "high": len([a for a in alerts if a.severity == "high"]),
        "medium": len([a for a in alerts if a.severity == "medium"]),
        "low": len([a for a in alerts if a.severity == "low"])
    }
    
    alert_type_counts = {}
    for alert in alerts:
        alert_type = alert.alert_type
        alert_type_counts[alert_type] = alert_type_counts.get(alert_type, 0) + 1
    
    # Calculate average response time (time to acknowledge)
    acknowledged_times = []
    for alert in alerts:
        if alert.acknowledged_at and alert.created_at:
            response_time = (alert.acknowledged_at - alert.created_at).total_seconds() / 60  # minutes
            acknowledged_times.append(response_time)
    
    avg_response_time = sum(acknowledged_times) / len(acknowledged_times) if acknowledged_times else 0
    
    return APIResponse(
        success=True,
        message="Alert statistics retrieved successfully",
        data={
            "period_days": days,
            "total_alerts": total_alerts,
            "active_alerts": active_alerts,
            "resolved_alerts": resolved_alerts,
            "acknowledged_alerts": acknowledged_alerts,
            "severity_breakdown": severity_counts,
            "alert_type_breakdown": alert_type_counts,
            "average_response_time_minutes": round(avg_response_time, 2),
            "acknowledgment_rate": round((acknowledged_alerts / total_alerts * 100) if total_alerts > 0 else 0, 2),
            "resolution_rate": round((resolved_alerts / total_alerts * 100) if total_alerts > 0 else 0, 2)
        }
    )
