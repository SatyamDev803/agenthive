from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..core.db import get_db
from ..core.security import verify_password, create_access_token
from ..schemas.auth import LoginIn, TokenOut
from ..models.user import User
from ..core.security import decode_token
from ..core.redis_client import redis_client

router = APIRouter()
bearer = HTTPBearer(auto_error=True)

@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == payload.email))
    user = res.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(user_id=str(user.id))
    return {"access_token": token}

@router.post("/logout")
async def logout(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    token = creds.credentials
    claims = decode_token(token)
    jti = claims.get("jti")
    if jti:
        redis_client.delete(f"access:{jti}")
    return {"ok": True}
