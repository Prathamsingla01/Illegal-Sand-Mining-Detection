from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    detection_id = Column(String, ForeignKey("detections.id"), nullable=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), nullable=False, index=True)
    site_name = Column(String, nullable=False)
    river = Column(String, nullable=False)
    district = Column(String, nullable=False)
    coords = Column(String, nullable=True)
    created_at = Column(String, nullable=False)
    relative_time = Column(String, nullable=True)
    risk_level = Column(String, default="HIGH")
    workflow_status = Column(String, default="Open – Pending Action")
    estimated_volume_m3 = Column(Float, default=0.0)
    disturbed_area_m2 = Column(Float, default=0.0)
    detected_pattern = Column(String, nullable=True)
    sensor = Column(String, nullable=True)
    confidence = Column(String, nullable=True)
    assigned_officer = Column(String, nullable=True)
    assigned_role = Column(String, nullable=True)
    urgency_text = Column(String, nullable=True)
    action_required = Column(String, nullable=True)

    site = relationship("Site", back_populates="alerts")
    detection = relationship("Detection", back_populates="alerts")
