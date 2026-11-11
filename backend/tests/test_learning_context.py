from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_learning_context_rejects_empty_query():
    response = client.get("/api/v1/learning/context", params={"query": "a"})

    assert response.status_code == 422
