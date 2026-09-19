from typing import Optional, Any, Dict, List
from pydantic import BaseModel, ConfigDict, Field


def to_camel(string: str) -> str:
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class DetectionResponse(BaseModel):
    id: str
    site_id: str = Field(..., alias="siteId")
    site_name: str = Field(..., alias="siteName")
    river: str
    district: str
    model_name: str = Field("DeepHydro-SandNet v4.2", alias="modelName")
    detection_date: str = Field(..., alias="detectionDate")
    previous_observation_date: Optional[str] = Field(None, alias="previousObservationDate")
    current_observation_date: Optional[str] = Field(None, alias="currentObservationDate")
    temporal_days: int = Field(30, alias="temporalDays")
    change_detected: bool = Field(True, alias="changeDetected")
    confidence: float = 0.95
    status: str = "High-Confidence Change Detected — Pending Verification"
    disturbed_area_m2: float = Field(0.0, alias="disturbedAreaM2")
    disturbed_acres: Optional[str] = Field(None, alias="disturbedAcres")
    estimated_volume_m3: float = Field(0.0, alias="estimatedVolumeM3")
    truckloads_equivalent: Optional[str] = Field(None, alias="truckloadsEquivalent")
    machinery_tracks: int = Field(0, alias="machineryTracks")
    machinery_pits: int = Field(0, alias="machineryPits")
    machinery_summary: Optional[str] = Field(None, alias="machinerySummary")
    machinery_footprint_note: Optional[str] = Field(None, alias="machineryFootprintNote")
    extraction_velocity_m3_per_day: float = Field(0.0, alias="extractionVelocityM3PerDay")
    velocity_spike_percent: Optional[str] = Field(None, alias="velocitySpikePercent")
    centroid: Optional[Dict[str, Any]] = None
    sensors_used: Optional[str] = Field(None, alias="sensorsUsed")
    max_pit_depth_m: float = Field(0.0, alias="maxPitDepthM")
    permitted_depth_limit_m: float = Field(-1.0, alias="permittedDepthLimitM")
    excess_depth_m: float = Field(0.0, alias="excessDepthM")
    mean_sand_thickness_m: float = Field(1.0, alias="meanSandThicknessM")
    embankment_shear_angle: Optional[str] = Field(None, alias="embankmentShearAngle")
    embankment_shear_risk: Optional[str] = Field(None, alias="embankmentShearRisk")
    aquifer_exposure_status: Optional[str] = Field(None, alias="aquiferExposureStatus")
    illustrative_impact_cost: Optional[str] = Field(None, alias="illustrativeImpactCost")
    before_observation: Optional[Dict[str, Any]] = Field(None, alias="beforeObservation")
    after_observation: Optional[Dict[str, Any]] = Field(None, alias="afterObservation")
    compliance_checks: Optional[List[Dict[str, Any]]] = Field(None, alias="complianceChecks")

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
