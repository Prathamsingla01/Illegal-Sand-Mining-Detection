import sys
import io
import psycopg2
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_frontend_backend_integration():
    print("=== Testing Frontend ↔ Backend Integration ===")

    # 1. Frontend fetch sites (GET /api/sites)
    res = client.get("/api/sites")
    assert res.status_code == 200
    sites = res.json()
    print(f"✅ Frontend loaded {len(sites)} sites from backend/PostgreSQL")

    # 2. Frontend fetch detections (GET /api/detections)
    res = client.get("/api/detections")
    assert res.status_code == 200
    detections = res.json()
    print(f"✅ Frontend loaded {len(detections)} detections from backend/PostgreSQL")

    # 3. Frontend fetch alerts (GET /api/alerts)
    res = client.get("/api/alerts")
    assert res.status_code == 200
    alerts = res.json()
    print(f"✅ Frontend loaded {len(alerts)} alerts from backend/PostgreSQL")

    # 4. Frontend fetch reports (GET /api/reports)
    res = client.get("/api/reports")
    assert res.status_code == 200
    reports = res.json()
    print(f"✅ Frontend loaded {len(reports)} reports from backend/PostgreSQL")

    # 5. Frontend alert status update (PATCH /api/alerts/{id})
    target_alert_id = alerts[0]["id"]
    new_workflow_status = "Under Legal Review"
    res = client.patch(
        f"/api/alerts/{target_alert_id}",
        json={"workflowStatus": new_workflow_status}
    )
    assert res.status_code == 200
    print(f"✅ Frontend updated alert {target_alert_id} workflow status to '{new_workflow_status}'")

    # 6. Frontend image analysis upload (POST /api/analyze)
    dummy_img = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc`\x00\x00\x00\x02\x00\x01H\xafA4\x00\x00\x00\x00IEND\xaeB`\x82")
    res = client.post(
        "/api/analyze",
        files={"file": ("frontend_upload_test.png", dummy_img, "image/png")},
        data={"site_id": sites[0]["id"]}
    )
    assert res.status_code == 201
    analysis_result = res.json()
    new_detection_id = analysis_result["id"]
    print(f"✅ Frontend submitted satellite image for analysis -> Generated Detection {new_detection_id}")

    # 7. Independent PostgreSQL direct database verification
    print("\n--- Independent PostgreSQL Direct Verification ---")
    conn = psycopg2.connect("postgresql://postgres:Postgres123@localhost:5432/illegal_sand_mining")
    cur = conn.cursor()

    # Check patched alert status
    cur.execute("SELECT id, workflow_status FROM alerts WHERE id = %s;", (target_alert_id,))
    alert_db_row = cur.fetchone()
    assert alert_db_row[1] == new_workflow_status, f"PostgreSQL alert status mismatch: {alert_db_row}"
    print(f"✅ PostgreSQL Alert Record Verified: {alert_db_row}")

    # Check newly created detection from image analysis upload
    cur.execute("SELECT id, site_id, confidence, status FROM detections WHERE id = %s;", (new_detection_id,))
    det_db_row = cur.fetchone()
    assert det_db_row is not None, "PostgreSQL missing new detection record"
    print(f"✅ PostgreSQL Detection Record Verified: {det_db_row}")

    conn.close()
    print("\n🎉 FRONTEND ↔ BACKEND INTEGRATION VERIFIED SUCCESSFULLY!")


if __name__ == "__main__":
    test_frontend_backend_integration()
