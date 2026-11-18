def test_list_and_filter_devices(client):
    all_devices = client.get("/api/v1/devices")
    available = client.get("/api/v1/devices", params={"device_status": "disponivel"})

    assert all_devices.status_code == 200
    assert len(all_devices.json()) == 6
    assert {item["status"] for item in available.json()} == {"disponivel"}


def test_get_unknown_device_returns_404(client):
    response = client.get("/api/v1/devices/dev-99")

    assert response.status_code == 404
    assert "não encontrado" in response.json()["detail"]


def test_create_device_and_reject_duplicate_patrimonio(client):
    payload = {"patrimonio": "dev-cr-0200", "type": "chromebook", "model": "Acer C733"}

    created = client.post("/api/v1/devices", json=payload)
    duplicated = client.post("/api/v1/devices", json=payload)

    assert created.status_code == 201
    assert created.json()["patrimonio"] == "DEV-CR-0200"
    assert created.json()["status"] == "disponivel"
    assert duplicated.status_code == 409


def test_send_device_to_maintenance(client):
    response = client.patch("/api/v1/devices/dev-03/status", json={"status": "manutencao"})

    assert response.status_code == 200
    assert response.json()["status"] == "manutencao"


def test_device_in_use_cannot_change_status(client):
    response = client.patch("/api/v1/devices/dev-01/status", json={"status": "manutencao"})

    assert response.status_code == 409


def test_em_uso_is_not_set_manually(client):
    response = client.patch("/api/v1/devices/dev-03/status", json={"status": "em_uso"})

    assert response.status_code == 422
