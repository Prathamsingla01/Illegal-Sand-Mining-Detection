import random
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.site import Site
from app.models.detection import Detection
from app.models.alert import Alert
from app.schemas.detection import DetectionResponse
from app.services.ai_engine import analyze_satellite_image

router = APIRouter(prefix="/analyze", tags=["AI Analysis"])


@router.post("", response_model=DetectionResponse, status_code=status.HTTP_201_CREATED)
async def analyze_image(

    file: UploadFile = File(...),
    site_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Upload satellite raster/optical image file."
        )

    contents = await file.read()
    
    # Retrieve target site info if provided
    site_obj = None
    if site_id:
        site_obj = db.query(Site).filter(Site.id == site_id).first()
    
    if not site_obj:
        site_obj = db.query(Site).first()

    site_info = {
        "id": site_obj.id if site_obj else "KV-MOH-04",
        "site_name": site_obj.site_name if site_obj else "Mohanur Sandbar Sector 4",
        "river": site_obj.river if site_obj else "Kaveri River",
        "district": site_obj.district if site_obj else "Namakkal",
        "latitude": site_obj.latitude if site_obj else 11.0524,
        "longitude": site_obj.longitude if site_obj else 78.1342
    }

    # Run AI inference / change detection engine
    metrics = analyze_satellite_image(contents, file.filename, site_info)

    # Save Detection to DB
    detection_db = Detection(
        id=metrics["id"],
        site_id=metrics["site_id"],
        site_name=metrics["site_name"],
        river=metrics["river"],
        district=metrics["district"],
        model_name=metrics["model_name"],
        detection_date=metrics["detection_date"],
        previous_observation_date=metrics["previous_observation_date"],
        current_observation_date=metrics["current_observation_date"],
        temporal_days=metrics["temporal_days"],
        change_detected=metrics["change_detected"],
        confidence=metrics["confidence"],
        status=metrics["status"],
        disturbed_area_m2=metrics["disturbed_area_m2"],
        disturbed_acres=metrics["disturbed_acres"],
        estimated_volume_m3=metrics["estimated_volume_m3"],
        truckloads_equivalent=metrics["truckloads_equivalent"],
        machinery_tracks=metrics["machinery_tracks"],
        machinery_pits=metrics["machinery_pits"],
        machinery_summary=metrics["machinery_summary"],
        machinery_footprint_note=metrics["machinery_footprint_note"],
        extraction_velocity_m3_per_day=metrics["extraction_velocity_m3_per_day"],
        velocity_spike_percent=metrics["velocity_spike_percent"],
        centroid=metrics["centroid"],
        sensors_used=metrics["sensors_used"],
        max_pit_depth_m=metrics["max_pit_depth_m"],
        permitted_depth_limit_m=metrics["permitted_depth_limit_m"],
        excess_depth_m=metrics["excess_depth_m"],
        mean_sand_thickness_m=metrics["mean_sand_thickness_m"],
        embankment_shear_angle=metrics["embankment_shear_angle"],
        embankment_shear_risk=metrics["embankment_shear_risk"],
        aquifer_exposure_status=metrics["aquifer_exposure_status"],
        illustrative_impact_cost=metrics["illustrative_impact_cost"],
        before_observation=metrics["before_observation"],
        after_observation=metrics["after_observation"],
        compliance_checks=metrics["compliance_checks"]
    )
    db.add(detection_db)

    # Save associated Alert to DB
    alert_id = f"ALT-{datetime.date.today().year}-{random.randint(1000, 9999)}"
    alert_db = Alert(
        id=alert_id,
        detection_id=detection_db.id,
        site_id=detection_db.site_id,
        site_name=detection_db.site_name,
        river=detection_db.river,
        district=detection_db.district,
        coords=f"{site_info['latitude']}° N, {site_info['longitude']}° E",
        created_at="Just now",
        relative_time="Just now",
        risk_level="HIGH",
        workflow_status="Open – Pending Action",
        estimated_volume_m3=detection_db.estimated_volume_m3,
        disturbed_area_m2=detection_db.disturbed_area_m2,
        detected_pattern=f"Uploaded image analysis ({detection_db.machinery_summary})",
        sensor="Sentinel-2 / PlanetScope Fusion",
        confidence=f"{detection_db.confidence * 100:.1f}%",
        assigned_officer="Insp. Sarah Jensen",
        assigned_role="GIS Enforcement Lead",
        urgency_text="Automated Model Inference Anomaly",
        action_required="Field patrol dispatch advisory recommended"
    )
    db.add(alert_db)

    # Update site state in DB
    if site_obj:
        site_obj.has_active_detection = True
        site_obj.detection_id = detection_db.id
        site_obj.risk = "HIGH"
        site_obj.estimated_depletion_volume_m3 = detection_db.estimated_volume_m3
        site_obj.area_sq_m = detection_db.disturbed_area_m2

    db.commit()
    db.refresh(detection_db)
    return detection_db
