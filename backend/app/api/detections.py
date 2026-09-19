from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.detection import Detection
from app.schemas.detection import DetectionResponse

router = APIRouter(prefix="/detections", tags=["Detections"])


@router.get("", response_model=List[DetectionResponse])
def get_detections(db: Session = Depends(get_db)):

    detections = db.query(Detection).all()
    return detections


@router.get("/{detection_id}", response_model=DetectionResponse)
def get_detection(detection_id: str, db: Session = Depends(get_db)):
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Detection record with ID '{detection_id}' not found."
        )
    return detection
