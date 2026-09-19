import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import engine, Base, SessionLocal
from app.models.site import Site
from app.models.detection import Detection
from app.models.alert import Alert
from app.models.report import Report

SEED_SITES = [
    {
        "id": "KV-MOH-04",
        "river": "Kaveri River",
        "site_name": "Mohanur Sandbar Sector 4",
        "district": "Namakkal",
        "latitude": 11.0524,
        "longitude": 78.1342,
        "risk": "HIGH",
        "lease_status": "Unauthorized (Under Review)",
        "last_observation": "2026-09-20",
        "last_pass_orbit": "#49129",
        "sensor": "Sentinel-2A MSI",
        "cloud_cover": 0.012,
        "detected_changes_count": 9,
        "detected_change_reason": "Pit excavation & machinery track clusters",
        "estimated_depletion_volume_m3": 38400.0,
        "area_sq_m": 42850.0,
        "active_sorties": "Unit 4 / Tamil Nadu Water Police",
        "has_active_detection": True,
        "detection_id": "RG-AI-2025-0842",
        "summary": "Large-scale sediment depression detected in mid-channel sand spit. Multiple hydraulic excavator signatures identified outside designated clearance zones."
    },
    {
        "id": "GD-RJM-02",
        "river": "Godavari River",
        "site_name": "Rajahmundry Downstream Reach",
        "district": "East Godavari",
        "latitude": 16.9891,
        "longitude": 81.7840,
        "risk": "HIGH",
        "lease_status": "Unauthorized (Under Review)",
        "last_observation": "2026-09-19",
        "last_pass_orbit": "#49114",
        "sensor": "PlanetScope (3m)",
        "cloud_cover": 0.008,
        "detected_changes_count": 6,
        "detected_change_reason": "Deep dredge channel cutting towards embankment",
        "estimated_depletion_volume_m3": 46200.0,
        "area_sq_m": 51200.0,
        "active_sorties": "Godavari Fluvial Wing",
        "has_active_detection": True,
        "detection_id": "RG-AI-2025-0729",
        "summary": "Significant bathymetric drop detected near river bend. High risk of embankment shear during monsoon high-flow conditions."
    },
    {
        "id": "SB-GHT-01",
        "river": "Subarnarekha River",
        "site_name": "Ghatshila Sand Reach Beta",
        "district": "East Singhbhum",
        "latitude": 22.5812,
        "longitude": 86.4801,
        "risk": "HIGH",
        "lease_status": "Expired / Suspended",
        "last_observation": "2026-09-20",
        "last_pass_orbit": "#49132",
        "sensor": "Sentinel-1 C-SAR",
        "cloud_cover": 0.034,
        "detected_changes_count": 7,
        "detected_change_reason": "Nocturnal barge docking & suction pipeline deployment",
        "estimated_depletion_volume_m3": 29800.0,
        "area_sq_m": 33100.0,
        "active_sorties": "Subarnarekha Surveillance UAV-1",
        "has_active_detection": True,
        "detection_id": "RG-AI-2025-0618",
        "summary": "Radar coherence shift matches nighttime suction dredging footprint on expired concession boundary."
    }
]

SEED_DETECTIONS = [
    {
        "id": "RG-AI-2025-0842",
        "site_id": "KV-MOH-04",
        "site_name": "Mohanur Sandbar Sector 4",
        "river": "Kaveri River",
        "district": "Namakkal Sub-Division",
        "model_name": "DeepHydro-SandNet v4.2",
        "detection_date": "2026-09-20",
        "previous_observation_date": "2026-08-18",
        "current_observation_date": "2026-09-20",
        "temporal_days": 33,
        "change_detected": True,
        "confidence": 0.968,
        "status": "High-Confidence Change Detected — Pending Verification",
        "disturbed_area_m2": 42850.0,
        "disturbed_acres": "10.6 Acres Riverbed Encroached",
        "estimated_volume_m3": 38400.0,
        "truckloads_equivalent": "~2,560 tipper truckloads",
        "machinery_tracks": 14,
        "machinery_pits": 3,
        "machinery_summary": "14 Tracks / 3 Pits",
        "machinery_footprint_note": "High-Duty Hydraulic Excavators Active",
        "extraction_velocity_m3_per_day": 1450.0,
        "velocity_spike_percent": "+316% Above Threshold Velocity",
        "centroid": {"lat": 11.0524, "lng": 78.1342, "label": "11.0524° N, 78.1342° E"},
        "sensors_used": "Sentinel-2 MSI (10m) + PlanetScope SuperDove (3m) + Sentinel-1 C-SAR",
        "max_pit_depth_m": -3.85,
        "permitted_depth_limit_m": -1.0,
        "excess_depth_m": 2.85,
        "mean_sand_thickness_m": 1.4,
        "embankment_shear_angle": "38°",
        "embankment_shear_risk": "Critical Slope Failure / Collapse Warning",
        "aquifer_exposure_status": "Shallow Perched Layer Breached",
        "illustrative_impact_cost": "Illustrative cost-of-impact range: ₹45–65 lakh — not a legal determination",
        "before_observation": {
            "date": "18 Aug 2026",
            "sensor": "Sentinel-2 MSI (10m)",
            "status": "Pristine Riverbed · No Active Pits",
            "cloudCover": "0.8%"
        },
        "after_observation": {
            "date": "20 Sep 2026",
            "sensor": "PlanetScope (3m) + Sentinel-1 SAR",
            "status": "Volumetric Deficit: -38,400 m³ (estimated)",
            "cloudCover": "1.2%"
        },
        "compliance_checks": [
            {
                "id": "comp-1",
                "title": "Lease Boundary Assessment — Flagged for Review",
                "severity": "HIGH",
                "detail": "GIS polygon shift indicates extraction activity extending 185m beyond approved mining boundary perimeter."
            },
            {
                "id": "comp-2",
                "title": "Ecological Stability Threat — Critical Warning",
                "severity": "HIGH",
                "detail": "Riverbank undercut angle (38°) exceeds geotechnical slope stability limit (factor of safety < 1.1)."
            }
        ]
    }
]

SEED_ALERTS = [
    {
        "id": "ALT-2025-0982",
        "detection_id": "RG-AI-2025-0842",
        "site_id": "KV-MOH-04",
        "site_name": "Mohanur Sandbar Sector 4",
        "river": "Kaveri River",
        "district": "Namakkal",
        "coords": "11.0524° N, 78.1342° E",
        "created_at": "Today 09:42 UTC",
        "relative_time": "18m ago",
        "risk_level": "HIGH",
        "workflow_status": "Open – Pending Action",
        "estimated_volume_m3": 38400.0,
        "disturbed_area_m2": 42850.0,
        "detected_pattern": "Heavy excavator cluster & riparian buffer proximity (14 tracks / 3 pits)",
        "sensor": "Sentinel-2A / PlanetScope Fusion",
        "confidence": "96.8%",
        "assigned_officer": "Insp. Sarah Jensen",
        "assigned_role": "GIS Enforcement Lead",
        "urgency_text": "High-Confidence Anomaly Detected",
        "action_required": "Field patrol dispatch advisory recommended"
    }
]

SEED_REPORTS = [
    {
        "id": "REP-2026-084",
        "title": "Mohanur Sandbar Volumetric Deficit & Boundary Review Dossier",
        "site_id": "KV-MOH-04",
        "site_name": "Mohanur Sandbar Sector 4",
        "river": "Kaveri River",
        "district": "Namakkal",
        "detection_id": "RG-AI-2025-0842",
        "date": "2026-09-20",
        "detection_type": "Multi-Spectral & SAR Fusion",
        "affected_area_m2": 42850.0,
        "estimated_volume_m3": 38400.0,
        "risk": "HIGH",
        "status": "Draft Review",
        "lead_investigator": "Insp. Sarah Jensen",
        "summary": "Comprehensive multi-temporal satellite analysis demonstrating 42,850 m² riverbed disturbance.",
        "recommendations": [
            "Dispatch joint ground verification taskforce with handheld DGPS equipment",
            "Request revenue department survey demarcating official Khasra lease boundaries"
        ]
    }
]


def seed_database():
    print("[Seed] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if db.query(Site).count() == 0:
            print("[Seed] Seeding sites...")
            for data in SEED_SITES:
                db.add(Site(**data))
            db.commit()

        if db.query(Detection).count() == 0:
            print("[Seed] Seeding detections...")
            for data in SEED_DETECTIONS:
                db.add(Detection(**data))
            db.commit()

        if db.query(Alert).count() == 0:
            print("[Seed] Seeding alerts...")
            for data in SEED_ALERTS:
                db.add(Alert(**data))
            db.commit()

        if db.query(Report).count() == 0:
            print("[Seed] Seeding reports...")
            for data in SEED_REPORTS:
                db.add(Report(**data))
            db.commit()

        print("[Seed] Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"[Seed] Error during database seeding: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
