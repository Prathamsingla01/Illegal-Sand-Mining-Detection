from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.report import Report
from app.schemas.report import ReportResponse

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("", response_model=List[ReportResponse])
def get_reports(db: Session = Depends(get_db)):

    reports = db.query(Report).all()
    return reports


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{report_id}' not found."
        )
    return report
