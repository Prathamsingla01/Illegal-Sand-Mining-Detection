import random
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.site import Site
from app.schemas.site import SiteResponse, SiteCreate

router = APIRouter(prefix="/sites", tags=["Sites"])


@router.get("", response_model=List[SiteResponse])
def get_sites(db: Session = Depends(get_db)):
    sites = db.query(Site).all()
    return sites


@router.get("/{site_id}", response_model=SiteResponse)
def get_site(site_id: str, db: Session = Depends(get_db)):
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Monitoring site with ID '{site_id}' not found."
        )
    return site


@router.post("", response_model=SiteResponse, status_code=status.HTTP_201_CREATED)
def create_site(site_in: SiteCreate, db: Session = Depends(get_db)):

    existing_count = db.query(Site).count()
    new_id = f"KV-NEW-{existing_count + 1:02d}"

    
    site_obj = Site(
        id=new_id,
        river=site_in.river or "Kaveri River",
        site_name=site_in.site_name or "New Riverbed Geofence",
        district=site_in.district or "Namakkal",
        latitude=site_in.latitude or 11.12,
        longitude=site_in.longitude or 78.20,
        risk="LOW",
        lease_status=site_in.lease_status or "Permitted / Compliant",
        last_observation="2026-09-20",
        last_pass_orbit="#49135",
        sensor="Sentinel-2A MSI",
        cloud_cover=0.01,
        detected_changes_count=0,
        detected_change_reason="Baseline geofence registered",
        estimated_depletion_volume_m3=0.0,
        area_sq_m=site_in.area_sq_m or 25000.0,
        active_sorties="Assigned Surveillance Unit",
        has_active_detection=False,
        summary="New monitored polygon perimeter registered into automated hydrological inference pipeline."
    )
    db.add(site_obj)
    db.commit()
    db.refresh(site_obj)
    return site_obj
