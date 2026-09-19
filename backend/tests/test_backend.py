import sys
import io
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))


# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_all_endpoints():
    print("=== Testing FastAPI Backend Endpoints ===")

    # 1. Health
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health failed: {res.text}"
    print("✅ GET /api/health passed:", res.json())

    # 2. Sites
    res = client.get("/api/sites")
    assert res.status_code == 200, f"Get sites failed: {res.text}"
    sites = res.json()
    assert len(sites) > 0, "No sites returned"
    print(f"✅ GET /api/sites passed (count: {len(sites)})")

    # 3. Get Single Site
    site_id = sites[0]["id"]
    res = client.get(f"/api/sites/{site_id}")
    assert res.status_code == 200, f"Get site {site_id} failed: {res.text}"
    print(f"✅ GET /api/sites/{site_id} passed")

    # 4. Create Site (Geofence)
    new_site_payload = {
        "river": "Narmada River",
        "siteName": "Test Sand Reach Alpha",
        "district": "Hoshangabad",
        "latitude": 22.75,
        "longitude": 77.72,
        "areaSqM": 30000
    }
    res = client.post("/api/sites", json=new_site_payload)
    assert res.status_code == 201, f"Create site failed: {res.text}"
    print(f"✅ POST /api/sites passed:", res.json()["id"])

    # 5. Detections
    res = client.get("/api/detections")
    assert res.status_code == 200, f"Get detections failed: {res.text}"
    detections = res.json()
    assert len(detections) > 0, "No detections returned"
    print(f"✅ GET /api/detections passed (count: {len(detections)})")

    # 6. Single Detection
    detection_id = detections[0]["id"]
    res = client.get(f"/api/detections/{detection_id}")
    assert res.status_code == 200, f"Get detection {detection_id} failed: {res.text}"
    print(f"✅ GET /api/detections/{detection_id} passed")

    # 7. Alerts
    res = client.get("/api/alerts")
    assert res.status_code == 200, f"Get alerts failed: {res.text}"
    alerts = res.json()
    assert len(alerts) > 0, "No alerts returned"
    print(f"✅ GET /api/alerts passed (count: {len(alerts)})")

    # 8. Single Alert
    alert_id = alerts[0]["id"]
    res = client.get(f"/api/alerts/{alert_id}")
    assert res.status_code == 200, f"Get alert {alert_id} failed: {res.text}"
    print(f"✅ GET /api/alerts/{alert_id} passed")

    # 9. Patch Alert Status
    patch_payload = {"workflowStatus": "Patrol Dispatched (Unit 4 On-Site)"}
    res = client.patch(f"/api/alerts/{alert_id}", json=patch_payload)
    assert res.status_code == 200, f"Patch alert status failed: {res.text}"
    print(f"✅ PATCH /api/alerts/{alert_id} passed:", res.json()["workflowStatus"])

    # 10. Reports
    res = client.get("/api/reports")
    assert res.status_code == 200, f"Get reports failed: {res.text}"
    reports = res.json()
    assert len(reports) > 0, "No reports returned"
    print(f"✅ GET /api/reports passed (count: {len(reports)})")

    # 11. Single Report
    report_id = reports[0]["id"]
    res = client.get(f"/api/reports/{report_id}")
    assert res.status_code == 200, f"Get report {report_id} failed: {res.text}"
    print(f"✅ GET /api/reports/{report_id} passed")

    # 12. AI Analysis Image Upload
    dummy_img = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc`\x00\x00\x00\x02\x00\x01H\xafA4\x00\x00\x00\x00IEND\xaeB`\x82")
    res = client.post(
        "/api/analyze",
        files={"file": ("test_satellite.png", dummy_img, "image/png")},
        data={"site_id": site_id}
    )
    assert res.status_code == 201, f"Analyze failed: {res.text}"
    analysis_res = res.json()
    print("✅ POST /api/analyze passed:", analysis_res["id"], f"confidence={analysis_res['confidence']}")

    print("\n🎉 ALL BACKEND ENDPOINTS VERIFIED SUCCESSFULLY!")


if __name__ == "__main__":
    test_all_endpoints()
