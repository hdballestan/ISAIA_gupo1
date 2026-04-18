import os

from jose import jwt

from app.db.database import SessionLocal
from app.models.ticket import RateLimitEntry


def _auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _register(client, email: str, password: str) -> dict:
    payload = {"email": email, "password": password}
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    return response.json()


def _login(client, email: str, password: str) -> dict:
    payload = {"email": email, "password": password}
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    return response.json()


def _clear_rate_limit_entries() -> None:
    db = SessionLocal()
    try:
        db.query(RateLimitEntry).delete()
        db.commit()
    finally:
        db.close()


def test_auth_register_and_login_returns_valid_jwt(client, unique_email: str) -> None:
    password = "secure-pass-123"
    _register(client, unique_email, password)
    login_data = _login(client, unique_email, password)
    token = login_data["access_token"]
    payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=["HS256"])
    assert payload["sub"] == unique_email
    assert payload["role"] == "citizen"


def test_admin_access_without_role_returns_403(client, unique_email: str) -> None:
    password = "secure-pass-123"
    _register(client, unique_email, password)
    login_data = _login(client, unique_email, password)
    token = login_data["access_token"]
    response = client.get("/api/v1/admin/tickets", headers=_auth_headers(token))
    assert response.status_code == 403


def test_ticket_rate_limit_blocks_second_request(client) -> None:
    _clear_rate_limit_entries()
    payload = {"description": "Necesito nuevo certificado para prueba", "honeypot": ""}
    first = client.post("/api/v1/tickets", json=payload)
    second = client.post("/api/v1/tickets", json=payload)
    assert first.status_code == 201
    assert second.status_code == 429


def test_admin_certificate_crud_flow(client) -> None:
    login_data = _login(client, "admin@certidoc.co", "admin_change_in_prod")
    headers = _auth_headers(login_data["access_token"])
    payload = {
        "name": "Certificado Test",
        "issuer": "Entidad Test",
        "portal_url": "https://example.com/cert",
    }
    created = client.post("/api/v1/admin/certificates", json=payload, headers=headers)
    cert_id = created.json()["id"]
    updated = client.put(
        f"/api/v1/admin/certificates/{cert_id}",
        json={**payload, "name": "Certificado Test Actualizado"},
        headers=headers,
    )
    deleted = client.delete(f"/api/v1/admin/certificates/{cert_id}", headers=headers)
    missing = client.get(f"/api/v1/certificates/{cert_id}")
    assert (created.status_code, updated.status_code, deleted.status_code) == (
        200,
        200,
        200,
    )
    assert missing.status_code == 404
