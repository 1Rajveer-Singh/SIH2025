from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.schemas import *
from app.models.database import GeologicalSite, RockProperty, User

router = APIRouter()

@router.post("/sites", response_model=APIResponse)
async def create_geological_site(
    site: GeologicalSiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new geological site"""
    db_site = GeologicalSite(
        **site.dict(),
        owner_id=current_user.id
    )
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    
    return APIResponse(
        success=True,
        message="Geological site created successfully",
        data={"site_id": db_site.id, "name": db_site.name}
    )

@router.get("/sites", response_model=APIResponse)
async def list_geological_sites(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List geological sites for current user"""
    query = db.query(GeologicalSite)
    
    # Non-admin users can only see their own sites
    if current_user.role != "admin":
        query = query.filter(GeologicalSite.owner_id == current_user.id)
    
    sites = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return APIResponse(
        success=True,
        message="Geological sites retrieved successfully",
        data={
            "sites": [
                {
                    "id": site.id,
                    "name": site.name,
                    "latitude": site.latitude,
                    "longitude": site.longitude,
                    "elevation": site.elevation,
                    "site_type": site.site_type,
                    "description": site.description,
                    "created_at": site.created_at,
                    "updated_at": site.updated_at
                }
                for site in sites
            ],
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "per_page": limit
        }
    )

@router.get("/sites/{site_id}", response_model=APIResponse)
async def get_geological_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific geological site"""
    site = db.query(GeologicalSite).filter(GeologicalSite.id == site_id).first()
    
    if not site:
        raise HTTPException(
            status_code=404,
            detail="Geological site not found"
        )
    
    # Check permissions
    if current_user.role != "admin" and site.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to access this site"
        )
    
    return APIResponse(
        success=True,
        message="Geological site retrieved successfully",
        data={
            "id": site.id,
            "name": site.name,
            "latitude": site.latitude,
            "longitude": site.longitude,
            "elevation": site.elevation,
            "site_type": site.site_type,
            "description": site.description,
            "created_at": site.created_at,
            "updated_at": site.updated_at,
            "owner_id": site.owner_id
        }
    )

@router.put("/sites/{site_id}", response_model=APIResponse)
async def update_geological_site(
    site_id: int,
    site_update: GeologicalSiteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a geological site"""
    site = db.query(GeologicalSite).filter(GeologicalSite.id == site_id).first()
    
    if not site:
        raise HTTPException(
            status_code=404,
            detail="Geological site not found"
        )
    
    # Check permissions
    if current_user.role != "admin" and site.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update this site"
        )
    
    update_data = site_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(site, field, value)
    
    db.commit()
    db.refresh(site)
    
    return APIResponse(
        success=True,
        message="Geological site updated successfully",
        data={"site_id": site.id}
    )

@router.delete("/sites/{site_id}", response_model=APIResponse)
async def delete_geological_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a geological site"""
    site = db.query(GeologicalSite).filter(GeologicalSite.id == site_id).first()
    
    if not site:
        raise HTTPException(
            status_code=404,
            detail="Geological site not found"
        )
    
    # Check permissions
    if current_user.role != "admin" and site.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to delete this site"
        )
    
    db.delete(site)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Geological site deleted successfully",
        data={"site_id": site_id}
    )

@router.post("/sites/{site_id}/rock-properties", response_model=APIResponse)
async def create_rock_properties(
    site_id: int,
    rock_props: RockPropertyBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add rock properties to a geological site"""
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
            detail="Not enough permissions to add rock properties to this site"
        )
    
    db_rock_props = RockProperty(
        **rock_props.dict(),
        site_id=site_id
    )
    db.add(db_rock_props)
    db.commit()
    db.refresh(db_rock_props)
    
    return APIResponse(
        success=True,
        message="Rock properties added successfully",
        data={"rock_property_id": db_rock_props.id}
    )

@router.get("/sites/{site_id}/rock-properties", response_model=APIResponse)
async def get_rock_properties(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get rock properties for a geological site"""
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
            detail="Not enough permissions to access this site"
        )
    
    rock_props = db.query(RockProperty).filter(RockProperty.site_id == site_id).all()
    
    return APIResponse(
        success=True,
        message="Rock properties retrieved successfully",
        data={
            "rock_properties": [
                {
                    "id": prop.id,
                    "rock_type": prop.rock_type,
                    "uniaxial_compressive_strength": prop.uniaxial_compressive_strength,
                    "tensile_strength": prop.tensile_strength,
                    "shear_strength": prop.shear_strength,
                    "cohesion": prop.cohesion,
                    "friction_angle": prop.friction_angle,
                    "fracture_spacing": prop.fracture_spacing,
                    "fracture_orientation": prop.fracture_orientation,
                    "fracture_persistence": prop.fracture_persistence,
                    "roughness_coefficient": prop.roughness_coefficient,
                    "aperture": prop.aperture,
                    "block_volume": prop.block_volume,
                    "kinematic_feasibility": prop.kinematic_feasibility,
                    "saturated_shear_strength": prop.saturated_shear_strength,
                    "porosity": prop.porosity,
                    "permeability": prop.permeability,
                    "created_at": prop.created_at,
                    "updated_at": prop.updated_at
                }
                for prop in rock_props
            ]
        }
    )

@router.get("/rock-types", response_model=APIResponse)
async def get_rock_types():
    """Get list of available rock types"""
    rock_types = [
        "Granite", "Limestone", "Sandstone", "Shale", "Basalt",
        "Quartzite", "Slate", "Marble", "Gneiss", "Schist",
        "Dolomite", "Conglomerate", "Volcanic Tuff"
    ]
    
    return APIResponse(
        success=True,
        message="Rock types retrieved successfully",
        data={"rock_types": rock_types}
    )

@router.get("/site-types", response_model=APIResponse)
async def get_site_types():
    """Get list of available site types"""
    site_types = [
        "open_pit_mine", "underground_mine", "road_cut", "natural_slope",
        "quarry", "construction_site", "railway_cut", "coastal_cliff"
    ]
    
    return APIResponse(
        success=True,
        message="Site types retrieved successfully",
        data={"site_types": site_types}
    )
