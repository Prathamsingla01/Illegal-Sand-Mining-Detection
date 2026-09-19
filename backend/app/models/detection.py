from sqlalchemy import Column, String, Float, Integer, Boolean, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Detection(Base):
    __tablename__ = "detections"

    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), nullable=False, index=True)
    site_name = Column(String, nullable=False)
    river = Column(String, nullable=False)
    district = Column(String, nullable=False)
    model_name = Column(String, default="DeepHydro-SandNet v4.2")
    detection_date = Column(String, nullable=False)
    previous_observation_date = Column(String, nullable=True)
    current_observation_date = Column(String, nullable=True)
    temporal_days = Column(Integer, default=30)
    change_detected = Column(Boolean, default=True)
    confidence = Column(Float, default=0.90)
    status = Column(String, default="High-Confidence Change Detected — Pending Verification")
    disturbed_area_m2 = Column(Float, default=0.0)
    disturbed_acres = Column(String, nullable=True)
    estimated_volume_m3 = Column(Float, default=0.0)
    truckloads_equivalent = Column(String, nullable=True)
    machinery_tracks = Column(Integer, default=0)
    machinery_pits = Column(Integer, default=0)
    machinery_summary = Column(String, nullable=True)
    machinery_footprint_note = Column(String, nullable=True)
    extraction_velocity_m3_per_day = Column(Float, default=0.0)
    velocity_spike_percent = Column(String, nullable=True)
    centroid = Column(JSON, nullable=True)
    sensors_used = Column(String, nullable=True)
    max_pit_depth_m = Column(Float, default=0.0)
    permitted_depth_limit_m = Column(Float, default=-1.0)
    excess_depth_m = Column(Float, default=0.0)
    mean_sand_thickness_m = Column(Float, default=1.0)
    embankment_shear_angle = Column(String, nullable=True)
    embankment_shear_risk = Column(String, nullable=True)
    aquifer_exposure_status = Column(String, nullable=True)
    illustrative_impact_cost = Column(String, nullable=True)
    before_observation = Column(JSON, nullable=True)
    after_observation = Column(JSON, nullable=True)
    compliance_checks = Column(JSON, nullable=True)

    site = relationship("Site", back_populates="detections")
    alerts = relationship("Alert", back_populates="detection")
    reports = relationship("Report", back_populates="detection")
