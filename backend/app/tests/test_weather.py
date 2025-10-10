from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_weather_alerts():
    r = client.get("/api/weather/alerts")
    assert r.status_code == 200
    body = r.json()
    assert "alerts" in body and isinstance(body["alerts"], list)
    assert body["source"] in {"static", "openweather", "fallback"}
