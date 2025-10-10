from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_tips_list():
    r = client.get("/api/tips/")
    assert r.status_code == 200
    body = r.json()
    assert "items" in body and isinstance(body["items"], list)
    assert body["total"] == len(body["items"])