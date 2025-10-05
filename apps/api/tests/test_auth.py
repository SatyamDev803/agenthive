import uuid

def test_register_login_logout_revokes_token(client):
    email = f"dev_{uuid.uuid4().hex[:8]}@example.com"
    password = "pass123"

    r = client.post(f"/api/users/register?email={email}&password={password}&name=Dev")
    assert r.status_code == 200

    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    auth = {"Authorization": f"Bearer {token}"}

    r = client.post("/api/projects/", json={"name": "Proj1", "description": "MVP"}, headers=auth)
    assert r.status_code == 200

    # logout -> remove jti from (fake) Redis
    r = client.post("/api/auth/logout", headers=auth)
    assert r.status_code == 200

    # revoked token should now be rejected
    r = client.get("/api/projects/", headers=auth)
    assert r.status_code in (401, 403)
