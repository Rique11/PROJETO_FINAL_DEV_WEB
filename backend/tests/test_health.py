from app.core.config import settings


def test_health_reports_storage_and_ai_mode(client):
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == settings.PROJECT_NAME
    assert data["storage"] == "memory"
    assert data["ai_provider"] == "local-fallback"


def test_docs_are_public(client):
    assert client.get("/docs").status_code == 200
    assert client.get("/api/v1/openapi.json").status_code == 200


def test_school_and_classrooms(client):
    assert client.get("/api/v1/school").json()["id"] == "sch-01"
    classrooms = client.get("/api/v1/classrooms").json()
    assert {item["id"] for item in classrooms} == {"cls-7a", "cls-8b"}
    assert client.get("/api/v1/classrooms/inexistente").status_code == 404
