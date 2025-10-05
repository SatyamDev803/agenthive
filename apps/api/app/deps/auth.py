from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from ..core.security import decode_token
from ..core.redis_client import redis_client

bearer = HTTPBearer(auto_error=True)

async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)) -> str:
    token = creds.credentials
    try:
        claims = decode_token(token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    jti = claims.get("jti"); sub = claims.get("sub")
    if not jti or not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid claims")
    if not redis_client.exists(f"access:{jti}"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revoked or expired")
    return sub
