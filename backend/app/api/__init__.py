from fastapi import APIRouter
from app.api import health, sites, detections, alerts, reports, analyze

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(sites.router)
api_router.include_router(detections.router)
api_router.include_router(alerts.router)
api_router.include_router(reports.router)
api_router.include_router(analyze.router)

__all__ = ["api_router"]
