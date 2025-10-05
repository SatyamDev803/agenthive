from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.db import get_db
from ..core.security import hash_password
from ..models.user import User
from ..schemas.user import UserOut

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(email: str, password: str, name: str | None = None, db: AsyncSession = Depends(get_db)):
    exists = await db.execute(select(User).where(User.email == email))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email taken")
    user = User(email=email, name=name, password_hash=hash_password(password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"id": user.id, "email": user.email, "name": user.name}
