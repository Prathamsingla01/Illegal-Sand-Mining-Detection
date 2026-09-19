from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertResponse, AlertUpdateStatus

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):

    alerts = db.query(Alert).all()
    return alerts


@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert record with ID '{alert_id}' not found."
        )
    return alert


@router.patch("/{alert_id}", response_model=AlertResponse)
def update_alert_status(alert_id: str, status_in: AlertUpdateStatus, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert record with ID '{alert_id}' not found."
        )
    alert.workflow_status = status_in.workflow_status
    db.commit()
    db.refresh(alert)
    return alert
