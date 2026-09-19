from sqlalchemy import Column, String, Float, Integer, Boolean, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Site(Base):
    __tablename__ = "sites"

    id = Column(String, primary_key=True, index=True)
    river = Column(String, nullable=False)
    site_name = Column(String, nullable=False)
    district = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    risk = Column(String, default="LOW")
    lease_status = Column(String, default="Permitted / Compliant")
    last_observation = Column(String, nullable=True)
    last_pass_orbit = Column(String, nullable=True)
    sensor = Column(String, nullable=True)
    cloud_cover = Column(Float, default=0.0)
    detected_changes_count = Column(Integer, default=0)
    detected_change_reason = Column(String, nullable=True)
    estimated_depletion_volume_m3 = Column(Float, default=0.0)
    area_sq_m = Column(Float, default=0.0)
    active_sorties = Column(String, nullable=True)
    has_active_detection = Column(Boolean, default=False)
    detection_id = Column(String, nullable=True)
    summary = Column(Text, nullable=True)

    detections = relationship("Detection", back_populates="site", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="site", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="site", cascade="all, delete-orphan")
