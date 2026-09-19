import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
def get_health(db: Session = Depends(get_db)):

    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    return {
        "status": "ok",
        "database_connected": db_ok,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "service": "Illegal Sand Mining Detection API",
        "version": "1.0.0"
    }
