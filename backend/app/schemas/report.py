from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


def to_camel(string: str) -> str:
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class ReportResponse(BaseModel):
    id: str
    title: str
    site_id: str = Field(..., alias="siteId")
    site_name: str = Field(..., alias="siteName")
    river: str
    district: str
    detection_id: Optional[str] = Field(None, alias="detectionId")
    date: str
    detection_type: Optional[str] = Field(None, alias="detectionType")
    affected_area_m2: float = Field(0.0, alias="affectedAreaM2")
    estimated_volume_m3: float = Field(0.0, alias="estimatedVolumeM3")
    risk: str = "HIGH"
    status: str = "Draft Review"
    lead_investigator: Optional[str] = Field(None, alias="leadInvestigator")
    summary: Optional[str] = None
    recommendations: Optional[List[str]] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
