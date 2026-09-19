from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


def to_camel(string: str) -> str:
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class AlertResponse(BaseModel):
    id: str
    detection_id: Optional[str] = Field(None, alias="detectionId")
    site_id: str = Field(..., alias="siteId")
    site_name: str = Field(..., alias="siteName")
    river: str
    district: str
    coords: Optional[str] = None
    created_at: str = Field(..., alias="createdAt")
    relative_time: Optional[str] = Field(None, alias="relativeTime")
    risk_level: str = Field("HIGH", alias="riskLevel")
    workflow_status: str = Field("Open – Pending Action", alias="workflowStatus")
    estimated_volume_m3: float = Field(0.0, alias="estimatedVolumeM3")
    disturbed_area_m2: float = Field(0.0, alias="disturbedAreaM2")
    detected_pattern: Optional[str] = Field(None, alias="detectedPattern")
    sensor: Optional[str] = None
    confidence: Optional[str] = None
    assigned_officer: Optional[str] = Field(None, alias="assignedOfficer")
    assigned_role: Optional[str] = Field(None, alias="assignedRole")
    urgency_text: Optional[str] = Field(None, alias="urgencyText")
    action_required: Optional[str] = Field(None, alias="actionRequired")

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


class AlertUpdateStatus(BaseModel):
    workflow_status: str = Field(..., alias="workflowStatus")

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )
