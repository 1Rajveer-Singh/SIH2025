from fastapi import APIRouter, HTTPException
from typing import List
from ..models.schemas import SlopeFaceReading, HydrogeologicalReading, GeologicalStructuralReading, OperationalReading, FormulaResult

router = APIRouter()

# Slope Face Endpoints
@router.post("/slope-face/readings", response_model=FormulaResult)
def create_slope_face_reading(reading: SlopeFaceReading):
    # Example calculation: velocity
    try:
        velocity = reading.velocity
        strain = reading.strain
        slope_angle = reading.slope_angle
        result = FormulaResult(
            formula="Velocity, Strain, Slope Angle",
            value=velocity,
            units="mm/day",
            details={"strain": strain, "slope_angle": slope_angle}
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Hydrogeological Endpoints
@router.post("/hydrogeological/readings", response_model=FormulaResult)
def create_hydrogeological_reading(reading: HydrogeologicalReading):
    try:
        effective_stress = reading.effective_stress
        cumulative_rainfall = reading.cumulative_rainfall
        result = FormulaResult(
            formula="Effective Stress, Cumulative Rainfall",
            value=effective_stress if effective_stress else 0.0,
            units="kPa",
            details={"cumulative_rainfall": cumulative_rainfall}
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Geological/Structural Endpoints
@router.post("/geological-structural/readings", response_model=FormulaResult)
def create_geological_structural_reading(reading: GeologicalStructuralReading):
    try:
        factor_of_safety = reading.factor_of_safety
        kinematic_feasibility = reading.kinematic_feasibility
        result = FormulaResult(
            formula="Factor of Safety, Kinematic Analysis",
            value=factor_of_safety if factor_of_safety else 0.0,
            units="",
            details={"kinematic_feasibility": kinematic_feasibility}
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Operational Endpoints
@router.post("/operational/readings", response_model=FormulaResult)
def create_operational_reading(reading: OperationalReading):
    try:
        ppv = reading.ppv
        scaled_distance = reading.scaled_distance
        result = FormulaResult(
            formula="PPV, Scaled Distance",
            value=ppv if ppv else 0.0,
            units="mm/s",
            details={"scaled_distance": scaled_distance}
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
