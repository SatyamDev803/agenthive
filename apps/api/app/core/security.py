# app/core/security.py
from datetime import datetime, timedelta, timezone
from jose import jwt
from uuid import uuid4
from passlib.hash import bcrypt_sha256
from .config import settings
from .redis_client import redis_client

def hash_password(password: str) -> str:
    return bcrypt_sha256.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt_sha256.verify(plain, hashed)

def create_access_token(user_id: str) -> str:
    jti = str(uuid4())
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user_id, "jti": jti, "exp": exp}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    ttl = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    redis_client.set(f"access:{jti}", user_id, ex=ttl)
    return token

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
