from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


def to_camel(string: str) -> str:
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class SiteBase(BaseModel):
    river: str
    site_name: str = Field(..., alias="siteName")
    district: str
    latitude: float
    longitude: float
    risk: str = "LOW"
    lease_status: str = Field("Permitted / Compliant", alias="leaseStatus")
    last_observation: Optional[str] = Field(None, alias="lastObservation")
    last_pass_orbit: Optional[str] = Field(None, alias="lastPassOrbit")
    sensor: Optional[str] = Field(None, alias="sensor")
    cloud_cover: float = Field(0.0, alias="cloudCover")
    detected_changes_count: int = Field(0, alias="detectedChangesCount")
    detected_change_reason: Optional[str] = Field(None, alias="detectedChangeReason")
    estimated_depletion_volume_m3: float = Field(0.0, alias="estimatedDepletionVolumeM3")
    area_sq_m: float = Field(0.0, alias="areaSqM")
    active_sorties: Optional[str] = Field(None, alias="activeSorties")
    has_active_detection: bool = Field(False, alias="hasActiveDetection")
    detection_id: Optional[str] = Field(None, alias="detectionId")
    summary: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


class SiteCreate(BaseModel):
    river: Optional[str] = "Kaveri River"
    site_name: Optional[str] = Field(None, alias="siteName")
    district: Optional[str] = "Namakkal"
    latitude: Optional[float] = 11.05
    longitude: Optional[float] = 78.13
    area_sq_m: Optional[float] = Field(25000.0, alias="areaSqM")
    lease_status: Optional[str] = Field("Permitted / Compliant", alias="leaseStatus")

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


class SiteResponse(SiteBase):
    id: str
