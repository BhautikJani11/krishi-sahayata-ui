from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_chat_mock():
    payload = {"messages": [{"role": "user", "content": "Tell me about schemes"}]}
    r = client.post("/api/chat/", json=payload)
    assert r.status_code == 200
    body = r.json()
    assert "message" in body
