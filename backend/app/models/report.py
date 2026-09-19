from sqlalchemy import Column, String, Float, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    site_id = Column(String, ForeignKey("sites.id"), nullable=False, index=True)
    site_name = Column(String, nullable=False)
    river = Column(String, nullable=False)
    district = Column(String, nullable=False)
    detection_id = Column(String, ForeignKey("detections.id"), nullable=True, index=True)
    date = Column(String, nullable=False)
    detection_type = Column(String, nullable=True)
    affected_area_m2 = Column(Float, default=0.0)
    estimated_volume_m3 = Column(Float, default=0.0)
    risk = Column(String, default="HIGH")
    status = Column(String, default="Draft Review")
    lead_investigator = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    recommendations = Column(JSON, nullable=True)

    site = relationship("Site", back_populates="reports")
    detection = relationship("Detection", back_populates="reports")
