def test_learning_context_rejects_short_query(client):
    response = client.get("/api/v1/learning/context", params={"query": "a"})

    assert response.status_code == 422
